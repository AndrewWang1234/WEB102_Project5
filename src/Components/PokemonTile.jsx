import React from 'react';
import { useEffect, useState } from 'react'

const PokemonTile = ({ name, image, type }) => {
    return (
        <div className="pokemon-tile">
            <img src={image} alt={name} className="pokemon-image" />
            <h3 className="pokemon-name">{name}</h3>
            <p className="pokemon-type">Main type: {type}</p>
        </div>
    );
};

export default PokemonTile;