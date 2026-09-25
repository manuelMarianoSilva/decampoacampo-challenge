import { useGetPokemonByIdQuery } from "../services/pokemonApi"

export const useGetPokemonById = (id) => {
    const { data, isLoading, isFetching, error } = useGetPokemonByIdQuery(id)
    return { data, isLoading, isFetching, error }
}