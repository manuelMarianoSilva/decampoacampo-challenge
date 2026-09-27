import { DetailsView } from '../detailsView/DetailsView.jsx'
import { PokemonList } from '../pokemonList/pokemonList.jsx'
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
