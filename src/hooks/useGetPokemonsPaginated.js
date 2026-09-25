import { useGetPokemonsPaginatedQuery } from "../services/pokemonApi.js"
import { PAGE_SIZE } from "../utils/constants.js"
import { useState } from "react"

export const useGetPokemonsPaginated = () => {
    const [page, setPage] = useState(0)
      const { data, isLoading, isFetching, error } = useGetPokemonsPaginatedQuery({
        limit: PAGE_SIZE,
        offset: page * PAGE_SIZE,
      })
    return { data, isLoading, isFetching, error }
}