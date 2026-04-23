import type { Task } from '@/types/task'
import { loadAppData, saveAppData } from '@/utils/storage'
import { taskStore } from '@/stores/taskStore'
import cloudbase from '@cloudbase/js-sdk'

/**
 * 用户信息类型
 */
export interface UserInfo {
  userId: string
  phone: string
  isLoggedIn: boolean
}

/**
 * 云端同步管理
 * 使用腾讯云 CloudBase 云函数实现跨设备同步
 */

// 默认环境 ID
const ENV_ID = 'todo-9g0tchg88d1d3347'

let appInstance: any = null

/**
 * 获取 CloudBase 应用实例
 */
function getApp(): any {
  if (!appInstance) {
    appInstance = cloudbase.init({
      env: ENV_ID,
    })
  }
  return appInstance
}

/**
 * 安全地获取登录状态
 */
async function safeGetLoginState(): Promise<any> {
  try {
    const app = getApp()
    const auth = app.auth()
    return await auth.getLoginState()
  } catch (e) {
    console.warn('getLoginState 失败:', e)
    return null
  }
}

/**
 * 安全地进行匿名登录
 */
async function safeAnonymousLogin(): Promise<boolean> {
  try {
    const app = getApp()
    const auth = app.auth()
    await auth.anonymousAuthProvider().signIn()
    return true
  } catch (e) {
    console.warn('匿名登录失败:', e)
    return false
  }
}

/**
 * 确保有有效的登录状态
 */
async function ensureAuth(): Promise<boolean> {
  try {
    // 先检查登录状态
    const loginState = await safeGetLoginState()
    
    if (loginState?.user) {
      return true
    }
    
    // 没有登录状态，进行匿名登录
    return await safeAnonymousLogin()
  } catch (e) {
    console.warn('ensureAuth 失败:', e)
    return true // 即使失败也继续尝试
  }
}

/**
 * 调用云函数
 */
export async function callFunction(name: string, data: Record<string, any>): Promise<any> {
  const app = getApp()
  
  // 确保有登录状态
  await ensureAuth()
  
  // 如果是 tasks 云函数，自动添加手机号用于数据隔离
  let finalData = { ...data }
  if (name === 'tasks') {
    const phone = taskStore.user?.phone
    console.log('tasks 调用 - phone:', phone, 'user:', taskStore.user)
    // 把 phone 放到 data 对象的顶层
    if (phone) {
      finalData.phone = phone
    }
    console.log('tasks 调用 - finalData:', finalData)
  }
  
  console.log('调用云函数:', name, finalData)
  
  try {
    const result = await app.callFunction({
      name,
      data: finalData,
    })
    console.log('云函数 SDK 返回原始结果:', name, JSON.stringify(result))
    console.log('云函数返回:', name, result.result)
    return result.result
  } catch (error: any) {
    console.error('云函数调用失败:', name, error)
    throw error
  }
}

/**
 * 匿名登录
 */
export async function anonymousLogin(): Promise<boolean> {
  return await ensureAuth()
}

/**
 * 确保登录
 */
async function ensureLogin(): Promise<boolean> {
  return await ensureAuth()
}

/**
 * 从云端获取任务列表
 */
export async function fetchCloudTasks(): Promise<Task[]> {
  const res = await callFunction('tasks', { action: 'list' })
  if (res.success && res.data) {
    return res.data.map((t: any) => ({
      ...t,
      id: t._id || t.id,
    }))
  }
  return []
}

/**
 * 全量同步本地任务到云端
 */
export async function syncTasksToCloud(
  tasks: Task[]
): Promise<{ success: boolean; message: string }> {
  const res = await callFunction('tasks', {
    action: 'sync',
    data: { tasks },
  })
  if (res.success) {
    return { success: true, message: `同步成功，共 ${res.synced} 条任务` }
  }
  return { success: false, message: res.message || '同步失败' }
}

/**
 * 创建云端任务
 */
export async function createCloudTask(
  task: Partial<Task>
): Promise<{ success: boolean; message: string }> {
  const res = await callFunction('tasks', {
    action: 'create',
    data: task,
  })
  if (res.success) {
    return { success: true, message: '创建成功' }
  }
  return { success: false, message: res.message || '创建失败' }
}

/**
 * 更新云端任务
 */
export async function updateCloudTask(
  id: string,
  updates: Partial<Task>
): Promise<{ success: boolean; message: string }> {
  const res = await callFunction('tasks', {
    action: 'update',
    data: { id, updates },
  })
  if (res.success) {
    return { success: true, message: '更新成功' }
  }
  return { success: false, message: res.message || '更新失败' }
}

/**
 * 删除云端任务
 */
export async function deleteCloudTask(id: string): Promise<{ success: boolean; message: string }> {
  const res = await callFunction('tasks', {
    action: 'delete',
    data: { id },
  })
  if (res.success) {
    return { success: true, message: '删除成功' }
  }
  return { success: false, message: res.message || '删除失败' }
}

/**
 * 批量删除云端任务
 */
export async function batchDeleteCloudTasks(
  ids: string[]
): Promise<{ success: boolean; message: string }> {
  const res = await callFunction('tasks', {
    action: 'batchDelete',
    data: { ids },
  })
  if (res.success) {
    return { success: true, message: `删除 ${res.deleted} 条任务` }
  }
  return { success: false, message: res.message || '批量删除失败' }
}

/**
 * 完整同步流程
 */
export async function syncWithCloud(): Promise<{ success: boolean; message: string }> {
  const logged = await ensureLogin()
  if (!logged) return { success: false, message: '登录失败' }

  try {
    const localData = loadAppData()
    const cloudTasks = await fetchCloudTasks()

    if (cloudTasks.length === 0) {
      return await syncTasksToCloud(localData.tasks)
    }

    const localIds = new Set(localData.tasks.map(t => t.id))
    const cloudOnlyTasks = cloudTasks.filter((t: Task) => !localIds.has(t.id))
    const mergedTasks = [...localData.tasks, ...cloudOnlyTasks]

    saveAppData({
      version: '1.0.0',
      tasks: mergedTasks,
      settings: localData.settings,
    })

    return await syncTasksToCloud(mergedTasks)
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}

// 自动同步定时器
let autoSyncTimer: ReturnType<typeof setInterval> | null = null
let pendingSync = false
let lastSyncTime = 0
const AUTO_SYNC_INTERVAL = 30000
const SYNC_DEBOUNCE = 5000

/**
 * 标记需要同步
 */
export function markForSync(): void {
  if (pendingSync) return
  pendingSync = true

  setTimeout(async () => {
    if (pendingSync) {
      console.log('开始同步到云端...')
      try {
        const result = await syncWithCloud()
        console.log('同步结果:', result)
      } catch (e) {
        console.error('同步失败:', e)
      }
      pendingSync = false
      lastSyncTime = Date.now()
    }
  }, SYNC_DEBOUNCE)
}

/**
 * 启动自动同步
 */
export function startAutoSync(): void {
  if (autoSyncTimer) return

  autoSyncTimer = setInterval(async () => {
    const now = Date.now()
    if (now - lastSyncTime >= AUTO_SYNC_INTERVAL) {
      await syncWithCloud()
      lastSyncTime = now
    }
  }, AUTO_SYNC_INTERVAL)
}

/**
 * 停止自动同步
 */
export function stopAutoSync(): void {
  if (autoSyncTimer) {
    clearInterval(autoSyncTimer)
    autoSyncTimer = null
  }
}

/**
 * 发送手机验证码
 */
export async function sendPhoneCode(phone: string): Promise<{ success: boolean; message: string; code?: string }> {
  try {
    const res = await callFunction('user', { action: 'sendCode', data: { phone } })
    if (res && res.success) {
      return { success: true, message: res.message, code: res.devCode }
    }
    return { success: false, message: res?.message || '发送失败' }
  } catch (error: any) {
    console.error('发送验证码失败:', error)
    return { success: false, message: error.message || '发送失败' }
  }
}

/**
 * 手机号登录（使用密码）
 */
export async function phoneLogin(phone: string, password: string): Promise<{ success: boolean; message: string; user?: UserInfo }> {
  try {
    // 先确保有登录状态
    await ensureAuth()
    
    // 调用云函数验证密码
    const res = await callFunction('user', { action: 'login', data: { phone, password } })
    if (!res.success) {
      return { success: false, message: res.message }
    }

    const user: UserInfo = {
      userId: res.user.userId,
      phone: res.user.phone,
      isLoggedIn: true,
    }

    return { success: true, message: '登录成功', user }
  } catch (error) {
    console.error('手机号登录失败:', error)
    return { success: false, message: (error as Error).message }
  }
}

/**
 * 手机号注册（使用密码）
 */
export async function phoneRegister(phone: string, password: string): Promise<{ success: boolean; message: string; user?: UserInfo }> {
  try {
    // 先确保有登录状态
    await ensureAuth()
    
    // 调用云函数注册
    const res = await callFunction('user', { action: 'register', data: { phone, password } })
    if (!res.success) {
      return { success: false, message: res.message }
    }

    const user: UserInfo = {
      userId: res.user.userId,
      phone: res.user.phone,
      isLoggedIn: true,
    }

    return { success: true, message: '注册成功', user }
  } catch (error) {
    console.error('手机号注册失败:', error)
    return { success: false, message: (error as Error).message }
  }
}

/**
 * 获取当前登录用户信息
 */
export async function getCurrentUser(): Promise<UserInfo | null> {
  try {
    const res = await callFunction('user', { action: 'getUser' })
    if (res.success && res.user) {
      return {
        userId: res.user.userId,
        phone: res.user.phone,
        isLoggedIn: true,
      }
    }
    return null
  } catch (error) {
    console.error('获取用户信息失败:', error)
    return null
  }
}

/**
 * 退出登录
 */
export async function logout(): Promise<boolean> {
  try {
    const app = getApp()
    const auth = app.auth()
    await auth.signOut()
    return true
  } catch (error) {
    console.error('退出登录失败:', error)
    return false
  }
}