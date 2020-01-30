// Geolocalization
const cities = require('./json/cities.json');
import * as uuidv4 from 'uuid/v4';
const uuid = uuidv4;
// Squint rank
const ranking: any = [
    {
        id: 'mex',
        iso_a3: 'MEX',
        iso_a2: 'MX',
        position: 1,
        name: 'México',
        growth: 'up',
        value: 1276856,
        cities: [

        ]
    },
    {
        id: 'usa',
        iso_a3: 'USA',
        iso_a2: 'US',
        position: 2,
        name: 'Estados Unidos',
        growth: 'down',
        value: 11768567,
        cities: [

        ]
    },
    {
        id: 'per',
        iso_a3: 'PER',
        iso_a2: 'PE',
        position: 3,
        name: 'Perú',
        growth: 'up',
        value: 340567,
        cities: [

        ]
    },
    {
        id: 'arg',
        iso_a3: 'ARG',
        iso_a2: 'AR',
        position: 4,
        name: 'Argentina',
        growth: 'up',
        value: 25780,
        cities: [

        ]
    },
    {
        id: 'col',
        iso_a3: 'COL',
        iso_a2: 'CO',
        position: 5,
        name: 'Colombia',
        growth: 'up',
        value: 12456,
        cities: [

        ]
    },
    {
        id: 'gbr',
        iso_a3: 'GBR',
        iso_a2: 'GB',
        position: 6,
        name: 'Inglaterra',
        growth: 'up',
        value: 12456,
        cities: [

        ]
    },
    {
        id: 'esp',
        iso_a3: 'ESP',
        iso_a2: 'ES',
        position: 7,
        name: 'España',
        growth: 'up',
        value: 12456,
        cities: [

        ]
    },
    {
        id: 'fr',
        iso_a3: 'FRA',
        iso_a2: 'FR',
        position: 8,
        name: 'Francia',
        growth: 'up',
        value: 12456,
        cities: [

        ]
    },
    {
        id: 'de',
        iso_a3: 'DEU',
        iso_a2: 'DE',
        position: 9,
        name: 'Alemania',
        growth: 'up',
        value: 12456,
        cities: [

        ]
    },
    {
        id: 'it',
        iso_a3: 'ITA',
        iso_a2: 'IT',
        position: 10,
        name: 'Italia',
        growth: 'up',
        value: 12456,
        cities: [

        ]
    }
];


const growth = [
    'down',
    'up'
];
ranking.forEach(country => {
    const countryCities = cities.filter(c => c.country === country.iso_a2).slice(0, 10);
    let count = 1;
    countryCities.forEach(c => {
        const value = Math.floor(Math.random() * 1200000) + 1;
        const g = Math.floor(Math.random() * growth.length);
        const city = {
            id: uuid(),
            position: count,
            growth: growth[g],
            value: value,
            country: country.iso_a3,
            name: c.name,
            lat: c.lat,
            lng: c.lng
        };
        country.cities.push(city);
        count++;
    });

});


export const SQUINT_RANK_COUNTRIES = ranking;
