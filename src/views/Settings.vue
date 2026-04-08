<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- 头部 -->
    <header class="bg-white dark:bg-gray-800 shadow-sm">
      <div class="max-w-4xl mx-auto px-4 py-4">
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
          <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">设置</h1>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-4xl mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- 主题设置 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">主题设置</h2>
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-700 dark:text-gray-300">当前主题</p>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {{ themeText }}
              </p>
            </div>
            <button
              @click="toggleTheme"
              class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              切换主题
            </button>
          </div>
        </section>

        <!-- 默认设置 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">默认设置</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                默认优先级
              </label>
              <select
                v-model="defaultPriority"
                @change="updateDefaultPriority"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                <option value="high">高</option>
                <option value="medium">中</option>
                <option value="low">低</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                默认提醒提前时间（分钟）
              </label>
              <input
                v-model.number="defaultReminderMinutes"
                @change="updateDefaultReminderMinutes"
                type="number"
                min="0"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </section>

        <!-- 智能提醒规则 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">智能提醒规则</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  提醒时段开始
                </label>
                <input
                  v-model="reminderRule.reminderPeriodStart"
                  @change="saveReminderRule"
                  type="time"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  提醒时段结束
                </label>
                <input
                  v-model="reminderRule.reminderPeriodEnd"
                  @change="saveReminderRule"
                  type="time"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">重要任务高频提醒</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">对高优先级任务增加提醒频率</p>
              </div>
              <input
                v-model="reminderRule.highFrequencyEnabled"
                @change="saveReminderRule"
                type="checkbox"
                class="w-5 h-5 text-primary-600 rounded"
              />
            </div>
            <div v-if="reminderRule.highFrequencyEnabled" class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  高频间隔（分钟）
                </label>
                <input
                  v-model.number="reminderRule.highFrequencyInterval"
                  @change="saveReminderRule"
                  type="number"
                  min="5"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  触发优先级
                </label>
                <select
                  v-model="reminderRule.highFrequencyPriority"
                  @change="saveReminderRule"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                </select>
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">逾期二次提醒</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">任务逾期后定期再次提醒</p>
              </div>
              <input
                v-model="reminderRule.overdueSecondaryEnabled"
                @change="saveReminderRule"
                type="checkbox"
                class="w-5 h-5 text-primary-600 rounded"
              />
            </div>
            <div v-if="reminderRule.overdueSecondaryEnabled">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                逾期重提醒间隔（分钟）
              </label>
              <input
                v-model.number="reminderRule.overdueSecondaryInterval"
                @change="saveReminderRule"
                type="number"
                min="30"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </section>

        <!-- AI 智能分类 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">AI 智能分类</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">启用 AI 分类</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  使用 DeepSeek API 进行语义分类
                </p>
              </div>
              <input
                v-model="llmEnabled"
                @change="updateLLMSettings"
                type="checkbox"
                class="w-5 h-5 text-primary-600 rounded"
              />
            </div>
            <div v-if="llmEnabled">
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                DeepSeek API Key
              </label>
              <input
                v-model="llmApiKey"
                @change="updateLLMSettings"
                type="password"
                placeholder="sk-..."
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                API Key 仅保存在本地，不会上传到服务器
              </p>
            </div>
            <div v-if="llmPrefs.length > 0">
              <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                已学习 {{ llmPrefs.length }} 条分类偏好
              </p>
              <div class="max-h-32 overflow-y-auto space-y-1">
                <div
                  v-for="(pref, i) in llmPrefs.slice(-5)"
                  :key="i"
                  class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2"
                >
                  <span class="truncate flex-1">{{ pref.text }}</span>
                  <span class="text-yellow-600">{{ pref.predictedCategory }}</span>
                  <svg
                    v-if="pref.userCorrectedCategory"
                    class="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                  <span v-if="pref.userCorrectedCategory" class="text-green-600">{{
                    pref.userCorrectedCategory
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 云端同步 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">云端同步</h2>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-700 dark:text-gray-300">腾讯云 CloudBase</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  跨设备同步，本地数据优先，云端作为备份
                </p>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CloudBase 环境 ID
              </label>
              <input
                v-model="cloudEnvId"
                @change="updateCloudSettings"
                type="text"
                placeholder="例如: todo-xxx"
                class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                在腾讯云 CloudBase 控制台创建环境后填入环境 ID
              </p>
            </div>
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="handleSync"
                :disabled="syncing"
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {{ syncing ? '同步中...' : '立即同步' }}
              </button>
              <button
                @click="handleForceUpload"
                :disabled="syncing"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                强制上传
              </button>
            </div>
            <p
              v-if="syncMessage"
              class="text-sm"
              :class="syncSuccess ? 'text-green-600' : 'text-red-600'"
            >
              {{ syncMessage }}
            </p>
            <p v-if="lastSyncAt" class="text-xs text-gray-500 dark:text-gray-400">
              上次同步: {{ lastSyncAt }}
            </p>
          </div>
        </section>

        <!-- 数据管理 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">数据管理</h2>
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                @click="handleExport"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                导出数据
              </button>
              <label
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center cursor-pointer"
              >
                <input type="file" accept=".json" @change="handleImport" class="hidden" />
                导入数据
              </label>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              导出数据为JSON格式，可用于备份或迁移。导入数据将覆盖当前所有数据，请谨慎操作。
            </p>
          </div>
        </section>

        <!-- 分类管理 -->
        <section
          class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 class="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">分类管理</h2>
          <div class="space-y-4">
            <div class="flex flex-wrap gap-2">
              <div
                v-for="category in categories"
                :key="category"
                class="inline-flex items-center gap-1"
              >
                <span
                  :class="getCategoryColor(category, categoryColors)"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ category }}
                </span>
                <button
                  @click="removeCategory(category)"
                  class="p-1 text-gray-400 hover:text-red-500"
                  title="删除分类"
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
            </div>

            <div class="grid sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  新分类名称
                </label>
                <input
                  v-model.trim="newCategory"
                  type="text"
                  placeholder="例如：旅行"
                  class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  颜色
                </label>
                <select
                  v-model="newCategoryColor"
                  class="w-full sm:w-40 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option v-for="option in colorOptions" :key="option.name" :value="option.value">
                    {{ option.name }}
                  </option>
                </select>
              </div>
              <button
                @click="addCategory"
                class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                添加分类
              </button>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              可新增自定义分类并设置颜色；分类仍可通过关键词自动匹配。
            </p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { taskStore, updateSettings } from '@/stores/taskStore'
import { useTheme } from '@/composables/useTheme'
import { downloadData, readDataFromFile, saveAppData, loadAppData } from '@/utils/storage'
import { getCategoryColor } from '@/utils/category'
import { syncWithCloud, anonymousLogin } from '@/utils/cloudSync'

const { theme, toggleTheme } = useTheme()

const themeText = computed(() => {
  const texts = {
    light: '浅色',
    dark: '深色',
    auto: '跟随系统',
  }
  return texts[theme.value]
})

const defaultPriority = ref(taskStore.settings.defaultPriority)
const defaultReminderMinutes = ref(taskStore.settings.defaultReminderMinutes)
const categories = computed(() => taskStore.settings.categories)
const categoryColors = computed(() => taskStore.settings.categoryColors || {})
const newCategory = ref('')
const colorOptions = [
  { name: '蓝色', value: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { name: '绿色', value: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  { name: '黄色', value: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { name: '紫色', value: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  { name: '红色', value: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
  { name: '粉色', value: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  { name: '青色', value: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' },
  { name: '靛蓝', value: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
]
const newCategoryColor = ref(colorOptions[0].value)

// 智能提醒规则
const reminderRule = computed(() => {
  const rules = taskStore.settings.smartReminderRules
  return (
    rules?.[0] || {
      id: 'default',
      name: '默认规则',
      advanceMinutes: 30,
      reminderPeriodStart: '08:00',
      reminderPeriodEnd: '22:00',
      highFrequencyEnabled: false,
      highFrequencyInterval: 15,
      highFrequencyPriority: 'high' as const,
      overdueSecondaryEnabled: true,
      overdueSecondaryInterval: 120,
    }
  )
})

function saveReminderRule() {
  updateSettings({
    smartReminderRules: [{ ...reminderRule.value }],
  })
}

// LLM 设置
const llmEnabled = ref(taskStore.settings.llm?.enabled || false)
const llmApiKey = ref(taskStore.settings.llm?.apiKey || '')
const llmPrefs = computed(() => taskStore.settings.llm?.prefs || [])

function updateLLMSettings() {
  updateSettings({
    llm: {
      enabled: llmEnabled.value,
      apiKey: llmApiKey.value,
      model: 'deepseek-chat',
      prefs: llmPrefs.value,
    },
  })
}

// 云端同步
const cloudEnvId = ref(taskStore.settings.cloudSync?.envId || '')
const syncing = ref(false)
const syncMessage = ref('')
const syncSuccess = ref(false)
const lastSyncAt = ref(taskStore.settings.cloudSync?.lastSyncAt || '')

function updateCloudSettings() {
  updateSettings({
    cloudSync: {
      enabled: true,
      envId: cloudEnvId.value,
      authType: 'anonymous',
      lastSyncAt: lastSyncAt.value,
    },
  })
}

async function handleSync() {
  if (!cloudEnvId.value) return
  syncing.value = true
  syncMessage.value = ''
  try {
    const logged = await anonymousLogin()
    if (!logged) {
      syncSuccess.value = false
      syncMessage.value = '登录失败'
      return
    }
    const result = await syncWithCloud()
    syncSuccess.value = result.success
    syncMessage.value = result.message
    if (result.success) {
      lastSyncAt.value = new Date().toISOString()
      updateCloudSettings()
    }
  } catch (error) {
    syncSuccess.value = false
    syncMessage.value = (error as Error).message
  } finally {
    syncing.value = false
  }
}

async function handleForceUpload() {
  if (!cloudEnvId.value) return
  syncing.value = true
  syncMessage.value = ''
  try {
    const logged = await anonymousLogin()
    if (!logged) {
      syncSuccess.value = false
      syncMessage.value = '登录失败'
      return
    }
    const { syncTasksToCloud } = await import('@/utils/cloudSync')
    const localData = loadAppData()
    const result = await syncTasksToCloud(localData.tasks)
    syncSuccess.value = result.success
    syncMessage.value = result.message
    if (result.success) {
      lastSyncAt.value = new Date().toISOString()
      updateCloudSettings()
    }
  } catch (error) {
    syncSuccess.value = false
    syncMessage.value = (error as Error).message
  } finally {
    syncing.value = false
  }
}

function updateDefaultPriority() {
  updateSettings({ defaultPriority: defaultPriority.value })
}

function updateDefaultReminderMinutes() {
  updateSettings({ defaultReminderMinutes: defaultReminderMinutes.value })
}

function addCategory() {
  const name = newCategory.value.trim()
  if (!name) return
  if (taskStore.settings.categories.includes(name)) {
    alert('分类已存在')
    return
  }

  const categories = [...taskStore.settings.categories, name]
  const categoryColors = {
    ...taskStore.settings.categoryColors,
    [name]: newCategoryColor.value,
  }
  const categoryRules = {
    ...taskStore.settings.categoryRules,
    [name]: [],
  }

  updateSettings({ categories, categoryColors, categoryRules })
  newCategory.value = ''
}

function removeCategory(category: string) {
  if (!confirm(`确定要删除分类「${category}」吗？`)) return
  const categories = taskStore.settings.categories.filter(item => item !== category)
  if (categories.length === 0) {
    alert('至少需要保留一个分类')
    return
  }

  const categoryColors = { ...taskStore.settings.categoryColors }
  delete categoryColors[category]
  const categoryRules = { ...taskStore.settings.categoryRules }
  delete categoryRules[category]

  updateSettings({ categories, categoryColors, categoryRules })
}

function handleExport() {
  downloadData({
    version: '1.0.0',
    tasks: taskStore.tasks,
    settings: taskStore.settings,
  })
}

async function handleImport(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    const data = await readDataFromFile(file)
    if (confirm('导入数据将覆盖当前所有数据，确定要继续吗？')) {
      saveAppData(data)
      // 重新加载页面以应用新数据
      window.location.reload()
    }
  } catch (error) {
    alert('导入失败：' + (error as Error).message)
  }
}
</script>
