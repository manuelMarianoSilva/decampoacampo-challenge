import { useGetGenerationIndexQuery } from "../services/pokemonApi"

export const useGetGenerations = ({ skip = false } = {}) => {
  const { data: generations, isLoading, isFetching, error, refetch } =
    useGetGenerationIndexQuery(undefined, { skip })
  return { generations, isLoading, isFetching, error, refetch }
}