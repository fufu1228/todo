/**
 * 任务数据云函数
 * 处理任务的增删改查，自动关联当前用户
 *
 * 调用方式：
 *   action: 'list'        - 获取当前用户所有任务
 *   action: 'create'      - 创建任务（data: 任务对象）
 *   action: 'update'      - 更新任务（data: { id, updates }）
 *   action: 'delete'      - 删除任务（data: { id }）
 *   action: 'batchDelete' - 批量删除（data: { ids }）
 *   action: 'sync'        - 全量同步（data: { tasks }）上传本地全部任务到云端
 */
const cloudbase = require('@cloudbase/node-sdk')

const app = cloudbase.init({
  env: 'todo-9g0tchg88d1d3347',
})

const db = app.database()
const _ = db.command

exports.main = async (event, context) => {
  // 获取当前登录用户 ID（匿名登录 / 邮箱登录均适用）
  const { userInfo } = context
  const userId = userInfo?.openId || userInfo?.customUserId || 'anonymous'

  const { action, data } = event

  try {
    switch (action) {
      case 'list':
        return await handleList(userId)

      case 'create':
        return await handleCreate(userId, data)

      case 'update':
        return await handleUpdate(userId, data)

      case 'delete':
        return await handleDelete(userId, data)

      case 'batchDelete':
        return await handleBatchDelete(userId, data)

      case 'sync':
        return await handleSync(userId, data)

      default:
        return { success: false, message: `未知操作: ${action}` }
    }
  } catch (error) {
    console.error(`云函数 tasks 执行失败 [${action}]:`, error)
    return { success: false, message: error.message }
  }
}

/**
 * 获取当前用户所有任务
 */
async function handleList(userId) {
  const res = await db.collection('tasks').where({ userId }).orderBy('updatedAt', 'desc').get()
  return { success: true, data: res.data }
}

/**
 * 创建任务
 */
async function handleCreate(userId, taskData) {
  const now = new Date()
  const task = {
    ...taskData,
    userId,
    createdAt: taskData.createdAt || now,
    updatedAt: now,
  }
  const res = await db.collection('tasks').add(task)
  return { success: true, id: res.id, data: task }
}

/**
 * 更新任务
 */
async function handleUpdate(userId, { id, updates }) {
  const res = await db
    .collection('tasks')
    .where({ userId, _id: id })
    .update({
      ...updates,
      updatedAt: new Date(),
    })
  return { success: true, updated: res.updated }
}

/**
 * 删除单个任务
 */
async function handleDelete(userId, { id }) {
  const res = await db.collection('tasks').where({ userId, _id: id }).remove()
  return { success: true, deleted: res.deleted }
}

/**
 * 批量删除任务
 */
async function handleBatchDelete(userId, { ids }) {
  const res = await db
    .collection('tasks')
    .where({
      userId,
      _id: _.in(ids),
    })
    .remove()
  return { success: true, deleted: res.deleted }
}

/**
 * 全量同步：用本地数据覆盖云端（用于首次上传或强制同步）
 */
async function handleSync(userId, { tasks }) {
  if (!Array.isArray(tasks)) {
    return { success: false, message: 'tasks 必须是数组' }
  }

  // 先删除该用户的所有云端任务
  await db.collection('tasks').where({ userId }).remove()

  // 批量插入
  if (tasks.length > 0) {
    await db.collection('tasks').add(
      tasks.map(t => ({
        ...t,
        userId,
        updatedAt: new Date(),
      }))
    )
  }

  return { success: true, synced: tasks.length }
}
