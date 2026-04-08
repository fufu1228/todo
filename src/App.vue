<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
    <router-view />
    <!-- 应用内提醒弹窗容器 -->
    <ReminderDialog />
  </div>
</template>

<script setup lang="ts">
import { useTheme } from './composables/useTheme'
import { useReminder } from './composables/useReminder'
import ReminderDialog from './components/ReminderDialog.vue'

// 初始化主题
useTheme()

// 初始化提醒功能
useReminder()
</script>
