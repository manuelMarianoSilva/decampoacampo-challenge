import { useGetPokemonsPaginated } from "../../hooks/useGetPokemonsPaginated"
import { ListItem } from "../listItem/listItem"

export const PokemonList = () => {
    const { data, isLoading, isFetching, error } = useGetPokemonsPaginated()
    
      if (isLoading && isFetching) {
        return <>Loading...</>
      }
    
      if (error) {
        return <>Something really bad happened</>
      }    
    
      return (
        <div>
          {data && data.results.map((pokemon) => {
            return <ListItem pokemon={pokemon}/>
          })}
        </div>
      )
}