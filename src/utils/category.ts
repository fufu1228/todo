import type { LLMPref } from '@/types/task'
import { classifyWithLLM } from '@/utils/llm'

/**
 * 基于关键词自动分类（原有逻辑）
 */
export function autoCategorizeByKeywords(
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
 * 基于用户偏好优化分类
 * 如果用户曾手动修改过类似任务的分类，则优先使用用户的偏好
 */
export function categorizeByUserPrefs(
  title: string,
  description: string | undefined,
  prefs: LLMPref[]
): string | null {
  const text = `${title} ${description || ''}`.toLowerCase()

  // 查找最匹配的偏好记录
  let bestMatch: LLMPref | null = null
  let bestScore = 0

  for (const pref of prefs) {
    if (!pref.userCorrectedCategory) continue

    const prefText = pref.text.toLowerCase()
    // 计算文本重叠度
    const words = prefText.split(/\s+/)
    const matchCount = words.filter(w => text.includes(w) || prefText.includes(w)).length
    const score = matchCount / Math.max(words.length, 1)

    if (score > bestScore && score > 0.3) {
      bestScore = score
      bestMatch = pref
    }
  }

  return bestMatch?.userCorrectedCategory || null
}

/**
 * 自动分类：优先使用用户偏好，其次 LLM，最后关键词
 */
export async function autoCategorize(
  title: string,
  description: string | undefined,
  categoryRules: Record<string, string[]>,
  categories: string[],
  llmEnabled: boolean,
  apiKey: string,
  prefs: LLMPref[]
): Promise<string> {
  // 1. 优先匹配用户偏好
  const prefCategory = categorizeByUserPrefs(title, description, prefs)
  if (prefCategory) return prefCategory

  // 2. 如果启用了 LLM，使用 LLM 分类
  if (llmEnabled && apiKey) {
    const text = `${title} ${description || ''}`
    const llmCategory = await classifyWithLLM(text, categories, apiKey)
    if (llmCategory && categories.includes(llmCategory)) {
      return llmCategory
    }
  }

  // 3. 降级到关键词分类
  return autoCategorizeByKeywords(title, description, categoryRules)
}

/**
 * 保存用户分类修正偏好
 */
export function saveCategoryCorrection(
  prefs: LLMPref[],
  text: string,
  predictedCategory: string,
  correctedCategory: string
): LLMPref[] {
  const newPref: LLMPref = {
    text,
    predictedCategory,
    userCorrectedCategory: correctedCategory,
    learnedKeywords: text
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 1),
  }

  // 最多保留 100 条偏好记录
  const updated = [...prefs, newPref].slice(-100)
  return updated
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
