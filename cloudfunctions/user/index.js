/**
 * 用户登录云函数
 * 处理用户注册和登录，支持密码和验证码两种方式
 *
 * 调用方式：
 *   action: 'register'      - 密码注册（data: { phone, password }）
 *   action: 'login'         - 密码登录（data: { phone, password }）
 *   action: 'phoneRegister' - 手机验证码注册（data: { phone, code }）
 *   action: 'phoneLogin'    - 手机验证码登录（data: { phone, code }）
 *   action: 'sendCode'     - 发送验证码（data: { phone }）
 *   action: 'getUser'       - 获取当前用户基本信息
 *   action: 'getUserInfo'   - 获取当前用户详细信息
 *   action: 'updateUserInfo' - 更新用户信息（data: { nickname, birthday, avatar, qq, alipay, wechat, gender }）
 *   action: 'changePassword' - 修改密码（data: { oldPassword, newPassword }）
 *   action: 'deleteAccount' - 注销账号
 */

// 验证码缓存（生产环境应使用数据库或Redis）
const codeCache = new Map()
const CODE_EXPIRE_TIME = 5 * 60 * 1000 // 5分钟有效
const CODE_DEBUG = '123456' // 开发环境测试验证码

const cloudbase = require('@cloudbase/node-sdk')
const crypto = require('crypto')

const app = cloudbase.init({
  env: 'todo-9g0tchg88d1d3347',
})

const db = app.database()
const _ = db.command

// 密码加密
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// 生成自定义登录凭证
function generateTicket(phone) {
  const random = crypto.randomBytes(16).toString('hex')
  const timestamp = Date.now()
  return `${phone}_${timestamp}_${random}`
}

exports.main = async (event, context) => {
  const { action, data } = event

  try {
    switch (action) {
      case 'register':
        return await handleRegister(data)

      case 'login':
        return await handleLogin(data)

      case 'phoneRegister':
        return await handlePhoneRegister(data)

      case 'phoneLogin':
        return await handlePhoneLogin(data)

      case 'sendCode':
        return await handleSendCode(data)

      case 'getUser':
        return await handleGetUser(context)

      case 'getUserInfo':
        return await handleGetUserInfo(context)

      case 'updateUserInfo':
        return await handleUpdateUserInfo(context, data)

      case 'changePassword':
        return await handleChangePassword(context, data)

      case 'deleteAccount':
        return await handleDeleteAccount(context)

      default:
        return { success: false, message: `未知操作: ${action}` }
    }
  } catch (error) {
    console.error(`云函数 user 执行失败 [${action}]:`, error)
    return { success: false, message: error.message }
  }
}

/**
 * 用户注册
 */
async function handleRegister({ phone, password }) {
  if (!phone || !password) {
    return { success: false, message: '手机号和密码不能为空' }
  }

  if (!/^1[3-9]\d{9}$/.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }

  if (password.length < 6) {
    return { success: false, message: '密码至少6位' }
  }

  const userId = phone // 使用手机号作为用户 ID

  // 检查用户是否已存在
  const existing = await db.collection('users').where({ userId }).get()
  if (existing.data.length > 0) {
    return { success: false, message: '该手机号已注册' }
  }

  // 创建新用户
  const user = {
    userId,
    phone,
    password: hashPassword(password),
    nickname: '',
    birthday: '',
    gender: '',
    avatar: 1,
    wechat: '',
    qq: '',
    alipay: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.collection('users').add(user)

  // 生成登录凭证
  const ticket = generateTicket(phone)

  return {
    success: true,
    message: '注册成功',
    user: {
      userId,
      phone,
    },
    ticket,
  }
}

/**
 * 手机验证码注册（使用密码方式，实际上就是普通注册）
 */
async function handlePhoneRegister({ phone, password }) {
  return await handleRegister({ phone, password })
}

/**
 * 手机验证码登录（使用密码方式，实际上就是普通登录）
 */
async function handlePhoneLogin({ phone, password }) {
  return await handleLogin({ phone, password })
}

/**
 * 发送手机验证码（开发环境返回固定验证码）
 */
async function handleSendCode({ phone }) {
  if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
    return { success: false, message: '手机号格式不正确' }
  }

  // 生成验证码（开发环境使用固定验证码，生产环境应该调用短信服务）
  const code = CODE_DEBUG

  // 存储验证码
  codeCache.set(phone, {
    code,
    expires: Date.now() + CODE_EXPIRE_TIME,
  })

  // 开发环境返回验证码
  console.log(`验证码: ${code}`)

  return {
    success: true,
    message: '验证码已发送',
    devCode: code, // 开发环境返回验证码
  }
}

/**
 * 用户登录
 */
async function handleLogin({ phone, password }) {
  if (!phone || !password) {
    return { success: false, message: '手机号和密码不能为空' }
  }

  const userId = phone // 使用手机号作为用户 ID

  // 查询用户
  const userRes = await db.collection('users').where({ userId }).get()

  if (userRes.data.length === 0) {
    return { success: false, message: '该账号未注册，请先注册' }
  }

  const user = userRes.data[0]

  // 验证密码
  const hashedPassword = hashPassword(password)
  if (hashedPassword !== user.password) {
    return { success: false, message: '密码错误' }
  }

  // 生成登录凭证
  const ticket = generateTicket(phone)

  return {
    success: true,
    message: '登录成功',
    user: {
      userId: user.userId,
      phone: user.phone,
      nickname: user.nickname,
      birthday: user.birthday,
      gender: user.gender,
      avatar: user.avatar,
    },
    ticket,
  }
}

/**
 * 获取当前用户基本信息
 */
async function handleGetUser(context) {
  const { userInfo } = context
  const customUserId = userInfo && userInfo.customUserId

  if (!customUserId) {
    return { success: false, message: '未登录', user: null }
  }

  // 通过 customUserId 查找用户（兼容旧数据：也尝试用 customUserId 直接查询）
  let userRes = await db.collection('users').where({ customUserId }).get()
  
  // 如果没找到，尝试用 customUserId 作为 userId 查询（旧数据兼容）
  if (userRes.data.length === 0) {
    userRes = await db.collection('users').where({ userId: customUserId }).get()
  }

  if (userRes.data.length === 0) {
    return { success: false, message: '用户不存在', user: null }
  }

  const user = userRes.data[0]
  return {
    success: true,
    user: {
      userId: user.userId || user.phone,
      phone: user.phone,
      nickname: user.nickname,
    },
  }
}

/**
 * 获取当前用户详细信息
 */
async function handleGetUserInfo(context) {
  const { userInfo } = context
  const customUserId = userInfo && userInfo.customUserId

  if (!customUserId) {
    return { success: false, message: '未登录', data: null }
  }

  // 通过 customUserId 查找用户（兼容旧数据：也尝试用 customUserId 直接查询）
  let userRes = await db.collection('users').where({ customUserId }).get()
  
  // 如果没找到，尝试用 customUserId 作为 userId 查询（旧数据兼容）
  if (userRes.data.length === 0) {
    userRes = await db.collection('users').where({ userId: customUserId }).get()
  }

  if (userRes.data.length === 0) {
    return { success: false, message: '用户不存在', data: null }
  }

  const user = userRes.data[0]
  return {
    success: true,
    data: {
      userId: user.userId || user.phone,
      phone: user.phone,
      nickname: user.nickname || '',
      birthday: user.birthday || '',
      gender: user.gender || '',
      avatar: user.avatar || 1,
      wechat: user.wechat || '',
      qq: user.qq || '',
      alipay: user.alipay || '',
    },
  }
}

/**
 * 更新用户信息
 */
async function handleUpdateUserInfo(context, data) {
  const { userInfo } = context
  const customUserId = userInfo && userInfo.customUserId

  if (!customUserId) {
    return { success: false, message: '未登录' }
  }

  const { nickname, birthday, gender, avatar, qq, alipay, wechat } = data
  const updateData = { updatedAt: new Date() }

  if (nickname !== undefined) updateData.nickname = nickname
  if (birthday !== undefined) updateData.birthday = birthday
  if (gender !== undefined) updateData.gender = gender
  if (avatar !== undefined) updateData.avatar = avatar
  if (qq !== undefined) updateData.qq = qq
  if (alipay !== undefined) updateData.alipay = alipay
  if (wechat !== undefined) updateData.wechat = wechat

  await db.collection('users').where({ userId: customUserId }).update(updateData)

  return { success: true, message: '更新成功' }
}

/**
 * 修改密码
 */
async function handleChangePassword(context, data) {
  const { userInfo } = context
  const customUserId = userInfo && userInfo.customUserId

  if (!customUserId) {
    return { success: false, message: '未登录' }
  }

  const { oldPassword, newPassword } = data

  if (!oldPassword || !newPassword) {
    return { success: false, message: '密码不能为空' }
  }

  if (newPassword.length < 6) {
    return { success: false, message: '新密码至少6位' }
  }

  // 获取用户
  const userRes = await db.collection('users').where({ userId: customUserId }).get()
  if (userRes.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userRes.data[0]

  // 验证旧密码
  const hashedOldPassword = hashPassword(oldPassword)
  if (hashedOldPassword !== user.password) {
    return { success: false, message: '当前密码错误' }
  }

  // 更新密码
  await db.collection('users').where({ userId: customUserId }).update({
    password: hashPassword(newPassword),
    updatedAt: new Date(),
  })

  return { success: true, message: '密码修改成功' }
}

/**
 * 注销账号
 */
async function handleDeleteAccount(context) {
  const { userInfo } = context
  const customUserId = userInfo && userInfo.customUserId

  if (!customUserId) {
    return { success: false, message: '未登录' }
  }

  // 删除用户数据
  await db.collection('users').where({ userId: customUserId }).remove()

  // 删除该用户的所有任务
  await db.collection('tasks').where({ userId: customUserId }).remove()

  return { success: true, message: '账号已注销' }
}