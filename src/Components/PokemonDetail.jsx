import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './PokemonDetail.css'

const PokemonDetail = () => {
    const {pokemonName} = useParams();
    const [pokemonDetails, setPokemonDetails] = useState(null);

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
                const data = await response.json();
                setPokemonDetails(data);
            } catch (error) {
                console.error("Can't fetch the pokemon", error);
            }
        };
        fetchPokemonDetails();
    }, [pokemonName]);

    if (!pokemonDetails) return <p>Loading...</p>
    console.log(pokemonDetails.moves[1].url);
    return (
        <div className="pokemon-card">
            <h1 className="pokemon-name">{pokemonDetails.name}</h1>
            <img className="pokemon-image" src={pokemonDetails.sprites.front_default} />
            
            <div className="pokemon-stats">
                <p className="hp">HP: {pokemonDetails.stats[0].base_stat}</p>
                <div className="moves">
                    <p>Moves:</p>
                    <ul>
                        <li>{pokemonDetails.moves[0].move.name}</li>
                        <li>{pokemonDetails.moves[1].move.name}</li>
                    </ul>
                </div>
            </div>

            
            {pokemonDetails.types ? (
                <div className="pokemon-types">
                    <h2>Types:</h2>
                    <ul>
                        {pokemonDetails.types.map((typeDetail) => {
                            const typeName = typeDetail.type.name;
                            return <li key={typeName} className={typeName}>{typeName.charAt(0).toUpperCase() + typeName.slice(1)}</li>;
                        })}
                    </ul>
                </div>
            ) : (
                <p>Not types</p>
            )}
        </div>
    )
}

export default PokemonDetail;