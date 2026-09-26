import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  offset: 0,
  hasMore: true,
  scrollTop: 0,
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
  },
})

export const { pageAppended, nextPageRequested, scrollPositionSaved } =
  pokemonListSlice.actions
export default pokemonListSlice.reducer