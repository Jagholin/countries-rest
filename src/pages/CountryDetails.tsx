import React, { Suspense } from 'react'
import { ConnectedProps, connect, useStore } from 'react-redux';
import { CountryDetails, State, setDetails } from '../state/state';
import { Await, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from '@emotion/styled';
import { breakpointMobile } from '../styles/common';

const connector = connect((state: State) => {
  return {
    countryDetails: state.details
  };
});

type Props = ConnectedProps<typeof connector>;

const DetailsGrid = styled.div(props => ({
  display: 'grid',
  gridTemplateColumns: '1fr',

  [breakpointMobile(props.theme)]: {
    gridTemplateColumns: '2fr 1fr 1fr',
  }
}));

const DetailsFlag = styled.img(props => ({
  display: 'block',
  width: '100%',
  [breakpointMobile(props.theme)]: {
    gridRow: '1 / 4',
  },
}));

const DetailsTitle = styled.h2(props => ({
  [breakpointMobile(props.theme)]: {
    gridColumn: '2 / 4',
  }
}));

const DetailsBorder = styled.div(props => ({
  [breakpointMobile(props.theme)]: {
    gridColumn: '2 / 4',
  }
}));

function CountryDetailsComponent({countryDetails, dispatch}: Props) {
  const { countryId } = useParams();
  const navigate = useNavigate();

  const countryData = countryDetails.get(countryId!);

  if (!countryData) {
    const dataFetch = axios.get<CountryDetails[]>("https://restcountries.com/v3.1/alpha/" + countryId).then(
      response => response.data[0]
    );
    dispatch(setDetails({id: countryId!, details: dataFetch}));
    return null;
  }

  return (
    <div>
      <button onClick={() => navigate(-1)}>Back</button>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={countryData}>
          { (countryData: CountryDetails) => (
            <DetailsGrid>
              <DetailsFlag src={countryData.flags.png} alt={countryData.flags.alt}></DetailsFlag>
              <DetailsTitle>{countryData.name.common}</DetailsTitle>
              <div>
                <div><strong>Native Name:</strong> {Object.values(countryData.name.nativeName)[0].official}</div>
                <div><strong>Population:</strong> {countryData.population}</div>
                <div><strong>Region:</strong> {countryData.region}</div>
                <div><strong>Sub Region:</strong> {countryData.subregion}</div>
                <div><strong>Capital:</strong> {countryData.capital}</div>
              </div>
              <div>
                <div><strong>Top Level Domain:</strong> {countryData.tld}</div>
                <div><strong>Currencies:</strong> {Object.values(countryData.currencies).map(currency => currency.name).join(', ')}</div>
                <div><strong>Languages:</strong> {Object.values(countryData.languages).join(', ')}</div>
              </div>
              <DetailsBorder>
                <strong>Border Countries:</strong>
                <ul>
                  {countryData.borders?.map(border => (
                    <li key={border}>
                      <button onClick={() => navigate("/country/" + border)}>{border}</button>
                    </li>
                  ))}
                </ul>
              </DetailsBorder>
            </DetailsGrid>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default connector(CountryDetailsComponent);
