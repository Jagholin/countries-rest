import React, { useState } from 'react'
import styled from "@emotion/styled";
import { gridLayout, inputCommon } from '../styles/common';
import SearchBar from '../components/SearchBar';
import FilterComboBox from '../components/FilterComboBox';
import { Await, useLoaderData } from 'react-router-dom';
import { AxiosResponse } from 'axios';

export type CountryEntry = {
  flags: {
    svg: string;
    png: string;
    alt: string;
  },
  name: {
    common: string;
    official: string;
  },
  capital: string[];
  region: string;
  population: number;
}

const CountriesGrid = ({countryList}: {countryList: CountryEntry[]}) => {
  return (
    <div css={[gridLayout, {
      gap: '1rem',
    }]}>
      {countryList.map(country => (
        <div key={country.name.common}>
          <img src={country.flags.png} alt={country.flags.alt} css={{maxWidth: '100%'}} />
          <div>{country.name.common}</div>
          <div>{country.capital}</div>
          <div>{country.region}</div>
          <div>{country.population}</div>
        </div>
      ))}
    </div>
  )
}

function CountryList() {
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState('');

  const {response: countryList, other} = useLoaderData() as {response: Promise<AxiosResponse<CountryEntry[]>>, other: Promise<string>};

  console.log(countryList);

  return (
    <div>
      <SearchBar labelText={<i className="fa-solid fa-magnifying-glass"></i>} 
        css={{height: '3rem'}}
        value={searchQuery}
        setValue={setSearchQuery}/>
      <FilterComboBox 
        label='Filter by continent' 
        options={['Europe', 'Asia', 'North America', 'South America', 'Africa', 'Australia']} 
        value={continentFilter}
        setValue={setContinentFilter} />

      <React.Suspense fallback={<div>Loading...</div>}>
        <Await resolve={countryList}>
          { (countryList: AxiosResponse<CountryEntry[]>) => <CountriesGrid countryList={countryList.data} /> }
        </Await>
      </React.Suspense>
    </div>
  )
}

export default CountryList
