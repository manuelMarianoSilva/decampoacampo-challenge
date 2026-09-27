import { createStore, get, set } from 'idb-keyval'
import { filterPersistedQueries } from './pokemonCachePersistence.js'

const database = createStore('decampoacampo-api-cache', 'queries')
const cacheKey = 'pokemon-api-queries'
const legacyCacheKey = 'persist:pokemonApi'

const readLegacyQueries = () => {
  try {
    const serializedState = globalThis.localStorage?.getItem(legacyCacheKey)
    if (!serializedState) return null

    const persistedState = JSON.parse(serializedState)
    const queries = persistedState.queries
    return typeof queries === 'string' ? JSON.parse(queries) : queries
  } catch {
    return null
  }
}

const readFallbackQueries = () => {
  try {
    const serializedQueries = globalThis.localStorage?.getItem(cacheKey)
    return serializedQueries ? JSON.parse(serializedQueries) : null
  } catch {
    return null
  }
}

export const loadPersistedPokemonQueries = async () => {
  try {
    const cachedQueries = await get(cacheKey, database)
    if (cachedQueries) return filterPersistedQueries(cachedQueries)
  } catch {
    return filterPersistedQueries(readFallbackQueries() ?? readLegacyQueries() ?? {})
  }

  const legacyQueries = readFallbackQueries() ?? readLegacyQueries()
  if (!legacyQueries) return {}

  const filteredQueries = filterPersistedQueries(legacyQueries)
  try {
    await set(cacheKey, filteredQueries, database)
    globalThis.localStorage?.removeItem(legacyCacheKey)
  } catch {
    return filteredQueries
  }

  return filteredQueries
}

export const persistPokemonQueries = async (queries) => {
  const filteredQueries = filterPersistedQueries(queries)
  try {
    await set(cacheKey, filteredQueries, database)
  } catch {
    try {
      globalThis.localStorage?.setItem(cacheKey, JSON.stringify(filteredQueries))
    } catch {
      return false
    }
  }

  return true
}