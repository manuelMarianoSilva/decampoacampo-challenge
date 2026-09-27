import { createSlice } from '@reduxjs/toolkit'
import { PAGE_SIZE } from '../utils/constants.js'

const initialState = {
  items: [],
  offset: 0,
  nextOffset: 0,
  hasMore: true,
  cacheHydrated: false,
  scrollTop: 0,
  dataSource: {
    hasCachedData: false,
    hasFreshData: false,
  },
}

const pokemonListSlice = createSlice({
  name: 'pokemonList',
  initialState,
  reducers: {
    pageAppended(state, action) {
      const { results, hasNext, offset } = action.payload
      const seen = new Set(state.items.map((p) => p.name))
      const newOnes = results.filter((p) => !seen.has(p.name))
      state.items.push(...newOnes)
      state.hasMore = hasNext
      state.nextOffset = hasNext
        ? Math.max(state.nextOffset, offset + PAGE_SIZE)
        : offset
    },
    nextPageRequested(state, action) {
      if (state.hasMore && action.payload === state.nextOffset) {
        state.offset = action.payload
      }
    },
    cachedPagesRestored(state, action) {
      const { items, offset, hasMore } = action.payload
      state.items = items
      state.offset = 0
      state.nextOffset = offset
      state.hasMore = hasMore
      state.cacheHydrated = true
      state.dataSource = {
        hasCachedData: items.length > 0,
        hasFreshData: false,
      }
    },
    scrollPositionSaved(state, action) {
      state.scrollTop = action.payload
    },
    dataSourceReset(state, action) {
      state.dataSource = {
        hasCachedData: action.payload,
        hasFreshData: false,
      }
    },
    cachedPageObserved(state) {
      state.dataSource.hasCachedData = true
    },
    freshPageReceived(state) {
      state.dataSource.hasFreshData = true
    },
  },
})

export const {
  pageAppended,
  nextPageRequested,
  cachedPagesRestored,
  scrollPositionSaved,
  dataSourceReset,
  cachedPageObserved,
  freshPageReceived,
} = pokemonListSlice.actions
export default pokemonListSlice.reducer