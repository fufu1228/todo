import { ref } from 'vue'

interface GestureState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  deltaX: number
  deltaY: number
}

/**
 * 移动端手势操作组合函数
 */
export function useGesture(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) {
  const gestureState = ref<GestureState | null>(null)
  const isDragging = ref(false)

  function handleTouchStart(e: TouchEvent) {
    const touch = e.touches[0]
    gestureState.value = {
      startX: touch.clientX,
      startY: touch.clientY,
      currentX: touch.clientX,
      currentY: touch.clientY,
      deltaX: 0,
      deltaY: 0,
    }
    isDragging.value = true
  }

  function handleTouchMove(e: TouchEvent) {
    if (!gestureState.value) return

    const touch = e.touches[0]
    gestureState.value.currentX = touch.clientX
    gestureState.value.currentY = touch.clientY
    gestureState.value.deltaX = touch.clientX - gestureState.value.startX
    gestureState.value.deltaY = touch.clientY - gestureState.value.startY
  }

  function handleTouchEnd() {
    if (!gestureState.value) return

    const { deltaX, deltaY } = gestureState.value

    // 判断是否为水平滑动（水平位移大于垂直位移）
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && onSwipeRight) {
        // 右滑
        onSwipeRight()
      } else if (deltaX < 0 && onSwipeLeft) {
        // 左滑
        onSwipeLeft()
      }
    }

    gestureState.value = null
    isDragging.value = false
  }

  return {
    gestureState,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
