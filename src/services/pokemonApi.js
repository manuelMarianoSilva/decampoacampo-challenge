import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { BASE_URL, TOTAL_TYPES } from '../utils/constants'

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getPokemonsPaginated: builder.query({
      query: ({ limit = 20, offset = 0 } = {}) =>
        `pokemon/?limit=${limit}&offset=${offset}`,
    }),

    getPokemonById: builder.query({
      query: (id) => `${BASE_URL}pokemon/${id}/`,
    }),

    // Fetches all 18 types ONCE, builds a { [pokemonId]: ["fire", "flying"] } map.
    // No matter how many items scroll into view, this never runs more than once per session.
    // real elemental types only; excludes 'unknown'/'shadow' placeholders
    getTypeIndex: builder.query({
      queryFn: async (_arg, _queryApi, _extraOptions, fetchWithBQ) => {
        const typeIds = Array.from({ length: TOTAL_TYPES }, (_, i) => i + 1)

        const results = await Promise.all(
          typeIds.map((id) =>
            fetchWithBQ(`${BASE_URL}type/${id}/`)
          )
        )

        const failed = results.find((r) => r.error)
        if (failed) return { error: failed.error }
        
        const index = {}
        results.forEach(({ data }) => {
          const typeId = data.id
          data.pokemon.forEach(({ pokemon }) => {
            const id = Number(pokemon.url.match(/\/(\d+)\/?$/)[1])
            if (!index[id]) index[id] = []
            index[id].push(typeId)
          })
        })

        return { data: index }
      },
      // Types are static — never garbage-collect this from cache, never refetch.
      keepUnusedDataFor: Infinity,
    }),
  }),
})

export const {
  useGetPokemonsPaginatedQuery,
  useGetPokemonByIdQuery,
  useGetTypeIndexQuery,
} = pokemonApi