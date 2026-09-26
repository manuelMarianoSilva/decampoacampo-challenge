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
import { pokemonApi } from '../services/pokemonApi'
import storageImport from 'redux-persist/lib/storage'

const storage = storageImport.default ?? storageImport

// Strip transient, session-only data before persisting the API slice.
// "subscriptions" tracks currently-mounted component listeners — meaningless
// after a refresh, since those components no longer exist.
const apiPersistConfig = {
  key: 'pokemonApi',
  storage,
  blacklist: ['subscriptions'],
}

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: persistReducer(apiPersistConfig, pokemonApi.reducer),
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // redux-persist dispatches non-serializable action payloads internally;
      // this tells RTK's serializability check to ignore just those action types
      // rather than disabling the check entirely.
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(pokemonApi.middleware),
})

export const persistor = persistStore(store)