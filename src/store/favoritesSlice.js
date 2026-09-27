import { createSlice } from '@reduxjs/toolkit'

export const MAX_FAVORITES = 6

const initialState = {
  ids: [],
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoriteToggled(state, action) {
      const pokemonId = String(action.payload)
      const favoriteIndex = state.ids.indexOf(pokemonId)

      if (favoriteIndex === -1) {
        if (state.ids.length < MAX_FAVORITES) {
          state.ids.push(pokemonId)
        }
      } else {
        state.ids.splice(favoriteIndex, 1)
      }
    },
  },
})

export const { favoriteToggled } = favoritesSlice.actions
export default favoritesSlice.reducer