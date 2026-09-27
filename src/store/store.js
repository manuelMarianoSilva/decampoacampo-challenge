import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  createTransform,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storageImport from 'redux-persist/lib/storage'
import { pokemonApi } from '../services/pokemonApi'
import { apiCacheRehydrated } from './apiCacheActions.js'
import {
  loadPersistedPokemonQueries,
  persistPokemonQueries,
} from './indexedDbStorage.js'
import { getCachedPageSnapshot } from './pokemonCachePersistence.js'
import pokemonListReducer, { cachedPagesRestored } from './pokemonListSlice'
import favoritesReducer, { normalizeFavoriteIds } from './favoritesSlice'

const storage = storageImport.default ?? storageImport

const listPersistConfig = {
  key: 'pokemonList',
  storage,
  whitelist: ['scrollTop'],
}

const favoriteIdsLimitTransform = createTransform(
  (ids) => normalizeFavoriteIds(ids),
  (ids) => normalizeFavoriteIds(ids),
  { whitelist: ['ids'] },
)

const favoritesPersistConfig = {
  key: 'favorites',
  storage,
  whitelist: ['ids'],
  transforms: [favoriteIdsLimitTransform],
}

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  pokemonList: persistReducer(listPersistConfig, pokemonListReducer),
  favorites: persistReducer(favoritesPersistConfig, favoritesReducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(persistCacheOnQueryFulfillment, pokemonApi.middleware),
})

export const persistor = persistStore(store)

let pendingCacheWrite
function persistCacheOnQueryFulfillment({ getState }) {
  return (next) => (action) => {
    const result = next(action)
    const shouldPersist = [
      pokemonApi.endpoints.getPokemonsPaginated,
      pokemonApi.endpoints.getTypeIndex,
      pokemonApi.endpoints.getGenerationIndex,
    ].some((endpoint) => endpoint.matchFulfilled(action))

    if (shouldPersist) {
      clearTimeout(pendingCacheWrite)
      pendingCacheWrite = setTimeout(() => {
        const queries = getState()[pokemonApi.reducerPath].queries
        void persistPokemonQueries(queries)
      }, 750)
    }

    return result
  }
}

void loadPersistedPokemonQueries()
  .catch(() => ({}))
  .then((queries) => {
    store.dispatch(apiCacheRehydrated({
      queries,
      mutations: {},
      provided: { tags: {} },
    }))
    store.dispatch(cachedPagesRestored(getCachedPageSnapshot(queries)))
  })