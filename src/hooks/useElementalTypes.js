import { useGetTypeIndexQuery } from "../services/pokemonApi"

export const useElementalTypes = () => {
    const { data: allTypes, isLoading, error } = useGetTypeIndexQuery()    
    return { allTypes, isLoading, error }
}