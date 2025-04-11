import React from 'react';
import { useEffect, useState } from 'react'
import './PokemonTile.css'
import { Link } from 'react-router-dom';

const PokemonTile = ({ name, image, type }) => {
    return (
        <div className="pokemon-tile">
            <Link to={`/pokemon/${name}`} className="pokemon-link">
                <img src={image} alt={name} className="pokemon-image" />
                <h3 className="pokemon-name">{name}</h3>
                <p className="pokemon-type">Main type: {type}</p>
            </Link>
        </div>
    );
};

export default PokemonTile;