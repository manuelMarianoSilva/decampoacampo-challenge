import { useGetPokemonsPaginatedQuery } from '../../services/pokemonApi'
import { useGetPokemonsPaginated } from '../../hooks/useGetPokemonsPaginated.js'
import { ListItem } from '../listItem/ListItem'
import { PokemonList } from '../pokemonList/PokemonList'
import styles from './App.module.css'
import { Route, Routes } from 'react-router'

const App = () => {
 return (
  <Routes>
    <Route path="/" element={<PokemonList />}/>
    <Route path="soconcho" element={<>Welcome to Soconcho</>} />
  </Routes>
 )
}

export default App
