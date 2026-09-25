import { useGetPokemonsPaginatedQuery } from '../../services/pokemonApi'
import { useGetPokemonsPaginated } from '../../hooks/useGetPokemonsPaginated.js'
import { ListItem } from '../listItem/listItem'
import styles from './App.module.css'
import { PokemonList } from '../pokemonList/pokemonList'

const App = () => {
 return <PokemonList />
}

export default App
