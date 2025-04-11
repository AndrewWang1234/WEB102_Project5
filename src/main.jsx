import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NotFound from './routes/notFound.jsx';
import Layout from './routes/Layout.jsx';
import PokemonDetail from './Components/PokemonDetail.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index={true} path="/" element={<App />} />
          <Route path="*" element={<NotFound />}/>
          <Route path="/pokemon/:pokemonName" element={<PokemonDetail />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
