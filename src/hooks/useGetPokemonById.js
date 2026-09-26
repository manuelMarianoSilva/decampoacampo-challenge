import { useGetPokemonByIdQuery } from "../services/pokemonApi"

export const useGetPokemonById = (id) => {
    const { data, isLoading, isFetching, error, refetch } = useGetPokemonByIdQuery(id)
    return { data, isLoading, isFetching, error, refetch }
}