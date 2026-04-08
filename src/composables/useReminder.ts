import { onMounted, onUnmounted } from 'vue'
import { taskStore, updateTask, resetRecurringTasksIfNeeded } from '@/stores/taskStore'
import {
  shouldRemind,
  isRepeatReminderTime,
  triggerReminder,
  shouldHighFrequencyRemind,
  shouldOverdueSecondaryRemind,
  isInReminderPeriod,
  isTaskOverdue,
} from '@/utils/reminder'
import type { InAppReminder } from '@/types/task'

/**
 * 发送应用内提醒事件
 */
function emitInAppReminder(reminder: InAppReminder) {
  const event = new CustomEvent('todo-reminder', { detail: reminder })
  window.dispatchEvent(event)
}

/**
 * 提醒管理组合函数
 */
export function useReminder() {
  let reminderInterval: number | null = null

  /**
   * 检查所有任务的提醒
   */
  function checkAllReminders() {
    resetRecurringTasksIfNeeded()

    const rule = taskStore.settings.smartReminderRules?.[0]

    taskStore.tasks.forEach(task => {
      // 1. 截止前提醒
      if (shouldRemind(task) && isInReminderPeriod(task, rule)) {
        const reminder = triggerReminder(task, 'advance', t => {
          if (t.reminder) {
            updateTask(t.id, {
              reminder: {
                ...t.reminder,
                lastReminded: new Date().toISOString(),
              },
            })
          }
        })
        if (reminder) emitInAppReminder(reminder)
      }

      // 2. 周期性任务提醒
      if (isRepeatReminderTime(task) && isInReminderPeriod(task, rule)) {
        const reminder = triggerReminder(task, 'periodic', t => {
          if (t.reminder) {
            updateTask(t.id, {
              reminder: {
                ...t.reminder,
                lastReminded: new Date().toISOString(),
              },
            })
          }
        })
        if (reminder) emitInAppReminder(reminder)
      }

      // 3. 重要任务高频提醒
      if (shouldHighFrequencyRemind(task, rule)) {
        const reminder = triggerReminder(task, 'advance', t => {
          if (t.reminder) {
            updateTask(t.id, {
              reminder: {
                ...t.reminder,
                lastReminded: new Date().toISOString(),
              },
            })
          }
        })
        if (reminder) emitInAppReminder(reminder)
      }

      // 4. 逾期二次提醒
      if (isTaskOverdue(task) && shouldOverdueSecondaryRemind(task, rule)) {
        const reminder = triggerReminder(task, 'overdue', t => {
          if (t.reminder) {
            updateTask(t.id, {
              reminder: {
                ...t.reminder,
                lastReminded: new Date().toISOString(),
              },
            })
          }
        })
        if (reminder) emitInAppReminder(reminder)
      }
    })

    taskStore.tasks.forEach(task => {
      if (task.subtasks) {
        task.subtasks.forEach(subtask => {
          if (shouldRemind(subtask) || isRepeatReminderTime(subtask)) {
            const reminder = triggerReminder(subtask, 'advance', t => {
              if (t.reminder) {
                updateTask(t.id, {
                  reminder: {
                    ...t.reminder,
                    lastReminded: new Date().toISOString(),
                  },
                })
              }
            })
            if (reminder) emitInAppReminder(reminder)
          }
        })
      }
    })
  }

  /**
   * 请求通知权限
   */
  function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return Promise.resolve(false)
    }

    if (Notification.permission === 'granted') {
      return Promise.resolve(true)
    }

    if (Notification.permission === 'denied') {
      return Promise.resolve(false)
    }

    return Notification.requestPermission().then(permission => {
      return permission === 'granted'
    })
  }

  /**
   * 启动提醒检查
   */
  function startReminderCheck() {
    reminderInterval = window.setInterval(checkAllReminders, 60000)
    checkAllReminders()
  }

  /**
   * 停止提醒检查
   */
  function stopReminderCheck() {
    if (reminderInterval !== null) {
      clearInterval(reminderInterval)
      reminderInterval = null
    }
  }

  onMounted(() => {
    requestNotificationPermission().then(granted => {
      if (granted) {
        startReminderCheck()
      } else {
        startReminderCheck()
      }
    })
  })

  onUnmounted(() => {
    stopReminderCheck()
  })

  return {
    checkAllReminders,
    requestNotificationPermission,
    startReminderCheck,
    stopReminderCheck,
  }
}
