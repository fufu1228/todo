const cloudbase = require('@cloudbase/node-sdk')

const app = cloudbase.init({
  env: 'todo-9g0tchg88d1d3347',
})

const db = app.database()

exports.main = async function(event, context) {
  try {
    const phone = event.phone || event.data?.phone
    const action = event.action
    const data = event.data

    if (!phone) {
      return { success: false, message: '请先登录' }
    }

    const userId = phone

    switch (action) {
      case 'list':
        const listRes = await db.collection('tasks').where({ userId }).get()
        return { success: true, data: listRes.data }

      case 'create':
        const createRes = await db.collection('tasks').add({
          ...data,
          userId,
          updatedAt: new Date(),
        })
        return { success: true, id: createRes.id }

      case 'update':
        await db.collection('tasks').where({ userId, _id: data.id }).update({
          ...data.updates,
          updatedAt: new Date(),
        })
        return { success: true }

      case 'delete':
        await db.collection('tasks').where({ userId, _id: data.id }).remove()
        return { success: true }

      case 'batchDelete':
        for (const id of data.ids) {
          await db.collection('tasks').where({ userId, _id: id }).remove()
        }
        return { success: true, deleted: data.ids.length }

      case 'sync':
        if (!Array.isArray(data.tasks)) {
          return { success: false, message: 'tasks 必须是数组' }
        }
        
        // 先删除该用户所有任务
        const delRes = await db.collection('tasks').where({ userId }).remove()
        
        // 逐个添加任务
        let addedCount = 0
        for (const task of data.tasks) {
          try {
            await db.collection('tasks').add({
              ...task,
              userId,
              updatedAt: new Date(),
            })
            addedCount++
          } catch (e) {
            console.error('添加任务失败:', e)
          }
        }
        
        return { success: true, synced: addedCount }

      default:
        return { success: false, message: '未知操作' }
    }
  } catch (error) {
    return { success: false, message: error.message }
  }
}