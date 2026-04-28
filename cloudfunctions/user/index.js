/**
 * 用户登录云函数
 * 处理用户注册和登录，支持密码认证
 *
 * 调用方式：
 *   action: 'register'       - 密码注册（data: { phone, password }）
 *   action: 'login'          - 密码登录（data: { phone, password }）
 *   action: 'getUserInfo'    - 获取当前用户详细信息（需要 event.phone）
 *   action: 'updateUserInfo' - 更新用户信息（data: { nickname, birthday, avatar, qq, alipay, wechat, gender }）
 *   action: 'changePassword' - 修改密码（data: { oldPassword, newPassword }）
 *   action: 'deleteAccount'  - 注销账号
 */

const cloudbase = require('@cloudbase/node-sdk')
const crypto = require('crypto')

const app = cloudbase.init({
  env: 'todo-9g0tchg88d1d3347',
})

const db = app.database()

// 密码加密
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

// 获取用户ID：优先从 event.phone 获取，其次从 context.userInfo
function getUserId(event, context) {
  const phone = event.phone
  if (phone) return phone

  const userInfo = context.userInfo
  if (userInfo && userInfo.customUserId) {
    return userInfo.customUserId
  }

  return null
}

exports.main = async (event, context) => {
  const { action, data } = event

  try {
    switch (action) {
      case 'register':
        return await handleRegister(data)

      case 'login':
        return await handleLogin(data)

      case 'getUserInfo':
        return await handleGetUserInfo(event, context)

      case 'updateUserInfo':
        return await handleUpdateUserInfo(event, context, data)

      case 'changePassword':
        return await handleChangePassword(event, context, data)

      case 'deleteAccount':
        return await handleDeleteAccount(event, context)

      default:
        return { success: false, message: '未知操作: ' + action }
    }
  } catch (error) {
    console.error('云函数 user 执行失败 [' + action + ']:', error)
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

  const userId = phone

  const existing = await db.collection('users').where({ userId }).get()
  if (existing.data.length > 0) {
    return { success: false, message: '该手机号已注册' }
  }

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

  return {
    success: true,
    message: '注册成功',
    user: { userId, phone },
  }
}

/**
 * 用户登录
 */
async function handleLogin({ phone, password }) {
  if (!phone || !password) {
    return { success: false, message: '手机号和密码不能为空' }
  }

  const userId = phone

  const userRes = await db.collection('users').where({ userId }).get()

  if (userRes.data.length === 0) {
    return { success: false, message: '该账号未注册，请先注册' }
  }

  const user = userRes.data[0]

  const hashedPassword = hashPassword(password)
  if (hashedPassword !== user.password) {
    return { success: false, message: '密码错误' }
  }

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
  }
}

/**
 * 获取当前用户详细信息
 */
async function handleGetUserInfo(event, context) {
  const userId = getUserId(event, context)
  if (!userId) {
    return { success: false, message: '未登录' }
  }

  const userRes = await db.collection('users').where({ userId }).get()
  if (userRes.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userRes.data[0]
  return {
    success: true,
    data: {
      userId: user.userId,
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
async function handleUpdateUserInfo(event, context, data) {
  const userId = getUserId(event, context)
  if (!userId) {
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

  await db.collection('users').where({ userId }).update(updateData)

  return { success: true, message: '更新成功' }
}

/**
 * 修改密码
 */
async function handleChangePassword(event, context, data) {
  const userId = getUserId(event, context)
  if (!userId) {
    return { success: false, message: '未登录' }
  }

  const { oldPassword, newPassword } = data

  if (!oldPassword || !newPassword) {
    return { success: false, message: '密码不能为空' }
  }

  if (newPassword.length < 6) {
    return { success: false, message: '新密码至少6位' }
  }

  const userRes = await db.collection('users').where({ userId }).get()
  if (userRes.data.length === 0) {
    return { success: false, message: '用户不存在' }
  }

  const user = userRes.data[0]

  const hashedOldPassword = hashPassword(oldPassword)
  if (hashedOldPassword !== user.password) {
    return { success: false, message: '当前密码错误' }
  }

  await db.collection('users').where({ userId }).update({
    password: hashPassword(newPassword),
    updatedAt: new Date(),
  })

  return { success: true, message: '密码修改成功' }
}

/**
 * 注销账号
 */
async function handleDeleteAccount(event, context) {
  const userId = getUserId(event, context)
  if (!userId) {
    return { success: false, message: '未登录' }
  }

  // 删除用户所有任务
  await db.collection('tasks').where({ userId }).remove()

  // 删除用户信息
  await db.collection('users').where({ userId }).remove()

  return { success: true, message: '账号已注销' }
}
