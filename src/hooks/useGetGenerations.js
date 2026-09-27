import { useGetGenerationIndexQuery } from "../services/pokemonApi"

export const useGetGenerations = () => {
  const { data: generations, isLoading, isFetching, error, refetch } = useGetGenerationIndexQuery()
  return { generations, isLoading, isFetching, error, refetch }
}