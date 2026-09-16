/** @param {string} text */
export function slugifyHeading(text) {
  // Preserve existing article fragments when generating IDs during compilation.
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .replace(/--+/g, '-')
    .trim()
}
