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

/**
 * 获取分类颜色
 */
export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    工作: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    学习: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    生活: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    购物: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    健康: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    其他: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  }
  return colors[category] || colors['其他']
}
