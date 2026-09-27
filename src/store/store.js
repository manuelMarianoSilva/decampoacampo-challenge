import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
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

const storage = storageImport.default ?? storageImport

const apiPersistConfig = {
  key: 'pokemonApi',
  storage,
  blacklist: ['subscriptions'],
}

const listPersistConfig = {
  key: 'pokemonList',
  storage,
}

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: persistReducer(apiPersistConfig, pokemonApi.reducer),
  pokemonList: persistReducer(listPersistConfig, pokemonListReducer),
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