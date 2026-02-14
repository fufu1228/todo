import { ref, watch, onMounted } from 'vue'
import { taskStore, updateSettings } from '@/stores/taskStore'

export type Theme = 'light' | 'dark' | 'auto'

export function useTheme() {
  const theme = ref<Theme>(taskStore.settings.theme)

  /**
   * 应用主题
   */
  function applyTheme(newTheme: Theme) {
    theme.value = newTheme
    updateSettings({ theme: newTheme })

    const root = document.documentElement
    if (newTheme === 'auto') {
      // 跟随系统主题
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      root.classList.toggle('dark', newTheme === 'dark')
    }
  }

  /**
   * 切换主题
   */
  function toggleTheme() {
    const themes: Theme[] = ['light', 'dark', 'auto']
    const currentIndex = themes.indexOf(theme.value)
    const nextIndex = (currentIndex + 1) % themes.length
    applyTheme(themes[nextIndex])
  }

  // 监听系统主题变化
  onMounted(() => {
    if (theme.value === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      const handleChange = (e: MediaQueryListEvent) => {
        document.documentElement.classList.toggle('dark', e.matches)
      }
      mediaQuery.addEventListener('change', handleChange)
      applyTheme('auto')
    } else {
      applyTheme(theme.value)
    }
  })

  // 监听主题变化
  watch(
    () => taskStore.settings.theme,
    (newTheme) => {
      applyTheme(newTheme)
    }
  )

  return {
    theme,
    applyTheme,
    toggleTheme,
  }
}
