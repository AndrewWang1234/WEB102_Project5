import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PokemonTile from './Components/PokemonTile';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import GraphBox from './Components/GraphBox';

function App() {
  const [list, setList] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [stats, setStats] = useState({totalCount: 0, averageHeight: 0, mostCommonType: ''});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [types, setTypes] = useState([]);
  const [typeDistribution, setTypeDistribution] = useState([]);
  const [pokemonHealthData, setPokemonHealthData] = useState([]);

  const typeColors = {
    normal: "#b7b8aa",
    fire: "#ff6e52",
    water: "#489ffd",
    electric: "#fbcd31",
    grass: "#71c946",
    ice: "#68ccfe",
    fighting: "#d3897a",
    poison: "#c88ab3",
    ground: "#debb50",
    flying: "#8799ff",
    psychic: "#fe66a3",
    bug: "#aabc23",
    rock: "#baaa67",
    ghost: "#9996cd",
    dragon: "#9e93ed",
    dark: "#b49781",
    steel: "#aba9bc",
    fairy: "#ed99ee"
  };


  useEffect(() => {
    const fetchGenOne = async () => {
      const response = await fetch ("https://pokeapi.co/api/v2/pokemon?limit=151");
      const json = await response.json();
      setList(json.results);

      const specificPokemons = await Promise.all(json.results.map(async (pokemon) => {
        const pokemonResponse = await fetch(pokemon.url);
        const pokemonData = await pokemonResponse.json();
        return pokemonData;
      }));
      setPokemons(specificPokemons);
      setFilteredPokemons(specificPokemons);
      calculateStats(specificPokemons);
      extractHealthData(specificPokemons);
    
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
    const averageHeight = pokemons.reduce((sum, pokemon) => sum + pokemon.height, 0) / totalCount;
  
    const typeCounts = pokemons.reduce((counts, pokemon) => {
      pokemon.types.forEach((type) => {
        const typeName = type.type.name;
        counts[typeName] = (counts[typeName] || 0) + 1;  
      });
      return counts;
    }, {});
  
    const mostCommonType = Object.entries(typeCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

    setStats({ totalCount, averageHeight, mostCommonType });
  

    const typeDistribution = Object.keys(typeCounts).map((type) => ({
      name: type, 
      value: typeCounts[type],
      color: typeColors[type] || "#d4d4d4", 
    }));
  
    setTypeDistribution(typeDistribution);
  };

  const extractHealthData = (pokemons) => {
    const healthData = pokemons.map((pokemon, index) => ({
      name: pokemon.name,
      hp: pokemon.stats.find(stat => stat.stat.name === "hp")?.base_stat || 0,
      order: index + 1 
    }));
    setPokemonHealthData(healthData);
  }
  

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
    <div className='container'>
      <h1>Pokemon list</h1>
      <h5>Total Pokemon: {stats.totalCount}</h5>
      <h5>Average Height: {stats.averageHeight.toFixed(2)}</h5>
      <h5>Most Common Type: {stats.mostCommonType}</h5>

      {typeDistribution.length > 0 && (
        <div className='chart-container'>
          <h3>Pokemon Distribution by Type</h3>
          <PieChart width={500} height={500}>
            <Pie data={typeDistribution} dataKey="value" nameKey="name" outerRadius={150} label>
              {typeDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color}></Cell>
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      )}

      {pokemonHealthData.length > 0 && (
        <div className='chart-container'>
          <h3>Pokemon Health (HP) Over Order</h3>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={pokemonHealthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="order" />
              <YAxis />
              <Tooltip content={<GraphBox />}/>
              <Legend />
              <Line type="monotone" dataKey="hp" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="name" stroke="8884d8" dot={false} activeDot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}


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
        ) : (<p>{filteredPokemons.length === 0 && searchTerm ? "No Pokemon found" : "Loading..."}</p>)
      }
      </ul>
    </div>
  )
}

export default App
