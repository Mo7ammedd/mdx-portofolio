export const ASK_TOPICS = [
  { value: 'general', label: 'General' },
  { value: 'backend', label: 'Backend' },
  { value: 'dotnet', label: '.NET' },
  { value: 'databases', label: 'Databases' },
  { value: 'career', label: 'Career' },
] as const

export type AskTopic = (typeof ASK_TOPICS)[number]['value']
export type QuestionStatus = 'pending' | 'answered' | 'archived'

export type Question = {
  id: string
  question: string
  topic: AskTopic
  answer: string | null
  status: QuestionStatus
  createdAt: string
  answeredAt: string | null
  updatedAt: string
}

export type PublicQuestion = Pick<Question, 'id' | 'question' | 'topic'> & {
  answer: string
  answeredAt: string
}

export const QUESTION_MIN_LENGTH = 15
export const QUESTION_MAX_LENGTH = 1000
export const ANSWER_MAX_LENGTH = 8000

export const ASK_URL = 'https://ask.modev.me'

export function topicLabel(topic: AskTopic) {
  return ASK_TOPICS.find((item) => item.value === topic)!.label
}

export function isAskTopic(value: unknown): value is AskTopic {
  return ASK_TOPICS.some((topic) => topic.value === value)
}

export function publicQuestion(question: Question): PublicQuestion | null {
  if (
    question.status !== 'answered' ||
    !question.answer ||
    !question.answeredAt
  ) {
    return null
  }
  return {
    id: question.id,
    question: question.question,
    topic: question.topic,
    answer: question.answer,
    answeredAt: question.answeredAt,
  }
}

export function filterAnswers(
  questions: PublicQuestion[],
  query: string,
  topic: AskTopic | 'all',
) {
  const terms = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean)
  return questions.filter((question) => {
    if (topic !== 'all' && question.topic !== topic) return false
    const text =
      `${question.question} ${question.answer} ${topicLabel(question.topic)}`.toLocaleLowerCase()
    return terms.every((term) => text.includes(term))
  })
}
