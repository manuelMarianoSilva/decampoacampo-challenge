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
import pokemonListReducer from './pokemonListSlice'
import favoritesReducer, { normalizeFavoriteIds } from './favoritesSlice'

const storage = storageImport.default ?? storageImport

const typeIndexCacheTransform = createTransform(
  (queries = {}) =>
    Object.fromEntries(
      Object.entries(queries).filter(
        ([, query]) => query?.endpointName === 'getTypeIndex',
      ),
    ),
  (queries) => queries,
  { whitelist: ['queries'] },
)

const apiPersistConfig = {
  key: 'pokemonApi',
  storage,
  whitelist: ['queries'],
  transforms: [typeIndexCacheTransform],
}

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
  [pokemonApi.reducerPath]: persistReducer(apiPersistConfig, pokemonApi.reducer),
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
    }).concat(pokemonApi.middleware),
})

export const persistor = persistStore(store)