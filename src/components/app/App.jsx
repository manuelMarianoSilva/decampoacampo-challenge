import { DetailsView } from '../detailsView/DetailsView.jsx'
import { PokemonList } from '../pokemonList/pokemonList.jsx'
import { FavoritesView } from '../favorites/FavoritesView.jsx'
import { Route, Routes } from 'react-router'
import { Toaster } from 'sonner'

const App = () => {
 return (
  <>
   <Routes>
     <Route path="/" element={<PokemonList />}/>
     <Route path="details" element={<DetailsView />} />
     <Route path="favorites" element={<FavoritesView/>} />
   </Routes>
   <Toaster />
  </>
 )
}

export default App
