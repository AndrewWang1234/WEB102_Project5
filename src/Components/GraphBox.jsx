import React, { useEffect, useState } from 'react';

const GraphBox = ({ active, payload, label}) => {
    if (active && payload && payload.length) {
        const hpData = payload.find(p => p.dataKey === 'hp');
        const name = hpData?.payload?.name;

        return (
            <div className='custom-tooltip' style={{backgroundColor: '#fff', border: '1px solid #ccc', padding: '10px'}}>
                <p className='Order'>Order: {label}</p>
                <p className='Name'>Pokemon: {name}</p>
                <p className='Hp'>HP: {hpData?.value}</p>
            </div>
        );
    }

    return null;
}
export default GraphBox;