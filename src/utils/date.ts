import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import isToday from 'dayjs/plugin/isToday'
import isTomorrow from 'dayjs/plugin/isTomorrow'
import isYesterday from 'dayjs/plugin/isYesterday'

dayjs.extend(relativeTime)
dayjs.extend(isToday)
dayjs.extend(isTomorrow)
dayjs.extend(isYesterday)

export { dayjs }

/**
 * 格式化日期时间
 */
export function formatDateTime(date: string | Date, format = 'YYYY-MM-DD HH:mm'): string {
  return dayjs(date).format(format)
}

/**
 * 格式化日期
 */
export function formatDate(date: string | Date, format = 'YYYY-MM-DD'): string {
  return dayjs(date).format(format)
}

/**
 * 获取相对时间描述
 */
export function getRelativeTime(date: string | Date): string {
  const d = dayjs(date)
  if (d.isToday()) return '今天'
  if (d.isTomorrow()) return '明天'
  if (d.isYesterday()) return '昨天'
  return d.fromNow()
}

/**
 * 判断是否逾期
 */
export function isOverdue(date: string | Date): boolean {
  return dayjs(date).isBefore(dayjs(), 'day')
}

/**
 * 判断是否即将到期（今天或明天）
 */
export function isDueSoon(date: string | Date): boolean {
  const d = dayjs(date)
  return d.isToday() || d.isTomorrow()
}

/**
 * 获取日期时间输入框的值（用于datetime-local）
 */
export function getDateTimeInputValue(date: string | Date): string {
  return dayjs(date).format('YYYY-MM-DDTHH:mm')
}
