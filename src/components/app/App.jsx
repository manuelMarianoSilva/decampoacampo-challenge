import { DetailsView } from '../detailsView/DetailsView.jsx'
import { PokemonList } from '../pokemonList/pokemonList.jsx'
import { FavoritesView } from '../favorites/FavoritesView.jsx'
import { CompareView } from '../compareView/CompareView.jsx'
import { Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import { OnlineIndicator } from '../onlineIndicator/OnlineIndicator.jsx'
import styles from './App.module.css'

const App = () => {
 return (
  <>
  <header className={styles.statusHeader}>
   <OnlineIndicator />
  </header>
   <Routes>
     <Route path="/" element={<PokemonList />}/>
     <Route path="details" element={<DetailsView />} />
     <Route path="favorites" element={<FavoritesView/>} />
    <Route path="compare" element={<CompareView />} />
   </Routes>
   <Toaster />
  </>
 )
}

export default App
