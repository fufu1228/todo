<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
      <div class="max-w-4xl mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">我的待办</h1>
          <div class="flex items-center gap-3">
            <!-- 搜索 -->
            <div class="relative hidden md:block">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="搜索任务..."
                class="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 w-64"
              />
              <svg
                class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <!-- 演示 -->
            <router-link
              to="/demo"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="演示"
            >
              <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7V5z" />
              </svg>
            </router-link>
            <router-link
              to="/settings"
              class="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
              title="设置"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <!-- 工具栏 -->
      <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <!-- 筛选和排序 -->
        <div class="flex flex-wrap items-center gap-2">
          <select
            v-model="statusFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="">全部状态</option>
            <option value="pending">未完成</option>
            <option value="completed">已完成</option>
          </select>

          <select
            v-model="categoryFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="">全部分类</option>
            <option v-for="cat in categories" :key="cat" :value="cat">
              {{ cat }}
            </option>
          </select>

          <select
            v-model="priorityFilter"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="">全部优先级</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>

          <select
            v-model="sortField"
            class="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
          >
            <option value="createdAt">创建时间</option>
            <option value="dueDate">截止时间</option>
            <option value="priority">优先级</option>
            <option value="title">标题</option>
          </select>

          <button
            @click="toggleSortOrder"
            class="p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="切换排序顺序"
          >
            <svg
              class="w-5 h-5"
              :class="{ 'transform rotate-180': sortOrder === 'desc' }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 15l7-7 7 7"
              />
            </svg>
          </button>
        </div>

        <!-- 操作按钮 -->
        <div class="flex items-center gap-2">
          <button
            @click="showTaskForm = true"
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

      <!-- 移动端搜索 -->
      <div class="md:hidden mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索任务..."
          class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      <!-- 任务列表 -->
      <div v-if="filteredTasks.length > 0" class="space-y-3">
        <TaskItem
          v-for="task in filteredTasks"
          :key="task.id"
          :task="task"
          @edit="handleEdit"
        />
      </div>

      <!-- 空状态 -->
      <div
        v-else
        class="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">暂无任务</h3>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          点击"新建任务"按钮开始添加任务
        </p>
      </div>
    </main>

    <!-- 任务表单弹窗 -->
    <TaskForm v-if="showTaskForm" :task="editingTask" @close="handleFormClose" />

    <!-- 快捷键提示（仅PC端） -->
    <div
      v-if="showShortcuts"
      class="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 text-sm"
    >
      <h3 class="font-medium mb-2 text-gray-900 dark:text-gray-100">快捷键</h3>
      <ul class="space-y-1 text-gray-600 dark:text-gray-400">
        <li><kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Ctrl/Cmd + N</kbd> 新建任务</li>
        <li><kbd class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Esc</kbd> 取消/关闭</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import TaskItem from '@/components/TaskItem.vue'
import TaskForm from '@/components/TaskForm.vue'
import { taskStore, filteredAndSortedTasks, updateSort, deleteTasks } from '@/stores/taskStore'
import { useKeyboardShortcut } from '@vueuse/core'
import type { Task } from '@/types/task'

const showTaskForm = ref(false)
const editingTask = ref<Task | undefined>()
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const priorityFilter = ref('')
const sortField = ref<'dueDate' | 'priority' | 'createdAt' | 'title'>('createdAt')
const sortOrder = ref<'asc' | 'desc'>('desc')
const showShortcuts = ref(false)

const categories = computed(() => taskStore.settings.categories)

// 应用筛选和排序
const filteredTasks = computed(() => {
  let tasks = [...filteredAndSortedTasks.value]

  // 应用筛选器
  taskStore.filter = {
    status: statusFilter.value || undefined,
    category: categoryFilter.value || undefined,
    priority: priorityFilter.value || undefined,
    search: searchQuery.value || undefined,
  }

  // 应用排序
  updateSort({
    field: sortField.value,
    order: sortOrder.value,
  })

  return tasks
})

function toggleSortOrder() {
  sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
}

function handleEdit(task: Task) {
  editingTask.value = task
  showTaskForm.value = true
}

function handleFormClose() {
  showTaskForm.value = false
  editingTask.value = undefined
}


// 快捷键：Ctrl/Cmd + N 新建任务
useKeyboardShortcut(['Meta+n', 'Ctrl+n'], () => {
  if (!showTaskForm.value) {
    showTaskForm.value = true
  }
})

// 显示快捷键提示（仅PC端）
if (window.innerWidth >= 1024) {
  setTimeout(() => {
    showShortcuts.value = true
    setTimeout(() => {
      showShortcuts.value = false
    }, 5000)
  }, 2000)
}
</script>
