import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Settings from '@/views/Settings.vue'
import Demo from '@/views/Demo.vue'
import Calendar from '@/views/Calendar.vue'
import Login from '@/views/Login.vue'
import Profile from '@/views/Profile.vue'
import { taskStore } from '@/stores/taskStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: { requiresAuth: true },
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: Calendar,
      meta: { requiresAuth: true },
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
    },
    {
      path: '/demo',
      name: 'demo',
      component: Demo,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
  ],
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoggedIn = taskStore.user?.isLoggedIn

  if (requiresAuth && !isLoggedIn) {
    // 未登录跳转到登录页
    next({ name: 'login', query: { redirect: to.fullPath } })
  } else if (to.name === 'login' && isLoggedIn) {
    // 已登录访问登录页跳转到首页
    next({ name: 'home' })
  } else {
    next()
  }
})

export default router
