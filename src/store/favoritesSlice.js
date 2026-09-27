import { createSlice } from '@reduxjs/toolkit'

export const MAX_FAVORITES = 6

export const normalizeFavoriteIds = (ids = []) => {
  const slots = Array(MAX_FAVORITES).fill(null)
  if (!Array.isArray(ids)) return slots

  if (ids.length === MAX_FAVORITES) {
    return ids.map((id) => (id == null ? null : String(id)))
  }

  let nextSlot = 0
  for (const id of ids) {
    if (id != null && nextSlot < MAX_FAVORITES) {
      slots[nextSlot] = String(id)
      nextSlot += 1
    }
  }

  return slots
}

const initialState = {
  ids: Array(MAX_FAVORITES).fill(null),
}

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    favoriteToggled(state, action) {
      if (!Array.isArray(state.ids) || state.ids.length !== MAX_FAVORITES) {
        state.ids = normalizeFavoriteIds(state.ids)
      }

      const pokemonId = String(action.payload)
      const favoriteIndex = state.ids.indexOf(pokemonId)

      if (favoriteIndex === -1) {
        const emptySlot = state.ids.indexOf(null)
        if (emptySlot !== -1) {
          state.ids[emptySlot] = pokemonId
        }
      } else {
        state.ids[favoriteIndex] = null
      }
    },
    favoriteMoved(state, action) {
      if (!Array.isArray(state.ids) || state.ids.length !== MAX_FAVORITES) {
        state.ids = normalizeFavoriteIds(state.ids)
      }

      const { pokemonId, targetSlot } = action.payload
      const sourceSlot = state.ids.indexOf(String(pokemonId))
      if (
        sourceSlot === -1 ||
        !Number.isInteger(targetSlot) ||
        targetSlot < 0 ||
        targetSlot >= MAX_FAVORITES ||
        state.ids[targetSlot] !== null
      ) {
        return
      }

      state.ids[targetSlot] = state.ids[sourceSlot]
      state.ids[sourceSlot] = null
    },
  },
})

export const { favoriteToggled, favoriteMoved } = favoritesSlice.actions
export default favoritesSlice.reducer