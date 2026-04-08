<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <router-link
              to="/"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </router-link>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">日历视图</h1>
          </div>
          <button
            @click="openCreateForm()"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span class="hidden sm:inline">新建任务</span>
          </button>
        </div>
      </div>
    </header>

    <!-- 日历 + 统计 -->
    <main class="max-w-6xl mx-auto px-4 py-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 日历 -->
        <div class="lg:col-span-2">
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <FullCalendar ref="calendarRef" :options="calendarOptions" class="fc-theme-custom" locale="zh-cn" />
          </div>
        </div>

        <!-- 统计面板 -->
        <div class="space-y-6">
          <!-- 本日 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">本日</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ stats.today.total }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">总任务</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ stats.today.completed }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已完成</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {{ stats.today.pending }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">未完成</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ stats.today.overdue }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已逾期</div>
              </div>
            </div>
          </div>

          <!-- 本周 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">本周</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ stats.week.total }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">总任务</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ stats.week.completed }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已完成</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {{ stats.week.pending }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">未完成</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ stats.week.overdue }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已逾期</div>
              </div>
            </div>
          </div>

          <!-- 本月 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">本月</h3>
            <div class="grid grid-cols-2 gap-3">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ stats.month.total }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">总任务</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">
                  {{ stats.month.completed }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已完成</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {{ stats.month.pending }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">未完成</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-red-600 dark:text-red-400">
                  {{ stats.month.overdue }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">已逾期</div>
              </div>
            </div>
          </div>

          <!-- 完成率 -->
          <div
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">总完成率</h3>
            <div class="text-center py-2">
              <div class="text-4xl font-bold text-primary-600 dark:text-primary-400">
                {{ completionRate }}%
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ stats.total.completed }} / {{ stats.total.total }} 任务
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 任务表单弹窗 -->
    <TaskForm
      v-if="showTaskForm"
      :task="editingTask"
      :parent-id="parentTaskId"
      :initial-due-date="formInitialDueDate"
      @close="handleFormClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
// import zhLocale from '@fullcalendar/core/locales/zh-cn'
// import { zhCn } from '@fullcalendar/common/locales'
import TaskForm from '@/components/TaskForm.vue'
import { taskStore } from '@/stores/taskStore'
import { getCategoryColor } from '@/utils/category'
import { dayjs } from '@/utils/date'
import type { Task } from '@/types/task'

const calendarRef = ref<any>(null)
const showTaskForm = ref(false)
const editingTask = ref<Task | undefined>()
const parentTaskId = ref<string | undefined>()
const formInitialDueDate = ref('')

// 统计：按日期范围统计任务数量
function computeStats(tasks: Task[], start: string, end: string) {
  const filtered = tasks.filter(t => {
    if (!t.dueDate) return false
    const d = t.dueDate.split('T')[0]
    return d >= start && d <= end
  })
  const todayStr = dayjs().format('YYYY-MM-DD')
  return {
    total: filtered.length,
    completed: filtered.filter(t => t.status === 'completed').length,
    pending: filtered.filter(t => t.status === 'pending').length,
    overdue: filtered.filter(
      t => t.status === 'pending' && t.dueDate && t.dueDate.split('T')[0] < todayStr
    ).length,
  }
}

const stats = computed(() => {
  const allTasks = collectAllTasks(taskStore.tasks)
  const today = dayjs()
  return {
    today: computeStats(allTasks, today.format('YYYY-MM-DD'), today.format('YYYY-MM-DD')),
    week: computeStats(
      allTasks,
      today.startOf('week').format('YYYY-MM-DD'),
      today.endOf('week').format('YYYY-MM-DD')
    ),
    month: computeStats(
      allTasks,
      today.startOf('month').format('YYYY-MM-DD'),
      today.endOf('month').format('YYYY-MM-DD')
    ),
    total: {
      total: allTasks.length,
      completed: allTasks.filter(t => t.status === 'completed').length,
      pending: allTasks.filter(t => t.status === 'pending').length,
      overdue: allTasks.filter(
        t =>
          t.status === 'pending' &&
          t.dueDate &&
          t.dueDate.split('T')[0] < today.format('YYYY-MM-DD')
      ).length,
    },
  }
})

const completionRate = computed(() => {
  const { total, completed } = stats.value.total
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
})

// 将任务转换为 FullCalendar 事件
const calendarEvents = computed(() => {
  const allTasks = collectAllTasks(taskStore.tasks)
  return allTasks
    .filter(t => t.dueDate)
    .map(task => {
      const dateStr = dayjs(task.dueDate).format('YYYY-MM-DD')
      const isCompleted = task.status === 'completed'
      const categoryColor = getCategoryColor(
        task.category || '其他',
        taskStore.settings.categoryColors
      )

      let color = '#3b82f6'
      if (isCompleted) color = '#9ca3af'
      else if (task.priority === 'high') color = '#ef4444'
      else if (task.priority === 'medium') color = '#f59e0b'
      else if (task.priority === 'low') color = '#10b981'

      return {
        id: task.id,
        title: task.title,
        start: dateStr,
        allDay: task.isAllDay ?? true,
        backgroundColor: color,
        borderColor: color,
        textColor: isCompleted ? '#9ca3af' : '#fff',
        classNames: isCompleted ? ['fc-event-completed'] : [],
        extendedProps: {
          task,
          categoryColor,
        },
      }
    })
})

// FullCalendar 配置
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth' as const,
  locale: 'zh-cn',
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: '',
  },
  buttonText: {
    today: '今天',
    month: '月',
  },
  events: calendarEvents.value,
  editable: false,
  selectable: true,
  dateClick: (info: any) => {
    openCreateForm(info.dateStr)
  },
  eventClick: (info: any) => {
    const task = info.event.extendedProps.task as Task
    openEditForm(task)
  },
  eventContent: (arg: any) => {
    const task = arg.event.extendedProps.task as Task
    const isCompleted = task.status === 'completed'
    const priorityIcon = task.priority === 'high' ? '!' : task.priority === 'medium' ? '·' : ''

    return {
      html: `
        <div class="fc-event-main-frame" style="display:flex;align-items:center;gap:2px;overflow:hidden;">
          ${priorityIcon ? `<span class="fc-priority-icon" style="font-weight:bold;font-size:10px;opacity:0.8;">${priorityIcon}</span>` : ''}
          <span class="fc-event-title" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;${isCompleted ? 'text-decoration:line-through;opacity:0.6;' : ''}">${arg.event.title}</span>
        </div>
      `,
    }
  },
}))

function collectAllTasks(tasks: Task[]): Task[] {
  const result: Task[] = []
  tasks.forEach(t => {
    result.push(t)
    if (t.subtasks) result.push(...collectAllTasks(t.subtasks))
  })
  return result
}

function openCreateForm(dueDate?: string) {
  editingTask.value = undefined
  parentTaskId.value = undefined
  formInitialDueDate.value = dueDate || ''
  showTaskForm.value = true
}

function openEditForm(task: Task) {
  editingTask.value = task
  parentTaskId.value = undefined
  formInitialDueDate.value = ''
  showTaskForm.value = true
}

function handleFormClose() {
  showTaskForm.value = false
  editingTask.value = undefined
  parentTaskId.value = undefined
  formInitialDueDate.value = ''
}

let dayCheckInterval: number | null = null

onMounted(() => {
  dayCheckInterval = window.setInterval(() => {}, 60000)
})

onUnmounted(() => {
  if (dayCheckInterval) clearInterval(dayCheckInterval)
})
</script>

<style>
.fc-theme-custom {
  --fc-border-color: theme('colors.gray.200');
  --fc-bg-color: transparent;
  --fc-today-bg-color: theme('colors.blue.50');
  --fc-neutral-bg-color: theme('colors.gray.100');
  --fc-page-bg-color: transparent;
  --fc-event-bg-color: #3b82f6;
  --fc-event-border-color: #3b82f6;
  --fc-event-text-color: #fff;
}

.dark .fc-theme-custom {
  --fc-border-color: theme('colors.gray.700');
  --fc-today-bg-color: rgba(59, 130, 246, 0.1);
  --fc-neutral-bg-color: theme('colors.gray.700');
  --fc-button-bg-color: theme('colors.gray.700');
  --fc-button-border-color: theme('colors.gray.600');
  --fc-button-text-color: theme('colors.gray.200');
  --fc-button-hover-bg-color: theme('colors.gray.600');
  --fc-button-hover-border-color: theme('colors.gray.500');
  --fc-button-active-bg-color: theme('colors.gray.600');
  --fc-button-active-border-color: theme('colors.gray.500');
  --fc-event-bg-color: #3b82f6;
  --fc-event-border-color: #3b82f6;
  --fc-event-text-color: #fff;
  --fc-more-link-bg-color: transparent;
  --fc-more-link-text-color: theme('colors.blue.400');
  --fc-list-event-hover-bg-color: theme('colors.gray.700');
  --fc-today-highlight-color: theme('colors.blue.500');
}

.fc-theme-custom .fc-toolbar-title {
  @apply text-lg font-semibold text-gray-900 dark:text-gray-100;
}

.fc-theme-custom .fc-button {
  @apply text-sm rounded-lg px-3 py-1.5;
}

.fc-theme-custom .fc-daygrid-day-number {
  @apply text-sm text-gray-700 dark:text-gray-300 p-2;
}

.fc-theme-custom .fc-col-header-cell {
  @apply text-sm font-medium text-gray-500 dark:text-gray-400 py-2;
}

.fc-theme-custom .fc-daygrid-day.fc-day-today {
  @apply bg-blue-50 dark:bg-blue-900/20;
}

.fc-theme-custom .fc-daygrid-day-frame {
  @apply min-h-[80px];
}

.fc-theme-custom .fc-event {
  @apply rounded text-xs cursor-pointer mb-1;
}

.fc-theme-custom .fc-event-completed {
  opacity: 0.6;
}

.fc-theme-custom .fc-daygrid-day-events {
  @apply px-1 pb-1;
}
</style>
