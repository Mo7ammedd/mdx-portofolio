import {
  ANSWER_MAX_LENGTH,
  isAskTopic,
  QUESTION_MAX_LENGTH,
  QUESTION_MIN_LENGTH,
  type AskTopic,
} from './types'

export class AskError extends Error {
  constructor(
    message: string,
    public status = 400,
    public retryAfter?: number,
  ) {
    super(message)
  }
}

function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new AskError('Please check the form and try again.')
  }
  return value as Record<string, unknown>
}

export function validateQuestion(value: unknown) {
  const data = object(value)
  if (data.website !== undefined && data.website !== '') {
    throw new AskError('Unable to send this question.')
  }
  const question = typeof data.question === 'string' ? data.question.trim() : ''
  if (
    question.length < QUESTION_MIN_LENGTH ||
    question.length > QUESTION_MAX_LENGTH
  ) {
    throw new AskError(
      `Your question needs to be between ${QUESTION_MIN_LENGTH} and ${QUESTION_MAX_LENGTH} characters.`,
    )
  }
  if (!isAskTopic(data.topic))
    throw new AskError('Please choose a valid topic.')
  return { question, topic: data.topic }
}

export type QuestionUpdate =
  | { action: 'publish'; answer: string; topic: AskTopic }
  | { action: 'archive' | 'restore' }

export function validateUpdate(value: unknown): QuestionUpdate {
  const data = object(value)
  if (data.action === 'archive' || data.action === 'restore') {
    return { action: data.action }
  }
  if (data.action !== 'publish') throw new AskError('Unknown inbox action.')
  const answer = typeof data.answer === 'string' ? data.answer.trim() : ''
  if (answer.length < 1 || answer.length > ANSWER_MAX_LENGTH) {
    throw new AskError(
      `Write an answer of up to ${ANSWER_MAX_LENGTH} characters.`,
    )
  }
  if (!isAskTopic(data.topic))
    throw new AskError('Please choose a valid topic.')
  return { action: 'publish', answer, topic: data.topic }
}

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ? email
    : null
}

export type AdminCredentials = { email: string; password: string }

export function validateCredentials(value: unknown): AdminCredentials {
  const data = object(value)
  const email = normalizeEmail(data.email)
  if (
    !email ||
    typeof data.password !== 'string' ||
    !data.password.length ||
    data.password.length > 256
  ) {
    throw new AskError('Please enter a valid email address and password.')
  }
  return { email, password: data.password }
}

export function validateQuestionId(id: string) {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
      id,
    )
  ) {
    throw new AskError('Question not found.', 404)
  }
}
