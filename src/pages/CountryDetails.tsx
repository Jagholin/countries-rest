import React, { Suspense } from 'react'
import { ConnectedProps, connect, useStore } from 'react-redux';
import { CountryDetails, State, setDetails } from '../state/state';
import { Await, useParams } from 'react-router-dom';
import axios from 'axios';

const connector = connect((state: State) => {
  return {
    countryDetails: state.details
  };
});

type Props = ConnectedProps<typeof connector>;

function CountryDetailsComponent({countryDetails, dispatch}: Props) {
  const { countryId } = useParams();

  const countryData = countryDetails.get(countryId!);

  if (!countryData) {
    const dataFetch = axios.get<CountryDetails[]>("https://restcountries.com/v3.1/alpha/" + countryId).then(
      response => response.data[0]
    );
    dispatch(setDetails({id: countryId!, details: dataFetch}));
    return null;
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Await resolve={countryData}>
        { (countryData: CountryDetails) => (
          <div>
            <h1>{countryData.name.common}</h1>
            <img src={countryData.flags.png} alt={countryData.flags.alt} />
            <div>Population: {countryData.population}</div>
            <div>Region: {countryData.region}</div>
            <div>Capital: {countryData.capital}</div>
          </div>
        )}
      </Await>
    </Suspense>
  )
}

export default connector(CountryDetailsComponent);
