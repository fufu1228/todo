import { dayjs } from '@/utils/date'
import type { Task, ReminderConfig } from '@/types/task'

/**
 * 检查任务是否需要提醒
 */
export function shouldRemind(task: Task): boolean {
  if (!task.reminder?.enabled || task.status === 'completed' || !task.dueDate) {
    return false
  }

  const now = dayjs()
  const dueDate = dayjs(task.dueDate)
  const remindTime = dueDate.subtract(task.reminder.advanceMinutes, 'minute')

  // 如果已经过了提醒时间
  if (now.isAfter(remindTime)) {
    // 检查是否已经提醒过（避免重复提醒）
    if (task.reminder.lastReminded) {
      const lastReminded = dayjs(task.reminder.lastReminded)
      // 如果上次提醒是在提醒时间之后，且距离现在不到1小时，则不重复提醒
      if (lastReminded.isAfter(remindTime) && now.diff(lastReminded, 'minute') < 60) {
        return false
      }
    }
    return true
  }

  return false
}

/**
 * 检查是否是重复提醒时间
 */
export function isRepeatReminderTime(task: Task): boolean {
  if (!task.reminder?.enabled || task.reminder.repeatType === 'none' || !task.reminder.reminderTime) {
    return false
  }

  const now = dayjs()
  const [hour, minute] = task.reminder.reminderTime.split(':').map(Number)
  const reminderTime = dayjs().hour(hour).minute(minute).second(0)

  // 检查当前时间是否在提醒时段（前后5分钟）
  const diff = Math.abs(now.diff(reminderTime, 'minute'))
  if (diff > 5) {
    return false
  }

  // 检查重复类型
  if (task.reminder.lastReminded) {
    const lastReminded = dayjs(task.reminder.lastReminded)
    switch (task.reminder.repeatType) {
      case 'daily':
        // 每天提醒，如果今天已经提醒过则不提醒
        return !lastReminded.isToday()
      case 'weekly':
        // 每周提醒，如果本周已经提醒过则不提醒
        return now.diff(lastReminded, 'week') >= 1
      case 'monthly':
        // 每月提醒，如果本月已经提醒过则不提醒
        return now.diff(lastReminded, 'month') >= 1
      default:
        return false
    }
  }

  return true
}

/**
 * 触发提醒
 */
export function triggerReminder(task: Task, onRemind?: (task: Task) => void): void {
  if (shouldRemind(task) || isRepeatReminderTime(task)) {
    // 浏览器通知
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`任务提醒: ${task.title}`, {
        body: task.description || `截止时间: ${dayjs(task.dueDate).format('YYYY-MM-DD HH:mm')}`,
        icon: '/vite.svg',
      })
    }

    // 回调函数
    if (onRemind) {
      onRemind(task)
    }
  }
}

/**
 * 检查任务是否逾期
 */
export function isTaskOverdue(task: Task): boolean {
  if (task.status === 'completed' || !task.dueDate) {
    return false
  }
  return dayjs(task.dueDate).isBefore(dayjs(), 'day')
}
