export type TaskPriority = 'high' | 'medium' | 'low'
export type TaskStatus = 'pending' | 'completed'
export type RepeatType = 'daily' | 'weekly' | 'monthly' | 'none'

export interface ReminderConfig {
  enabled: boolean
  advanceMinutes: number
  repeatType?: RepeatType
  reminderTime?: string
  lastReminded?: string
  lastCycleAt?: string
}

export interface SmartReminderRule {
  id: string
  name: string
  advanceMinutes: number
  reminderPeriodStart: string
  reminderPeriodEnd: string
  highFrequencyEnabled: boolean
  highFrequencyInterval: number
  highFrequencyPriority: TaskPriority
  overdueSecondaryEnabled: boolean
  overdueSecondaryInterval: number
}

export interface LLMPref {
  text: string
  predictedCategory: string
  userCorrectedCategory?: string
  learnedKeywords: string[]
}

export interface LLMSettings {
  enabled: boolean
  apiKey: string
  model: string
  prefs: LLMPref[]
}

export interface CloudSyncSettings {
  enabled: boolean
  envId: string
  lastSyncAt?: string
  userId?: string
  authType: 'anonymous' | 'email' | 'phone'
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto'
  defaultPriority: TaskPriority
  defaultReminderMinutes: number
  sortBy: TaskSort
  categories: string[]
  categoryColors: Record<string, string>
  categoryRules: Record<string, string[]>
  smartReminderRules: SmartReminderRule[]
  llm: LLMSettings
  cloudSync: CloudSyncSettings
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  isAllDay?: boolean
  priority: TaskPriority
  status: TaskStatus
  category?: string
  parentId?: string
  subtasks?: Task[]
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

export interface AppData {
  version: string
  tasks: Task[]
  settings: AppSettings
}

export interface InAppReminder {
  id: string
  task: Task
  type: 'advance' | 'periodic' | 'overdue'
  createdAt: string
}
