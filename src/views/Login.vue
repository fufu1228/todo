<template>
  <div class="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-8">
      <!-- Logo 和标题 -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full mb-4">
          <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">待办事项</h1>
        <p class="text-gray-500 dark:text-gray-400 mt-1">登录后同步数据到云端</p>
      </div>

      <!-- 登录/注册表单 -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- 手机号 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            手机号
          </label>
          <input
            v-model="phone"
            type="tel"
            maxlength="11"
            placeholder="请输入手机号"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- 密码 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {{ isRegister ? '设置密码' : '密码' }}
          </label>
          <input
            v-model="password"
            type="password"
            :placeholder="isRegister ? '至少6位密码' : '请输入密码'"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- 确认密码（仅注册时显示） -->
        <div v-if="isRegister">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            确认密码
          </label>
          <input
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        <!-- 错误提示 -->
        <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

        <!-- 登录/注册按钮 -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 font-medium"
        >
          {{ loading ? (isRegister ? '注册中...' : '登录中...') : (isRegister ? '注册并登录' : '登录') }}
        </button>
      </form>

      <!-- 切换登录/注册 -->
      <p class="text-center mt-6 text-sm text-gray-500 dark:text-gray-400">
        {{ isRegister ? '已有账号？' : '没有账号？' }}
        <button
          type="button"
          @click="isRegister = !isRegister"
          class="text-primary-600 dark:text-primary-400 hover:underline font-medium"
        >
          {{ isRegister ? '立即登录' : '立即注册' }}
        </button>
      </p>

      <!-- 游客入口 -->
      <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          @click="handleGuest"
          class="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
        >
          游客模式（不登录）
        </button>
        <p class="text-xs text-gray-400 dark:text-gray-500 text-center mt-2">
          游客模式下数据仅保存在本地，无法跨设备同步
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { phoneLogin, phoneRegister, anonymousLogin, fetchCloudTasks } from '@/utils/cloudSync'
import { taskStore, setUser } from '@/stores/taskStore'
import { saveAppData, loadAppData } from '@/utils/storage'

const router = useRouter()

const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const errorMessage = ref('')
const isRegister = ref(false)

// 登录/注册
async function handleSubmit() {
  if (!phone.value || !/^1[3-9]\d{9}$/.test(phone.value)) {
    errorMessage.value = '请输入正确的手机号'
    return
  }

  if (!password.value || password.value.length < 6) {
    errorMessage.value = '密码至少6位'
    return
  }

  // 注册时验证确认密码
  if (isRegister.value) {
    if (!confirmPassword.value) {
      errorMessage.value = '请确认密码'
      return
    }
    if (password.value !== confirmPassword.value) {
      errorMessage.value = '两次输入的密码不一致'
      return
    }
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const result = isRegister.value
      ? await phoneRegister(phone.value, password.value)
      : await phoneLogin(phone.value, password.value)

    if (result.success && result.user) {
      // 设置用户信息
      console.log('登录成功，准备设置用户:', result.user)
      setUser(result.user)
      console.log('用户设置完成，当前 taskStore.user:', taskStore.user)

      // 登录成功后，获取云端任务数据
      try {
        const cloudTasks = await fetchCloudTasks()
        const localData = loadAppData()
        
        // 只有云端有数据时才用云端数据覆盖本地
        if (cloudTasks.length > 0) {
          saveAppData({
            version: '1.0.0',
            tasks: cloudTasks,
            settings: localData.settings,
          })
          console.log('已从云端同步数据:', cloudTasks.length, '条')
        } else {
          console.log('云端暂无数据，保留本地数据')
        }
      } catch (e) {
        console.error('获取云端数据失败:', e)
      }

      router.replace('/')
    } else {
      errorMessage.value = result.message
    }
  } catch (error) {
    errorMessage.value = (error as Error).message
  } finally {
    loading.value = false
  }
}

// 游客模式
async function handleGuest() {
  loading.value = true
  try {
    await anonymousLogin()
    router.replace('/')
  } catch (error) {
    errorMessage.value = (error as Error).message
  } finally {
    loading.value = false
  }
}
</script>