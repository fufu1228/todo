import { reactive, computed, ref } from 'vue'
import type { Task, TaskFilter, TaskSort, AppSettings, AppData } from '@/types/task'
import { loadAppData, saveAppData } from '@/utils/storage'
import { autoCategorize } from '@/utils/category'
import { dayjs } from '@/utils/date'

interface TaskStore {
  tasks: Task[]
  settings: AppSettings
  filter: TaskFilter
  sort: TaskSort
}

/**
 * 数据迁移：兼容旧字段 deadline → dueDate
 */
function migrateTasks(data: AppData): AppData {
  const migrated = { ...data, tasks: [...data.tasks] }
  migrated.tasks = migrated.tasks.map(task => {
    const t = { ...task }
    // 兼容旧字段 deadline
    if ((t as any).deadline && !t.dueDate) {
      t.dueDate = (t as any).deadline
      delete (t as any).deadline
    }
    // 确保 isAllDay 有默认值
    if (t.isAllDay === undefined) {
      t.isAllDay = true
    }
    // 迁移子任务
    if (t.subtasks) {
      t.subtasks = t.subtasks.map(st => {
        const s = { ...st }
        if ((s as any).deadline && !s.dueDate) {
          s.dueDate = (s as any).deadline
          delete (s as any).deadline
        }
        if (s.isAllDay === undefined) {
          s.isAllDay = true
        }
        return s
      })
    }
    return t
  })
  return migrated
}

const appData = migrateTasks(loadAppData())

export const taskStore = reactive<TaskStore>({
  tasks: appData.tasks,
  settings: appData.settings,
  filter: {},
  sort: appData.settings.sortBy,
})

/**
 * 今日 0 点时间戳（响应式）
 */
export const todayTimestamp = ref(getTodayStart())

function getTodayStart(): number {
  return new Date().setHours(0, 0, 0, 0)
}

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
export async function createTask(task: Partial<Task>): Promise<Task> {
  const llmEnabled = taskStore.settings.llm?.enabled || false
  const apiKey = taskStore.settings.llm?.apiKey || ''
  const prefs = taskStore.settings.llm?.prefs || []

  let category = task.category
  if (!category) {
    category = await autoCategorize(
      task.title || '',
      task.description,
      taskStore.settings.categoryRules,
      taskStore.settings.categories,
      llmEnabled,
      apiKey,
      prefs
    )
  }

  const newTask: Task = {
    id: generateId(),
    title: task.title || '未命名任务',
    description: task.description,
    dueDate: task.dueDate,
    isAllDay: task.isAllDay ?? true,
    priority: task.priority || taskStore.settings.defaultPriority,
    status: 'pending',
    category,
    parentId: task.parentId,
    subtasks: [],
    reminder: task.reminder,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  if (task.parentId) {
    const parentTask = taskStore.tasks.find(t => t.id === task.parentId)
    if (parentTask) {
      if (!parentTask.subtasks) parentTask.subtasks = []
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
    Object.assign(task, updates, { updatedAt: new Date().toISOString() })
    persistData()
  }
}

/**
 * 删除任务
 */
export function deleteTask(id: string): void {
  const index = taskStore.tasks.findIndex(t => t.id === id)
  if (index !== -1) {
    taskStore.tasks.splice(index, 1)
    persistData()
  } else {
    for (const task of taskStore.tasks) {
      if (task.subtasks) {
        const subtaskIndex = task.subtasks.findIndex(t => t.id === id)
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
  taskStore.tasks = taskStore.tasks.filter(t => !ids.includes(t.id))
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
 * 保存用户分类修正偏好
 */
export function saveCategoryPreference(
  taskId: string,
  originalCategory: string,
  newCategory: string
): void {
  const task = findTaskById(taskId)
  if (!task) return

  const prefs = taskStore.settings.llm?.prefs || []
  const text = `${task.title} ${task.description || ''}`
  const existingIndex = prefs.findIndex(p => p.text === text)
  if (existingIndex !== -1) {
    prefs[existingIndex].userCorrectedCategory = newCategory
  } else {
    prefs.push({
      text,
      predictedCategory: originalCategory,
      userCorrectedCategory: newCategory,
      learnedKeywords: text
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 1),
    })
  }

  taskStore.settings.llm = {
    ...taskStore.settings.llm,
    prefs: prefs.slice(-100),
  }
  persistData()
}

function shouldResetRecurringTask(task: Task, now = dayjs()): boolean {
  const reminder = task.reminder
  if (!reminder?.enabled || reminder.repeatType === 'none') return false
  if (task.status !== 'completed') return false

  const lastCycle = dayjs(reminder.lastCycleAt || task.updatedAt || task.createdAt)
  const hasReminderTime = !!reminder.reminderTime
  let isTimeReady = true
  if (hasReminderTime && reminder.reminderTime) {
    const [hour, minute] = reminder.reminderTime.split(':').map(Number)
    const threshold = dayjs().hour(hour).minute(minute).second(0).millisecond(0)
    isTimeReady = now.isAfter(threshold) || now.isSame(threshold)
  }
  if (!isTimeReady) return false

  switch (reminder.repeatType) {
    case 'daily':
      return lastCycle.startOf('day').isBefore(now.startOf('day'))
    case 'weekly':
      return lastCycle.startOf('week').isBefore(now.startOf('week'))
    case 'monthly':
      return lastCycle.startOf('month').isBefore(now.startOf('month'))
    default:
      return false
  }
}

function resetRecurringInList(tasks: Task[], now: ReturnType<typeof dayjs>): boolean {
  let changed = false
  tasks.forEach(task => {
    if (shouldResetRecurringTask(task, now)) {
      task.status = 'pending'
      task.updatedAt = now.toISOString()
      if (task.reminder) task.reminder.lastCycleAt = now.toISOString()
      changed = true
    }
    if (task.subtasks?.length) {
      changed = resetRecurringInList(task.subtasks, now) || changed
    }
  })
  return changed
}

export function resetRecurringTasksIfNeeded(): void {
  const now = dayjs()
  const changed = resetRecurringInList(taskStore.tasks, now)
  if (changed) persistData()
}

/**
 * 根据ID查找任务（包括子任务）
 */
export function findTaskById(id: string): Task | undefined {
  let task = taskStore.tasks.find(t => t.id === id)
  if (task) return task
  for (const t of taskStore.tasks) {
    if (t.subtasks) {
      task = t.subtasks.find(st => st.id === id)
      if (task) return task
    }
  }
  return undefined
}

/**
 * 获取任务的完成进度
 */
export function getTaskProgress(task: Task): number {
  if (!task.subtasks || task.subtasks.length === 0) {
    return task.status === 'completed' ? 100 : 0
  }
  const completedCount = task.subtasks.filter(st => st.status === 'completed').length
  return Math.round((completedCount / task.subtasks.length) * 100)
}

/**
 * 今日列表：只显示未完成且截止日期 <= 今天的任务
 * 逾期任务（dueDate < today）高亮显示
 */
export const todayTasks = computed(() => {
  const todayStart = todayTimestamp.value
  const allTasks = collectAllTasks(taskStore.tasks)

  return allTasks
    .filter(t => {
      // 只显示未完成的任务
      if (t.status === 'completed') return false
      // 必须有截止日期
      if (!t.dueDate) return false
      // 截止日期 <= 今天
      const dueTs = new Date(t.dueDate).setHours(0, 0, 0, 0)
      return dueTs <= todayStart
    })
    .sort((a, b) => {
      // 逾期任务排在前面，然后按 dueDate 升序
      const aDue = a.dueDate ? new Date(a.dueDate).setHours(0, 0, 0, 0) : Infinity
      const bDue = b.dueDate ? new Date(b.dueDate).setHours(0, 0, 0, 0) : Infinity
      const aOverdue = aDue < todayStart
      const bOverdue = bDue < todayStart
      if (aOverdue && !bOverdue) return -1
      if (!aOverdue && bOverdue) return 1
      return aDue - bDue
    })
})

/**
 * 过滤和排序后的任务列表（用于全量展示）
 */
export const filteredAndSortedTasks = computed(() => {
  let tasks = [...taskStore.tasks]

  if (taskStore.filter.status) {
    tasks = tasks.filter(t => t.status === taskStore.filter.status)
  }
  if (taskStore.filter.category) {
    tasks = tasks.filter(t => t.category === taskStore.filter.category)
  }
  if (taskStore.filter.priority) {
    tasks = tasks.filter(t => t.priority === taskStore.filter.priority)
  }
  if (taskStore.filter.search) {
    const search = taskStore.filter.search.toLowerCase()
    tasks = tasks.filter(
      t => t.title.toLowerCase().includes(search) || t.description?.toLowerCase().includes(search)
    )
  }

  tasks.sort((a, b) => {
    const { field, order } = taskStore.sort
    let aValue: any
    let bValue: any

    switch (field) {
      case 'dueDate':
        aValue = a.dueDate ? new Date(a.dueDate).getTime() : 0
        bValue = b.dueDate ? new Date(b.dueDate).getTime() : 0
        break
      case 'priority': {
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        aValue = priorityOrder[a.priority]
        bValue = priorityOrder[b.priority]
        break
      }
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
 * 收集所有任务（包括子任务）
 */
function collectAllTasks(tasks: Task[]): Task[] {
  const result: Task[] = []
  tasks.forEach(t => {
    result.push(t)
    if (t.subtasks) {
      result.push(...collectAllTasks(t.subtasks))
    }
  })
  return result
}

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

/**
 * 刷新今日时间戳（跨日刷新）
 */
export function refreshTodayTimestamp(): void {
  todayTimestamp.value = getTodayStart()
}
