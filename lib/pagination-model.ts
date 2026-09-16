export function paginationWork(
  page: number,
  pageSize: number,
  totalRows: number,
) {
  if (
    ![page, pageSize, totalRows].every(Number.isSafeInteger) ||
    pageSize < 1 ||
    totalRows < 1
  ) {
    throw new RangeError(
      'Pagination requires integer values and positive page and dataset sizes.',
    )
  }
  const totalPages = Math.ceil(totalRows / pageSize)
  const currentPage = Math.max(1, Math.min(page, totalPages))
  const offset = (currentPage - 1) * pageSize
  const returned = Math.min(pageSize, totalRows - offset)
  return {
    page: currentPage,
    totalPages,
    offset,
    returned,
    offsetReads: offset + returned,
    cursorReads: returned,
    first: offset + 1,
    last: offset + returned,
  }
}
