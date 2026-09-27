import assert from 'node:assert/strict'
import test from 'node:test'
import pokemonListReducer, {
  cachedPagesRestored,
  nextPageRequested,
  pageAppended,
} from './pokemonListSlice.js'

test('restores visited rows while leaving the first cached page active', () => {
  const state = pokemonListReducer(undefined, cachedPagesRestored({
    items: [{ name: 'bulbasaur' }, { name: 'ivysaur' }],
    offset: 40,
    hasMore: true,
  }))

  assert.equal(state.cacheHydrated, true)
  assert.equal(state.offset, 0)
  assert.equal(state.nextOffset, 40)
  assert.equal(state.hasMore, true)
  assert.equal(state.dataSource.hasCachedData, true)
  assert.equal(state.dataSource.hasFreshData, false)
})

test('advances the next offset only after a page is appended', () => {
  let state = pokemonListReducer(undefined, pageAppended({
    results: [{ name: 'bulbasaur' }],
    hasNext: true,
    offset: 0,
  }))
  assert.equal(state.nextOffset, 20)
  assert.equal(state.offset, 0)

  state = pokemonListReducer(state, nextPageRequested(20))
  assert.equal(state.offset, 20)

  state = pokemonListReducer(state, pageAppended({
    results: [{ name: 'ivysaur' }],
    hasNext: false,
    offset: 20,
  }))
  assert.equal(state.nextOffset, 20)
  assert.equal(state.hasMore, false)
  assert.deepEqual(state.items.map(({ name }) => name), ['bulbasaur', 'ivysaur'])
})