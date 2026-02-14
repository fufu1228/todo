export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'pending' | 'completed'
export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'none'

export interface ReminderConfig {
  enabled: boolean
  advanceMinutes: number // 提前提醒分钟数
  repeatType?: RepeatType // 重复类型
  reminderTime?: string // 提醒时段 HH:mm
  lastReminded?: string // 上次提醒时间
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string // ISO格式日期时间
  priority: TaskPriority
  status: TaskStatus
  category?: string
  parentId?: string // 父任务ID
  subtasks?: Task[] // 子任务列表
  reminder?: ReminderConfig
  createdAt: string
  updatedAt: string
}

export interface TaskFilter {
  status?: TaskStatus
  category?: string
  priority?: TaskPriority
  search?: string
}

export interface TaskSort {
  field: 'dueDate' | 'priority' | 'createdAt' | 'title'
  order: 'asc' | 'desc'
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  defaultPriority: TaskPriority
  defaultReminderMinutes: number
  sortBy: TaskSort
  categories: string[]
  categoryRules: Record<string, string[]> // 分类关键词规则
}

export interface AppData {
  version: string
  tasks: Task[]
  settings: AppSettings
}
