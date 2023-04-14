import React, { useState, useMemo, useEffect } from 'react'
import styled from "@emotion/styled";
import { flexLayout, gridLayout, grow, inputCommon, textBig, textBigger, textBold, textBolder } from '../styles/common';
import SearchBar from '../components/SearchBar';
import FilterComboBox from '../components/FilterComboBox';
import { Await, NavLink, useLoaderData, useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { CountryEntry, REGIONS, State, setCountries } from '../state/state';
import { ConnectedProps, connect } from 'react-redux';

const ValueTitle = styled.span([textBolder]);

const CardContent = styled.div({
  padding: '1rem',
  '& > strong + div': {
    marginTop: '1rem',
  },
  '& > div + div': {
    marginTop: '0.2rem',
  },
});

const CountriesGrid = ({countryList, ...props}: {countryList: CountryEntry[]}) => {
  const navigate = useNavigate();
  const regions = countryList.map(country => country.region).reduce((acc, region) => {
    if (!acc.includes(region)) {
      acc.push(region);
    }
    return acc;
  }, [] as string[]);

  console.log(regions);

  return (
    <div css={theme => [gridLayout, {
      justifyItems: 'center',
      gap: '4rem',
    }]} {...props}>
      {countryList.map(country => (
        // <NavLink to={`/country/${country.id}`} key={country.name.common} css={theme => ({backgroundColor: theme.colors.elements, cursor: 'pointer'})}>
        <div key={country.name.common} css={theme => ({backgroundColor: theme.colors.elements, cursor: 'pointer'})} onClick={() => navigate(`/country/${country.cca3}`)}>
          {/* FIXME: role=img due to bug: https://bugs.webkit.org/show_bug.cgi?id=216364 */}
          <img src={country.flags.png} alt={country.flags.alt} css={{maxWidth: '100%'}} role='img' />
          <CardContent>
            <strong css={[textBolder, textBigger]}>{country.name.common}</strong>
            <div><ValueTitle>Population:</ValueTitle> {country.population}</div>
            <div><ValueTitle>Region:</ValueTitle> {country.region}</div>
            <div><ValueTitle>Capital:</ValueTitle> {country.capital}</div>
          </CardContent>
        </div>
        // </NavLink>
      ))}
    </div>
  )
}

const connector = connect((state: State) => {
  return {
    countryList: state.countries,
  }
});

type Props = ConnectedProps<typeof connector>;

function CountryList({countryList}: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [continentFilter, setContinentFilter] = useState('');

  // const {response: countryList} = useLoaderData() as {response: Promise<AxiosResponse<CountryEntry[]>>};

  // console.log(countryList);
  const filteredCountryList = useMemo(() => countryList.then(response => {
    const filtered = response.filter(country => {
      if (continentFilter && country.region !== continentFilter) {
        return false;
      }
      if (searchQuery) {
        const searchQueryLower = searchQuery.toLowerCase();
        if (!country.name.common.toLowerCase().includes(searchQueryLower) && !country.name.official.toLowerCase().includes(searchQueryLower)) {
          return false;
        }
      }
      return true;
    });
    return {
      ...response,
      data: filtered,
    }
  }), [countryList, searchQuery, continentFilter]);

  return (
    <div>
      <div css={[flexLayout("2rem", "2rem", true)]}>
        <SearchBar labelText={<i className="fa-solid fa-magnifying-glass"></i>}
          placeholder='Search by name' 
          css={[grow, {height: '3rem'}]}
          value={searchQuery}
          setValue={setSearchQuery}/>
        <FilterComboBox 
          label='Filter by continent' 
          options={REGIONS} 
          value={continentFilter}
          setValue={setContinentFilter} />
      </div>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Await resolve={filteredCountryList}>
          { (countryList: AxiosResponse<CountryEntry[]>) => <CountriesGrid countryList={countryList.data} css={{marginTop: '3rem'}} /> }
        </Await>
      </React.Suspense>
    </div>
  )
}

export default connector(CountryList);
