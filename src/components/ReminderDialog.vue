<template>
  <!-- 应用内提醒弹窗 -->
  <TransitionGroup
    tag="div"
    class="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full pointer-events-none"
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 translate-x-8"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-300"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-8"
  >
    <div
      v-for="reminder in reminders"
      :key="reminder.id"
      class="pointer-events-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4"
      :class="{
        'border-l-4 border-l-yellow-500': reminder.type === 'advance',
        'border-l-4 border-l-blue-500': reminder.type === 'periodic',
        'border-l-4 border-l-red-500': reminder.type === 'overdue',
      }"
    >
      <div class="flex items-start justify-between gap-2">
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <span
              class="text-xs font-medium px-2 py-0.5 rounded"
              :class="typeBadgeClass(reminder.type)"
            >
              {{ typeText(reminder.type) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ getRelativeTime(reminder.createdAt) }}
            </span>
          </div>
          <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {{ reminder.task.title }}
          </h4>
          <p
            v-if="reminder.task.description"
            class="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2"
          >
            {{ reminder.task.description }}
          </p>
          <p v-if="reminder.task.dueDate" class="text-xs text-gray-400 dark:text-gray-500 mt-1">
            截止: {{ formatDate(reminder.task.dueDate) }}
          </p>
        </div>
        <button
          @click="dismiss(reminder.id)"
          class="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 flex-shrink-0"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div class="flex gap-2 mt-3">
        <button
          @click="snooze(reminder)"
          class="flex-1 text-xs px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          稍后提醒
        </button>
        <button
          @click="completeAndDismiss(reminder)"
          class="flex-1 text-xs px-3 py-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
        >
          标记完成
        </button>
      </div>
    </div>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { InAppReminder } from '@/types/task'
import { toggleTaskStatus } from '@/stores/taskStore'
import { formatDate, dayjs } from '@/utils/date'

const reminders = ref<InAppReminder[]>([])

/**
 * 添加提醒到弹窗列表
 */
function addInAppReminder(reminder: InAppReminder) {
  reminders.value.push(reminder)
  setTimeout(() => {
    dismiss(reminder.id)
  }, 10000)
}

// 监听全局提醒事件
function handleReminderEvent(e: Event) {
  const detail = (e as CustomEvent).detail
  if (detail) {
    addInAppReminder(detail)
  }
}

onMounted(() => {
  window.addEventListener('todo-reminder', handleReminderEvent)
})

onUnmounted(() => {
  window.removeEventListener('todo-reminder', handleReminderEvent)
})

/**
 * 关闭提醒
 */
function dismiss(id: string) {
  reminders.value = reminders.value.filter(r => r.id !== id)
}

/**
 * 稍后提醒（5分钟后再次提醒）
 */
function snooze(reminder: InAppReminder) {
  dismiss(reminder.id)
  setTimeout(
    () => {
      addInAppReminder({
        ...reminder,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
      })
    },
    5 * 60 * 1000
  )
}

/**
 * 标记完成并关闭提醒
 */
function completeAndDismiss(reminder: InAppReminder) {
  toggleTaskStatus(reminder.task.id)
  dismiss(reminder.id)
}

/**
 * 提醒类型文本
 */
function typeText(type: 'advance' | 'periodic' | 'overdue'): string {
  const texts = {
    advance: '任务提醒',
    periodic: '周期提醒',
    overdue: '逾期提醒',
  }
  return texts[type]
}

/**
 * 提醒类型样式
 */
function typeBadgeClass(type: 'advance' | 'periodic' | 'overdue'): string {
  const classes = {
    advance: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    periodic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    overdue: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }
  return classes[type]
}

/**
 * 获取相对时间
 */
function getRelativeTime(date: string): string {
  return dayjs(date).fromNow()
}
</script>
