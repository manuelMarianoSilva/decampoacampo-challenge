import {
  PAGE_SIZE,
  PERSISTED_PAGE_MAX_AGE_SECONDS,
} from '../utils/constants.js'

export const PERSISTED_PAGE_MAX_AGE_MS = PERSISTED_PAGE_MAX_AGE_SECONDS * 1000

const isStaticIndex = (query) =>
  query?.endpointName === 'getTypeIndex' ||
  query?.endpointName === 'getGenerationIndex'

const isPersistablePage = (query, now) => {
  const args = query?.originalArgs
  const fulfilledTimeStamp = query?.fulfilledTimeStamp

  return (
    query?.endpointName === 'getPokemonsPaginated' &&
    query.status === 'fulfilled' &&
    args?.limit === PAGE_SIZE &&
    Number.isInteger(args.offset) &&
    args.offset >= 0 &&
    Array.isArray(query.data?.results) &&
    Number.isFinite(fulfilledTimeStamp) &&
    now - fulfilledTimeStamp <= PERSISTED_PAGE_MAX_AGE_MS
  )
}

export const filterPersistedQueries = (queries = {}, now = Date.now()) =>
  Object.fromEntries(
    Object.entries(queries).filter(([, query]) =>
      query?.status === 'fulfilled' &&
      (isStaticIndex(query) || isPersistablePage(query, now)),
    ),
  )

export const getCachedPageSnapshot = (queries = {}) => {
  const pagesByOffset = new Map(
    Object.values(queries)
      .filter(
        (query) =>
          query?.endpointName === 'getPokemonsPaginated' &&
          query.status === 'fulfilled' &&
          query.originalArgs?.limit === PAGE_SIZE &&
          Number.isInteger(query.originalArgs.offset) &&
          Array.isArray(query.data?.results),
      )
      .map((query) => [query.originalArgs.offset, query.data]),
  )
  const items = []
  const seenNames = new Set()
  let offset = 0
  let hasMore = true

  while (pagesByOffset.has(offset)) {
    const page = pagesByOffset.get(offset)
    for (const pokemon of page.results) {
      if (!seenNames.has(pokemon.name)) {
        seenNames.add(pokemon.name)
        items.push(pokemon)
      }
    }

    hasMore = Boolean(page.next)
    if (!hasMore) break
    offset += PAGE_SIZE
  }

  return { items, offset, hasMore }
}