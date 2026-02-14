import { onMounted, onUnmounted } from 'vue'
import { taskStore, updateTask } from '@/stores/taskStore'
import { shouldRemind, isRepeatReminderTime, triggerReminder } from '@/utils/reminder'
import type { Task } from '@/types/task'

/**
 * 提醒管理组合函数
 */
export function useReminder() {
  let reminderInterval: number | null = null

  /**
   * 检查所有任务的提醒
   */
  function checkAllReminders() {
    // 检查主任务
    taskStore.tasks.forEach((task) => {
      if (shouldRemind(task) || isRepeatReminderTime(task)) {
        triggerReminder(task, (t) => {
          // 更新最后提醒时间
          if (t.reminder) {
            updateTask(t.id, {
              reminder: {
                ...t.reminder,
                lastReminded: new Date().toISOString(),
              },
            })
          }
        })
      }
    })

    // 检查子任务
    taskStore.tasks.forEach((task) => {
      if (task.subtasks) {
        task.subtasks.forEach((subtask) => {
          if (shouldRemind(subtask) || isRepeatReminderTime(subtask)) {
            triggerReminder(subtask, (t) => {
              if (t.reminder) {
                updateTask(t.id, {
                  reminder: {
                    ...t.reminder,
                    lastReminded: new Date().toISOString(),
                  },
                })
              }
            })
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

    return Notification.requestPermission().then((permission) => {
      return permission === 'granted'
    })
  }

  /**
 * 启动提醒检查
 */
  function startReminderCheck() {
    // 每分钟检查一次
    reminderInterval = window.setInterval(checkAllReminders, 60000)
    // 立即检查一次
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
    requestNotificationPermission().then((granted) => {
      if (granted) {
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
