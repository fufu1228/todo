/**
 * 基于关键词自动分类任务
 */
export function autoCategorize(
  title: string,
  description: string | undefined,
  categoryRules: Record<string, string[]>
): string {
  const text = `${title} ${description || ''}`.toLowerCase()
  let maxScore = 0
  let category = '其他'

  Object.entries(categoryRules).forEach(([cat, keywords]) => {
    const score = keywords.reduce((sum, keyword) => {
      return sum + (text.includes(keyword.toLowerCase()) ? 1 : 0)
    }, 0)

    if (score > maxScore) {
      maxScore = score
      category = cat
    }
  })

  return category
}

function hashToIndex(text: string, modulo: number): number {
  let hash = 0
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash) % modulo
}

/**
 * 获取分类颜色
 */
export function getCategoryColor(
  category: string,
  categoryColors?: Record<string, string>
): string {
  const fallback = 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  if (categoryColors?.[category]) return categoryColors[category]

  const palette = [
    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
    'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
    'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  ]

  if (!category) return fallback
  return palette[hashToIndex(category, palette.length)] || fallback
}
