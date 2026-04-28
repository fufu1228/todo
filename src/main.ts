import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import cloudbase from '@cloudbase/js-sdk'
import { getStoredUserId, setStorageUser } from '@/utils/storage'
import { taskStore, setUser } from '@/stores/taskStore'

// 初始化 CloudBase
const app = cloudbase.init({
  env: 'todo-9g0tchg88d1d3347',
})

// 应用启动时先进行匿名登录，确保后续云函数调用正常
app.auth().anonymousAuthProvider().signIn()
  .then(() => {
    console.log('匿名登录成功')
  })
  .catch((e: Error) => {
    console.warn('匿名登录失败（可忽略）:', e.message)
  })

// 恢复登录状态：如果 localStorage 中有已登录的 userId，自动恢复
const storedUserId = getStoredUserId()
if (storedUserId && storedUserId !== 'guest') {
  setStorageUser(storedUserId)
  setUser({
    userId: storedUserId,
    phone: storedUserId,
    isLoggedIn: true,
  })
}

const vueApp = createApp(App)

vueApp.use(router)

vueApp.mount('#app')
