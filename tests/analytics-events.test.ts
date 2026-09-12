import assert from 'node:assert/strict'
import test from 'node:test'

import { getEngagementEvent } from '../lib/analytics-events'

const origin = 'https://www.modev.me'

test('resume opens recognize local PDF links, including query strings, without counting external files', () => {
  assert.equal(
    getEngagementEvent('/resume.pdf?download=1', origin)?.name,
    'resume_open',
  )
  assert.equal(
    getEngagementEvent('https://example.com/resume.pdf', origin),
    null,
  )
})

test('email engagement records the action without the address or message contents', () => {
  assert.deepEqual(
    getEngagementEvent('mailto:someone@example.com?subject=Private', origin),
    {
      name: 'contact_click',
      parameters: { contact_method: 'email' },
    },
  )
})

test('project clicks distinguish source, case studies, articles, and demo links', () => {
  for (const type of ['source', 'case_study', 'article', 'demo']) {
    const event = getEngagementEvent(
      '/projects/simukernel#scheduler',
      origin,
      'SimuKernel',
      type,
    )
    assert.deepEqual(event, {
      name: 'project_click',
      parameters: { project_name: 'SimuKernel', link_type: type },
    })
  }
  assert.equal(getEngagementEvent('/projects', origin), null)
  assert.equal(
    getEngagementEvent('/projects', origin, 'SimuKernel', 'unknown'),
    null,
  )
})

test('malformed links cannot interrupt a navigation click handler', () => {
  assert.equal(getEngagementEvent('http://', origin), null)
})
