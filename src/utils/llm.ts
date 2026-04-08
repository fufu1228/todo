import axios from 'axios'

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'

/**
 * 调用 DeepSeek 免费 API 进行语义分类
 * 返回分类结果：工作/学习/生活/其他
 */
export async function classifyWithLLM(
  text: string,
  categories: string[],
  apiKey: string,
  model = 'deepseek-chat'
): Promise<string> {
  if (!apiKey) return ''

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model,
        messages: [
          {
            role: 'system',
            content: `你是一个任务分类助手。请将用户输入的任务内容分类到以下类别之一：${categories.join('、')}。只返回分类名称，不要返回其他内容。`,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.3,
        max_tokens: 20,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        timeout: 10000,
      }
    )

    const result = response.data.choices?.[0]?.message?.content?.trim() || ''
    // 匹配最接近的分类
    const matched = categories.find(c => result.includes(c))
    return matched || result || '其他'
  } catch (error) {
    console.error('LLM 分类失败:', error)
    return ''
  }
}

/**
 * 批量分类（用于已有任务重新分类）
 */
export async function batchClassifyWithLLM(
  tasks: Array<{ id: string; text: string }>,
  categories: string[],
  apiKey: string,
  model = 'deepseek-chat'
): Promise<Record<string, string>> {
  const results: Record<string, string> = {}

  // 串行请求避免速率限制
  for (const task of tasks) {
    const category = await classifyWithLLM(task.text, categories, apiKey, model)
    if (category) {
      results[task.id] = category
    }
    // 请求间隔避免限流
    await new Promise(resolve => setTimeout(resolve, 200))
  }

  return results
}
