import { onMounted, onUnmounted } from 'vue'

type Shortcut = string | string[]

function normalizeKey(key: string): string {
  return key.trim().toLowerCase()
}

function matchShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut
    .split('+')
    .map((part) => normalizeKey(part))
    .filter(Boolean)

  const keyPart = parts.find((part) => !['meta', 'cmd', 'ctrl', 'shift', 'alt'].includes(part))
  const needMeta = parts.includes('meta') || parts.includes('cmd')
  const needCtrl = parts.includes('ctrl')
  const needShift = parts.includes('shift')
  const needAlt = parts.includes('alt')

  if (needMeta !== event.metaKey) return false
  if (needCtrl !== event.ctrlKey) return false
  if (needShift !== event.shiftKey) return false
  if (needAlt !== event.altKey) return false

  if (!keyPart) return true
  return normalizeKey(event.key) === keyPart
}

export function useKeyboardShortcut(shortcuts: Shortcut, handler: () => void): void {
  const normalized = Array.isArray(shortcuts) ? shortcuts : [shortcuts]

  const onKeydown = (event: KeyboardEvent) => {
    if (normalized.some((shortcut) => matchShortcut(event, shortcut))) {
      event.preventDefault()
      handler()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeydown)
  })
}
