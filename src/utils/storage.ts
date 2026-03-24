import type { AppData, AppSettings } from '@/types/task'

const STORAGE_KEY = 'todo_app_data'
const DATA_VERSION = '1.0.0'

const defaultSettings: AppSettings = {
  theme: 'auto',
  defaultPriority: 'medium',
  defaultReminderMinutes: 30,
  sortBy: {
    field: 'createdAt',
    order: 'desc',
  },
  categories: ['工作', '学习', '生活', '购物', '健康', '其他'],
  categoryColors: {
    工作: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    学习: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    生活: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    购物: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    健康: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    其他: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  },
  categoryRules: {
    工作: ['会议', '项目', '报告', '邮件', '客户', '任务', 'deadline'],
    学习: ['课程', '作业', '考试', '阅读', '笔记', '复习', '学习'],
    生活: ['购物', '缴费', '维修', '清洁', '家务'],
    购物: ['买', '购物', '采购', '下单'],
    健康: ['运动', '体检', '健身', '跑步', '锻炼'],
  },
}

/**
 * 加载应用数据
 */
export function loadAppData(): AppData {
  try {
    const dataStr = localStorage.getItem(STORAGE_KEY)
    if (!dataStr) {
      return {
        version: DATA_VERSION,
        tasks: [],
        settings: defaultSettings,
      }
    }

    const data = JSON.parse(dataStr) as AppData
    // 数据迁移：如果版本不匹配，可以在这里处理
    if (data.version !== DATA_VERSION) {
      // 未来可以在这里做数据迁移
    }

    return {
      ...data,
      settings: { ...defaultSettings, ...data.settings },
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    return {
      version: DATA_VERSION,
      tasks: [],
      settings: defaultSettings,
    }
  }
}

/**
 * 保存应用数据
 */
export function saveAppData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('保存数据失败:', error)
    throw new Error('保存数据失败，请检查存储空间')
  }
}

/**
 * 导出数据为JSON
 */
export function exportData(data: AppData): string {
  return JSON.stringify(data, null, 2)
}

/**
 * 从JSON导入数据
 */
export function importData(jsonStr: string): AppData {
  try {
    const data = JSON.parse(jsonStr) as AppData
    // 验证数据结构
    if (!data.tasks || !data.settings) {
      throw new Error('数据格式不正确')
    }
    return data
  } catch (error) {
    console.error('导入数据失败:', error)
    throw new Error('导入数据失败，请检查文件格式')
  }
}

/**
 * 下载数据文件
 */
export function downloadData(data: AppData, filename = 'todo-backup.json'): void {
  const jsonStr = exportData(data)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 从文件读取数据
 */
export function readDataFromFile(file: File): Promise<AppData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = importData(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
