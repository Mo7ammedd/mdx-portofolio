export class AskRequestError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function askRequest<T>(
  url: string,
  init: RequestInit = {},
): Promise<T> {
  const response = await fetch(url, {
    ...init,
    cache: 'no-store',
    credentials: 'same-origin',
    signal: AbortSignal.timeout(20_000),
    headers: { 'Content-Type': 'application/json', ...init.headers },
  })
  const data = await response.json()
  if (!response.ok) {
    throw new AskRequestError(
      data.error || 'Please try again shortly.',
      response.status,
    )
  }
  return data as T
}

export function requestError(error: unknown) {
  return error instanceof AskRequestError
    ? error.message
    : 'Couldn’t connect. Your text is still here; please try again.'
}

export function questionDate(date: string) {
  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date))
}
