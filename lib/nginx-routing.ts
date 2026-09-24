export interface NginxLocation {
  id: string
  modifier: '=' | '^~' | '~' | '~*' | ''
  pattern: string
  label: string
}

export function nginxLocations(protectAssets = true): NginxLocation[] {
  return [
    { id: 'health', modifier: '=', pattern: '/health', label: 'Health check' },
    {
      id: 'assets',
      modifier: protectAssets ? '^~' : '',
      pattern: '/assets/',
      label: 'Asset directory',
    },
    { id: 'api', modifier: '', pattern: '/api/', label: 'API prefix' },
    {
      id: 'versioned-api',
      modifier: '~',
      pattern: '^/api/v[0-9]+/',
      label: 'Versioned API regex',
    },
    {
      id: 'static',
      modifier: '~*',
      pattern: '\\.(css|js|png|jpg|svg)$',
      label: 'Static file regex',
    },
    { id: 'fallback', modifier: '', pattern: '/', label: 'Site fallback' },
  ]
}

export function normalizedRequestPath(input: string): string {
  const value = input.trim()
  if (!value || value.length > 2048 || /[\u0000-\u0020\\]/.test(value))
    throw new Error('Enter a path or HTTP URL without spaces or backslashes.')
  let path: string
  if (value.startsWith('/')) path = value.split(/[?#]/, 1)[0]
  else {
    let url: URL
    try {
      url = new URL(value)
    } catch {
      throw new Error('Start a path with /, or enter a complete HTTP URL.')
    }
    if (!['http:', 'https:'].includes(url.protocol))
      throw new Error('Use an http:// or https:// URL.')
    path = url.pathname
  }
  let decoded: string
  try {
    decoded = decodeURIComponent(path)
  } catch {
    throw new Error(
      'The path contains an invalid percent escape or UTF-8 sequence.',
    )
  }
  if (/[\u0000-\u001f\u007f\\]/.test(decoded))
    throw new Error(
      'The decoded path contains an unsupported control character or backslash.',
    )
  const parts: string[] = []
  for (const part of decoded.split('/')) {
    if (part === '..') {
      if (!parts.length) throw new Error('The path goes above the server root.')
      parts.pop()
    } else if (part && part !== '.') parts.push(part)
  }
  const trailingSlash = /\/(?:\.|\.\.)?$/.test(decoded)
  return `/${parts.join('/')}${parts.length && trailingSlash ? '/' : ''}`
}

export interface NginxMatch {
  path: string
  winner: NginxLocation
  trace: { label: string; detail: string }[]
}

/** The fixed playground models flat locations on a case-sensitive filesystem. */
export function matchNginxLocation(
  input: string,
  protectAssets = true,
): NginxMatch {
  const path = normalizedRequestPath(input)
  const rules = nginxLocations(protectAssets)
  const trace: NginxMatch['trace'] = [
    {
      label: 'Normalize the path',
      detail: `${path} — query parameters and fragments do not select a location.`,
    },
  ]
  const exact = rules.find(
    (rule) => rule.modifier === '=' && rule.pattern === path,
  )
  if (exact) {
    trace.push({
      label: 'Exact match',
      detail: `= ${exact.pattern} matches. Stop here.`,
    })
    return { path, winner: exact, trace }
  }
  trace.push({ label: 'Check exact locations', detail: 'No exact match.' })
  const prefix = rules
    .filter(
      (rule) =>
        ['', '^~'].includes(rule.modifier) && path.startsWith(rule.pattern),
    )
    .sort((a, b) => b.pattern.length - a.pattern.length)[0]
  trace.push({ label: 'Remember the longest prefix', detail: prefix.pattern })
  if (prefix.modifier === '^~') {
    trace.push({
      label: 'Skip regular expressions',
      detail: 'The longest prefix uses ^~. It wins immediately.',
    })
    return { path, winner: prefix, trace }
  }
  for (const rule of rules.filter((rule) =>
    ['~', '~*'].includes(rule.modifier),
  )) {
    const matches = new RegExp(
      rule.pattern,
      rule.modifier === '~*' ? 'i' : '',
    ).test(path)
    trace.push({
      label: `Test ${rule.modifier} ${rule.pattern}`,
      detail: matches
        ? 'Matches. This is the first matching regex, so stop here.'
        : 'No match. Continue in declaration order.',
    })
    if (matches) return { path, winner: rule, trace }
  }
  trace.push({
    label: 'Use the remembered prefix',
    detail: `${prefix.pattern} wins because no regex matched.`,
  })
  return { path, winner: prefix, trace }
}
