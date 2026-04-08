import { dayjs } from '@/utils/date'
import type { Task, SmartReminderRule, InAppReminder } from '@/types/task'

/**
 * 检查任务是否需要提醒（提前提醒）
 */
export function shouldRemind(task: Task): boolean {
  if (!task.reminder?.enabled || task.status === 'completed' || !task.dueDate) {
    return false
  }

  const now = dayjs()
  const dueDate = dayjs(task.dueDate)
  const remindTime = dueDate.subtract(task.reminder.advanceMinutes, 'minute')

  if (now.isAfter(remindTime)) {
    if (task.reminder.lastReminded) {
      const lastReminded = dayjs(task.reminder.lastReminded)
      if (lastReminded.isAfter(remindTime) && now.diff(lastReminded, 'minute') < 60) {
        return false
      }
    }
    return true
  }

  return false
}

/**
 * 检查周期性提醒时间
 */
export function isRepeatReminderTime(task: Task): boolean {
  if (
    !task.reminder?.enabled ||
    task.reminder.repeatType === 'none' ||
    !task.reminder.reminderTime
  ) {
    return false
  }

  const now = dayjs()
  const [hour, minute] = task.reminder.reminderTime.split(':').map(Number)
  const reminderTime = dayjs().hour(hour).minute(minute).second(0)

  const diff = Math.abs(now.diff(reminderTime, 'minute'))
  if (diff > 5) return false

  if (task.reminder.lastReminded) {
    const lastReminded = dayjs(task.reminder.lastReminded)
    switch (task.reminder.repeatType) {
      case 'daily':
        return !lastReminded.isToday()
      case 'weekly':
        return now.diff(lastReminded, 'week') >= 1
      case 'monthly':
        return now.diff(lastReminded, 'month') >= 1
      default:
        return false
    }
  }

  return true
}

/**
 * 检查是否处于自定义提醒时段内
 */
export function isInReminderPeriod(_task: Task, rule?: SmartReminderRule): boolean {
  if (!rule) return true

  const now = dayjs()
  const currentMinutes = now.hour() * 60 + now.minute()
  const [startH, startM] = rule.reminderPeriodStart.split(':').map(Number)
  const [endH, endM] = rule.reminderPeriodEnd.split(':').map(Number)
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  if (startMinutes <= endMinutes) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  }
  return currentMinutes >= startMinutes || currentMinutes <= endMinutes
}

/**
 * 检查是否触发重要任务高频提醒
 */
export function shouldHighFrequencyRemind(task: Task, rule?: SmartReminderRule): boolean {
  if (!rule || !rule.highFrequencyEnabled) return false
  if (task.priority !== rule.highFrequencyPriority) return false
  if (task.status === 'completed' || !task.dueDate) return false
  if (!task.reminder?.lastReminded) return false

  const now = dayjs()
  const lastReminded = dayjs(task.reminder.lastReminded)
  return now.diff(lastReminded, 'minute') >= rule.highFrequencyInterval
}

/**
 * 检查是否触发逾期二次提醒
 */
export function shouldOverdueSecondaryRemind(task: Task, rule?: SmartReminderRule): boolean {
  if (!rule || !rule.overdueSecondaryEnabled) return false
  if (task.status === 'completed' || !task.dueDate) return false
  if (!isTaskOverdue(task)) return false
  if (!task.reminder?.lastReminded) return false

  const now = dayjs()
  const lastReminded = dayjs(task.reminder.lastReminded)
  return now.diff(lastReminded, 'minute') >= rule.overdueSecondaryInterval
}

/**
 * 触发提醒（浏览器通知 + 返回应用内提醒对象）
 */
export function triggerReminder(
  task: Task,
  type: 'advance' | 'periodic' | 'overdue' = 'advance',
  onRemind?: (t: Task) => void
): InAppReminder | null {
  if (type === 'advance' && !shouldRemind(task) && !isRepeatReminderTime(task)) return null
  if (type === 'overdue' && !isTaskOverdue(task)) return null
  if (type === 'periodic' && !isRepeatReminderTime(task)) return null

  if ('Notification' in window && Notification.permission === 'granted') {
    const typeText = type === 'overdue' ? '逾期提醒' : type === 'periodic' ? '周期提醒' : '任务提醒'
    new Notification(`${typeText}: ${task.title}`, {
      body: task.description || `截止时间: ${dayjs(task.dueDate).format('YYYY-MM-DD HH:mm')}`,
      icon: '/vite.svg',
    })
  }

  if (onRemind) onRemind(task)

  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    task,
    type,
    createdAt: new Date().toISOString(),
  }
}

/**
 * 检查任务是否逾期
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'completed' || !task.dueDate) return false
  return dayjs(task.dueDate).isBefore(dayjs(), 'day')
}
