import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PokemonTile from './Components/PokemonTile';

function App() {
  const [list, setList] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [stats, setStats] = useState({totalCount: 0, averageHeight: 0, mostCommonType: ''});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState([]);

  useEffect(() => {
    const fetchGenOne = async () => {
      const response = await fetch ("https://pokeapi.co/api/v2/pokemon?limit=151");
      const json = await response.json();
      setList(json.results);

      const specifcPokemon = await Promise.all(json.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return pokemonData;
      }));
      setPokemons(specifcPokemon);
      setFilteredPokemons(specifcPokemon);
      calculateStats(specifcPokemon);
    
    };
    fetchGenOne().catch(console.error);
  }, []);
  
  useEffect(() => {
    if (pokemons.length > 0) {
      const allTypes = [...new Set(pokemons.flatMap(pokemon => pokemon.types.map(type => type.type.name)))];
      setTypes(allTypes); // Set the list of types after pokemons are fetched
    }
  }, [pokemons]);

  const calculateStats = (pokemons) => {
    const totalCount = pokemons.length;
    const averageHeight = (pokemons.reduce((sum, pokemon) => sum + pokemon.height, 0)) / totalCount;

    const typeCounts = pokemons.reduce((counts, pokemon) => {
      const type = pokemon.types[0].type.name;
      counts[type] = (counts[type] || 1) + 1;
      return counts;
    }, {});

    const mostCommonType = Object.entries(typeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    setStats({ totalCount, averageHeight, mostCommonType});

  };

  const searchItems = (term) => {
    setSearchTerm(term);
    //const filtered = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(term.toLowerCase()));
    //setFilteredPokemons(filtered);
    filterPokemons(term, selectedType);
  }

  const filterPokemons = (searchTerm, selectedType) => {
    let filtered = pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()));

    if(selectedType) {
      filtered = filtered.filter(pokemon => pokemon.types.some(type => type.type.name === selectedType));
    }

    setFilteredPokemons(filtered);
  };


  const handleTypeChange = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    filterPokemons(searchTerm, type); 
  };

  return (
    <div>
      <h1>Pokemon list</h1>
      <h5>Total Pokemon: {stats.totalCount}</h5>
      <h5>Average Height: {stats.averageHeight.toFixed(2)}</h5>
      <h5>Most Common Type: {stats.mostCommonType}</h5>
      <input type='text' placeholder='Type Pokemon Name' value={searchTerm} onChange={(e) => searchItems(e.target.value)}/>
      
      <select value={selectedType} onChange={handleTypeChange}>
        <option value="">Filter by Type</option>
        {types.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
      
      <ul>
        {filteredPokemons.length > 0 ? ( 
          filteredPokemons.map((pokemon) => (
            <li key={pokemon.id}>
              <PokemonTile name={pokemon.name} image={pokemon.sprites.other['official-artwork'].front_default} type={pokemon.types[0].type.name}/>
            </li>
          ))
        ) : (<p>Loading...</p>)
      }
      </ul>
    </div>
  )
}

export default App
