import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  offset: 0,
  hasMore: true,
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
      const { results, hasNext } = action.payload
      const seen = new Set(state.items.map((p) => p.name))
      const newOnes = results.filter((p) => !seen.has(p.name))
      state.items.push(...newOnes)
      state.hasMore = hasNext
    },
    nextPageRequested(state, action) {
      state.offset += action.payload // PAGE_SIZE
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
  scrollPositionSaved,
  dataSourceReset,
  cachedPageObserved,
  freshPageReceived,
} = pokemonListSlice.actions
export default pokemonListSlice.reducer