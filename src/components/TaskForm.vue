<template>
  <div
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="handleCancel"
  >
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="p-6">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {{ isEdit ? '编辑任务' : '新建任务' }}
        </h2>
        <p v-if="parentId && !isEdit" class="mb-4 text-sm text-primary-600 dark:text-primary-400">
          正在创建子任务
        </p>
        <p v-if="isClassifying" class="mb-4 text-sm text-blue-600 dark:text-blue-400">
          AI 正在自动分类...
        </p>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- 标题 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              标题 <span class="text-red-500">*</span>
            </label>
            <input
              v-model="formData.title"
              type="text"
              required
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="输入任务标题"
            />
          </div>

          <!-- 描述 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              描述
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              placeholder="输入任务描述（可选）"
            />
          </div>

          <!-- 截止日期 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              截止日期
            </label>
            <input
              v-model="formData.dueDate"
              type="date"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <!-- 优先级 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              优先级
            </label>
            <div class="flex gap-2">
              <button
                v-for="priority in priorities"
                :key="priority.value"
                type="button"
                @click="formData.priority = priority.value"
                class="flex-1 px-4 py-2 rounded-lg border-2 transition-all"
                :class="
                  formData.priority === priority.value
                    ? priority.activeClass
                    : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-300'
                "
              >
                {{ priority.label }}
              </button>
            </div>
          </div>

          <!-- 分类 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              分类
            </label>
            <select
              v-model="formData.category"
              @change="onCategoryChange"
              class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="">自动分类</option>
              <option v-for="cat in categories" :key="cat" :value="cat">
                {{ cat }}
              </option>
            </select>
          </div>

          <!-- 提醒设置 -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="flex items-center justify-between mb-4">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300"> 启用提醒 </label>
              <input
                v-model="formData.reminder.enabled"
                type="checkbox"
                class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
            </div>

            <div v-if="formData.reminder.enabled" class="space-y-4 pl-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  提前提醒（分钟）
                </label>
                <input
                  v-model.number="formData.reminder.advanceMinutes"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  重复类型
                </label>
                <select
                  v-model="formData.reminder.repeatType"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="none">不重复</option>
                  <option value="daily">每天</option>
                  <option value="weekly">每周</option>
                  <option value="monthly">每月</option>
                </select>
              </div>

              <div v-if="formData.reminder.repeatType !== 'none'">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  提醒时段（HH:mm）
                </label>
                <input
                  v-model="formData.reminder.reminderTime"
                  type="time"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
          </div>

          <!-- 按钮 -->
          <div class="flex gap-3 pt-4">
            <button
              v-if="isEdit"
              type="button"
              @click="handleDelete"
              class="px-4 py-2 border border-red-300 dark:border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              删除
            </button>
            <button
              type="button"
              @click="handleCancel"
              class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {{ isSubmitting ? '提交中...' : isEdit ? '保存' : '创建' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Task, TaskPriority, ReminderConfig } from '@/types/task'
import {
  taskStore,
  createTask,
  updateTask,
  deleteTask,
  saveCategoryPreference,
} from '@/stores/taskStore'
import { useKeyboardShortcut } from '@/composables/useKeyboardShortcut'

interface Props {
  task?: Task
  parentId?: string
  initialDueDate?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const isEdit = computed(() => !!props.task)
const isClassifying = ref(false)
const isSubmitting = ref(false)

const formData = ref<{
  title: string
  description: string
  dueDate: string
  priority: TaskPriority
  category: string
  reminder: ReminderConfig
}>({
  title: props.task?.title || '',
  description: props.task?.description || '',
  dueDate: props.task?.dueDate ? props.task.dueDate.split('T')[0] : props.initialDueDate || '',
  priority: props.task?.priority || taskStore.settings.defaultPriority,
  category: props.task?.category || '',
  reminder: props.task?.reminder || {
    enabled: false,
    advanceMinutes: taskStore.settings.defaultReminderMinutes,
    repeatType: 'none',
  },
})

const priorities: Array<{ value: TaskPriority; label: string; activeClass: string }> = [
  {
    value: 'high',
    label: '高',
    activeClass: 'border-red-500 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-200',
  },
  {
    value: 'medium',
    label: '中',
    activeClass:
      'border-yellow-500 bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200',
  },
  {
    value: 'low',
    label: '低',
    activeClass: 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200',
  },
]

const categories = computed(() => taskStore.settings.categories)

// 监听标题和描述变化，触发自动分类
watch(
  () => [formData.value.title, formData.value.description],
  () => {
    if (!isEdit.value && !props.task && !formData.value.category) {
      triggerAutoClassify()
    }
  }
)

let classifyTimer: ReturnType<typeof setTimeout> | null = null

async function triggerAutoClassify() {
  if (classifyTimer) clearTimeout(classifyTimer)
  classifyTimer = setTimeout(async () => {
    if (formData.value.title && !formData.value.category) {
      isClassifying.value = true
      try {
        const llmEnabled = taskStore.settings.llm?.enabled || false
        const apiKey = taskStore.settings.llm?.apiKey || ''
        const prefs = taskStore.settings.llm?.prefs || []
        const { autoCategorize } = await import('@/utils/category')
        const category = await autoCategorize(
          formData.value.title,
          formData.value.description || undefined,
          taskStore.settings.categoryRules,
          taskStore.settings.categories,
          llmEnabled,
          apiKey,
          prefs
        )
        formData.value.category = category
      } finally {
        isClassifying.value = false
      }
    }
  }, 500)
}

function onCategoryChange() {
  if (isEdit.value && props.task && props.task.category !== formData.value.category) {
    saveCategoryPreference(props.task.id, props.task.category || '', formData.value.category)
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  try {
    const taskData: Partial<Task> = {
      title: formData.value.title,
      description: formData.value.description || undefined,
      dueDate: formData.value.dueDate ? `${formData.value.dueDate}T00:00:00` : undefined,
      isAllDay: true,
      priority: formData.value.priority,
      category: formData.value.category || undefined,
      reminder: formData.value.reminder.enabled ? formData.value.reminder : undefined,
      parentId: props.parentId,
    }

    if (isEdit.value && props.task) {
      updateTask(props.task.id, taskData)
    } else {
      await createTask(taskData)
    }

    emit('close')
  } finally {
    isSubmitting.value = false
  }
}

function handleDelete() {
  if (props.task && confirm('确定要删除这个任务吗？')) {
    deleteTask(props.task.id)
    emit('close')
  }
}

function handleCancel() {
  emit('close')
}

useKeyboardShortcut('Escape', handleCancel)
</script>
