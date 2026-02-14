<template>
  <div
    class="task-item bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3 transition-all hover:shadow-md"
    :class="{
      'opacity-60': task.status === 'completed',
      'border-red-300 dark:border-red-700': isOverdue && task.status === 'pending',
    }"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    :style="swipeStyle"
  >
    <div class="flex items-start gap-3">
      <!-- 复选框 -->
      <input
        type="checkbox"
        :checked="task.status === 'completed'"
        @change="toggleStatus"
        class="mt-1 w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
      />

      <!-- 任务内容 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <div class="flex-1">
            <h3
              class="text-lg font-medium text-gray-900 dark:text-gray-100"
              :class="{ 'line-through': task.status === 'completed' }"
            >
              {{ task.title }}
            </h3>
            <p
              v-if="task.description"
              class="mt-1 text-sm text-gray-600 dark:text-gray-400"
            >
              {{ task.description }}
            </p>
          </div>

          <!-- 优先级标签 -->
          <span
            class="px-2 py-1 text-xs font-medium rounded"
            :class="priorityClass"
          >
            {{ priorityText }}
          </span>
        </div>

        <!-- 任务元信息 -->
        <div class="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span v-if="task.category" :class="categoryColor">
            {{ task.category }}
          </span>
          <span v-if="task.dueDate" :class="dueDateClass">
            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ formatDate(task.dueDate) }}
          </span>
          <span v-if="hasSubtasks" class="text-primary-600 dark:text-primary-400">
            子任务: {{ completedSubtasks }}/{{ task.subtasks?.length }}
          </span>
        </div>

        <!-- 子任务列表 -->
        <div v-if="task.subtasks && task.subtasks.length > 0" class="mt-3 ml-4 space-y-2">
          <div
            v-for="subtask in task.subtasks"
            :key="subtask.id"
            class="flex items-center gap-2 text-sm"
          >
            <input
              type="checkbox"
              :checked="subtask.status === 'completed'"
              @change="toggleSubtaskStatus(subtask.id)"
              class="w-4 h-4 text-primary-600 rounded"
            />
            <span
              :class="{
                'line-through text-gray-400': subtask.status === 'completed',
              }"
            >
              {{ subtask.title }}
            </span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex items-center gap-2">
        <button
          @click="$emit('edit', task)"
          class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          title="编辑"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          @click="handleDelete"
          class="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
          title="删除"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Task } from '@/types/task'
import { formatDate, isOverdue as checkOverdue, isDueSoon } from '@/utils/date'
import { getCategoryColor } from '@/utils/category'
import { useGesture } from '@/composables/useGesture'
import { taskStore, toggleTaskStatus, deleteTask, updateTask } from '@/stores/taskStore'

interface Props {
  task: Task
}

const props = defineProps<Props>()
const emit = defineEmits<{
  edit: [task: Task]
}>()

const isOverdue = computed(() => checkOverdue(props.task.dueDate || ''))
const isDueSoonTask = computed(() => isDueSoon(props.task.dueDate || ''))

const priorityClass = computed(() => {
  const classes = {
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  }
  return classes[props.task.priority]
})

const priorityText = computed(() => {
  const texts = {
    high: '高',
    medium: '中',
    low: '低',
  }
  return texts[props.task.priority]
})

const categoryColor = computed(() => {
  return `px-2 py-1 rounded text-xs ${getCategoryColor(props.task.category || '其他')}`
})

const dueDateClass = computed(() => {
  if (isOverdue.value) {
    return 'text-red-600 dark:text-red-400 font-medium'
  }
  if (isDueSoonTask.value) {
    return 'text-yellow-600 dark:text-yellow-400 font-medium'
  }
  return ''
})

const hasSubtasks = computed(() => {
  return props.task.subtasks && props.task.subtasks.length > 0
})

const completedSubtasks = computed(() => {
  if (!props.task.subtasks) return 0
  return props.task.subtasks.filter((st) => st.status === 'completed').length
})

function toggleStatus() {
  toggleTaskStatus(props.task.id)
}

function handleDelete() {
  if (confirm('确定要删除这个任务吗？')) {
    deleteTask(props.task.id)
  }
}

function toggleSubtaskStatus(subtaskId: string) {
  const subtask = props.task.subtasks?.find((st) => st.id === subtaskId)
  if (subtask) {
    toggleTaskStatus(subtaskId)
  }
}

// 手势操作
const { gestureState, isDragging, handleTouchStart, handleTouchMove, handleTouchEnd } = useGesture(
  () => {
    // 左滑删除
    handleDelete()
  },
  () => {
    // 右滑完成
    toggleStatus()
  }
)

const swipeStyle = computed(() => {
  if (!gestureState.value || !isDragging.value) return {}
  return {
    transform: `translateX(${gestureState.value.deltaX}px)`,
    opacity: 1 - Math.abs(gestureState.value.deltaX) / 200,
  }
})
</script>

<style scoped>
.task-item {
  touch-action: pan-y;
}
</style>
