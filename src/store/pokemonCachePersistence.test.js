import assert from 'node:assert/strict'
import test from 'node:test'
import {
  filterPersistedQueries,
  getCachedPageSnapshot,
  PERSISTED_PAGE_MAX_AGE_MS,
} from './pokemonCachePersistence.js'

const pageQuery = (offset, results, next, fulfilledTimeStamp = 10_000) => ({
  endpointName: 'getPokemonsPaginated',
  originalArgs: { limit: 20, offset },
  fulfilledTimeStamp,
  status: 'fulfilled',
  data: { results, next },
})

test('persists only fulfilled list pages and static indexes', () => {
  const queries = {
    firstPage: pageQuery(0, [{ name: 'bulbasaur' }], 'next'),
    compareCatalog: {
      ...pageQuery(0, [{ name: 'bulbasaur' }], 'next'),
      originalArgs: { limit: 2000, offset: 0 },
    },
    detail: { endpointName: 'getPokemonById', status: 'fulfilled' },
    pendingPage: { ...pageQuery(20, [], null), status: 'pending' },
    types: { endpointName: 'getTypeIndex', status: 'fulfilled' },
    generations: { endpointName: 'getGenerationIndex', status: 'fulfilled' },
  }

  assert.deepEqual(
    Object.keys(filterPersistedQueries(queries, 10_001)).sort(),
    ['firstPage', 'generations', 'types'],
  )
})

test('drops expired list pages but retains static indexes', () => {
  const queries = {
    oldPage: pageQuery(0, [{ name: 'bulbasaur' }], 'next', 1),
    types: { endpointName: 'getTypeIndex', status: 'fulfilled' },
  }

  assert.deepEqual(
    Object.keys(filterPersistedQueries(queries, PERSISTED_PAGE_MAX_AGE_MS + 2)),
    ['types'],
  )
})

test('rebuilds only contiguous pages in offset order without duplicate names', () => {
  const queries = {
    pageTwenty: pageQuery(20, [{ name: 'ivysaur' }], 'next'),
    pageZero: pageQuery(0, [{ name: 'bulbasaur' }, { name: 'ivysaur' }], 'next'),
    pageSixty: pageQuery(60, [{ name: 'venusaur' }], 'next'),
    pageForty: pageQuery(40, [{ name: 'venusaur' }], 'next'),
  }

  assert.deepEqual(getCachedPageSnapshot(queries), {
    items: [{ name: 'bulbasaur' }, { name: 'ivysaur' }, { name: 'venusaur' }],
    offset: 80,
    hasMore: true,
  })
})

test('marks the list complete when the last contiguous page has no next page', () => {
  const snapshot = getCachedPageSnapshot({
    pageZero: pageQuery(0, [{ name: 'bulbasaur' }], null),
  })

  assert.deepEqual(snapshot, {
    items: [{ name: 'bulbasaur' }],
    offset: 0,
    hasMore: false,
  })
})