import { useGetPokemonsPaginated } from '../../hooks/useGetPokemonsPaginated.js'
import { DetailsView } from '../detailsView/DetailsView.jsx'
import { PokemonList } from '../pokemonList/pokemonList'
import styles from './App.module.css'
import { Route, Routes } from 'react-router'

const App = () => {
 return (
  <Routes>
    <Route path="/" element={<PokemonList />}/>
    <Route path="details" element={<DetailsView />} />
  </Routes>
 )
}

export default App
