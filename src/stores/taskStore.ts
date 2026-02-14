import { reactive, computed } from 'vue'
import type { Task, TaskFilter, TaskSort, AppSettings } from '@/types/task'
import { loadAppData, saveAppData } from '@/utils/storage'
import { autoCategorize } from '@/utils/category'

interface TaskStore {
  tasks: Task[]
  settings: AppSettings
  filter: TaskFilter
  sort: TaskSort
}

const appData = loadAppData()

export const taskStore = reactive<TaskStore>({
  tasks: appData.tasks,
  settings: appData.settings,
  filter: {},
  sort: appData.settings.sortBy,
})

/**
 * 保存数据到本地存储
 */
function persistData() {
  saveAppData({
    version: '1.0.0',
    tasks: taskStore.tasks,
    settings: taskStore.settings,
  })
}

/**
 * 生成唯一ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * 创建新任务
 */
export function createTask(task: Partial<Task>): Task {
  const newTask: Task = {
    id: generateId(),
    title: task.title || '未命名任务',
    description: task.description,
    dueDate: task.dueDate,
    priority: task.priority || taskStore.settings.defaultPriority,
    status: 'pending',
    category:
      task.category ||
      autoCategorize(
        task.title || '',
        task.description,
        taskStore.settings.categoryRules
      ),
    parentId: task.parentId,
    subtasks: [],
    reminder: task.reminder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // 如果是子任务，添加到父任务
  if (task.parentId) {
    const parentTask = taskStore.tasks.find((t) => t.id === task.parentId)
    if (parentTask) {
      if (!parentTask.subtasks) {
        parentTask.subtasks = []
      }
      parentTask.subtasks.push(newTask)
      parentTask.updatedAt = new Date().toISOString()
    }
  } else {
    taskStore.tasks.push(newTask)
  }

  persistData()
  return newTask
}

/**
 * 更新任务
 */
export function updateTask(id: string, updates: Partial<Task>): void {
  const task = findTaskById(id)
  if (task) {
    Object.assign(task, updates, {
      updatedAt: new Date().toISOString(),
    })
    persistData()
  }
}

/**
 * 删除任务
 */
export function deleteTask(id: string): void {
  const index = taskStore.tasks.findIndex((t) => t.id === id)
  if (index !== -1) {
    taskStore.tasks.splice(index, 1)
    persistData()
  } else {
    // 可能是子任务，需要从父任务中删除
    for (const task of taskStore.tasks) {
      if (task.subtasks) {
        const subtaskIndex = task.subtasks.findIndex((t) => t.id === id)
        if (subtaskIndex !== -1) {
          task.subtasks.splice(subtaskIndex, 1)
          task.updatedAt = new Date().toISOString()
          persistData()
          return
        }
      }
    }
  }
}

/**
 * 批量删除任务
 */
export function deleteTasks(ids: string[]): void {
  taskStore.tasks = taskStore.tasks.filter((t) => !ids.includes(t.id))
  persistData()
}

/**
 * 切换任务状态
 */
export function toggleTaskStatus(id: string): void {
  const task = findTaskById(id)
  if (task) {
    task.status = task.status === 'pending' ? 'completed' : 'pending'
    task.updatedAt = new Date().toISOString()
    persistData()
  }
}

/**
 * 根据ID查找任务（包括子任务）
 */
export function findTaskById(id: string): Task | undefined {
  // 先查找主任务
  let task = taskStore.tasks.find((t) => t.id === id)
  if (task) return task

  // 再查找子任务
  for (const t of taskStore.tasks) {
    if (t.subtasks) {
      task = t.subtasks.find((st) => st.id === id)
      if (task) return task
    }
  }

  return undefined
}

/**
 * 获取任务的完成进度（用于父任务）
 */
export function getTaskProgress(task: Task): number {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === 'completed' ? 100 : 0
  }

  const completedCount = task.subtasks.filter((st) => st.status === 'completed').length
  return Math.round((completedCount / task.subtasks.length) * 100)
}

/**
 * 过滤和排序后的任务列表
 */
export const filteredAndSortedTasks = computed(() => {
  let tasks = [...taskStore.tasks]

  // 应用过滤器
  if (taskStore.filter.status) {
    tasks = tasks.filter((t) => t.status === taskStore.filter.status)
  }

  if (taskStore.filter.category) {
    tasks = tasks.filter((t) => t.category === taskStore.filter.category)
  }

  if (taskStore.filter.priority) {
    tasks = tasks.filter((t) => t.priority === taskStore.filter.priority)
  }

  if (taskStore.filter.search) {
    const search = taskStore.filter.search.toLowerCase()
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(search) ||
        t.description?.toLowerCase().includes(search)
    )
  }

  // 应用排序
  tasks.sort((a, b) => {
    const { field, order } = taskStore.sort
    let aValue: any
    let bValue: any

    switch (field) {
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
        break
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
        break
      case 'createdAt':
        aValue = new Date(a.createdAt).getTime()
        bValue = new Date(b.createdAt).getTime()
        break
      case 'title':
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      default:
        return 0
    }

    if (aValue < bValue) return order === 'asc' ? -1 : 1
    if (aValue > bValue) return order === 'asc' ? 1 : -1
    return 0
  })

  return tasks
})

/**
 * 更新设置
 */
export function updateSettings(settings: Partial<AppSettings>): void {
  Object.assign(taskStore.settings, settings)
  persistData()
}

/**
 * 更新排序
 */
export function updateSort(sort: TaskSort): void {
  taskStore.sort = sort
  taskStore.settings.sortBy = sort
  persistData()
}
