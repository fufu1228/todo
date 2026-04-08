import type { Task } from '@/types/task'
import { loadAppData, saveAppData } from '@/utils/storage'
import cloudbase from '@cloudbase/js-sdk'

/**
 * 云端同步管理
 * 使用腾讯云 CloudBase 云函数实现跨设备同步
 * 本地 LocalStorage 优先，云端作为备份和同步层
 *
 * 架构：前端 SDK → 云函数（tasks） → 云数据库
 */

// 默认环境 ID（可在设置页修改）
const DEFAULT_ENV_ID = 'todo-9g0tchg88d1d3347'

let appInstance: any = null

/**
 * 获取 CloudBase 应用实例（单例）
 */
function getApp(envId?: string): any {
  if (!appInstance) {
    appInstance = cloudbase.init({
      env: envId || DEFAULT_ENV_ID,
    })
  }
  return appInstance
}

/**
 * 调用云函数
 */
async function callFunction(name: string, data: Record<string, any>): Promise<any> {
  const app = getApp()
  const result = await app.callFunction({
    name,
    data,
  })
  return result.result
}

/**
 * 匿名登录
 */
export async function anonymousLogin(): Promise<boolean> {
  try {
    const app = getApp()
    const auth = app.auth()
    await auth.anonymousAuthProvider().signIn()
    return true
  } catch (error) {
    console.error('匿名登录失败:', error)
    return false
  }
}

/**
 * 确保已登录
 */
async function ensureLogin(): Promise<boolean> {
  const app = getApp()
  const auth = app.auth()
  const loginState = await auth.getLoginState()
  if (loginState?.user?.uid) return true
  return await anonymousLogin()
}

/**
 * 从云端获取任务列表
 */
export async function fetchCloudTasks(): Promise<Task[]> {
  const res = await callFunction('tasks', { action: 'list' })
  if (res.success && res.data) {
    // 云数据库返回的 _id 需要映射回 id
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
 * 完整同步流程：本地优先，合并云端差异
 */
export async function syncWithCloud(): Promise<{ success: boolean; message: string }> {
  const logged = await ensureLogin()
  if (!logged) return { success: false, message: '登录失败' }

  try {
    const localData = loadAppData()
    const cloudTasks = await fetchCloudTasks()

    if (cloudTasks.length === 0) {
      // 云端无数据，直接上传本地
      return await syncTasksToCloud(localData.tasks)
    }

    // 本地优先合并
    const localIds = new Set(localData.tasks.map(t => t.id))
    const cloudOnlyTasks = cloudTasks.filter((t: Task) => !localIds.has(t.id))
    const mergedTasks = [...localData.tasks, ...cloudOnlyTasks]

    // 保存合并后的本地数据
    saveAppData({
      version: '1.0.0',
      tasks: mergedTasks,
      settings: localData.settings,
    })

    // 上传到云端
    return await syncTasksToCloud(mergedTasks)
  } catch (error) {
    return { success: false, message: (error as Error).message }
  }
}
