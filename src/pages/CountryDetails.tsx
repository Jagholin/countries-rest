import React, { Suspense } from 'react'
import { ConnectedProps, connect, useStore } from 'react-redux';
import { CountryDetails, CountryEntry, State, setDetails } from '../state/state';
import { Await, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import styled from '@emotion/styled';
import { breakpointMobile, flexLayout, inputCommon, textBolder } from '../styles/common';

const connector = connect((state: State) => {
  return {
    countryDetails: state.details,
    allCountries: state.countries,
  };
});

type Props = ConnectedProps<typeof connector>;

const Button = styled.button(props => [
  inputCommon(props),
  {
    cursor: 'pointer',
  }
]);

const DetailsGrid = styled.section(props => ({
  display: 'grid',
  gridTemplateColumns: '1fr',
  marginTop: '1.5rem',
  gap: '1rem',

  [breakpointMobile(props.theme)]: {
    gridTemplateColumns: '2fr 1fr 1fr',
  },
  'strong': [textBolder],
}));

const DetailsFlag = styled.img(props => ({
  display: 'block',
  maxWidth: '100%',
  maxHeight: '40rem',
  margin: '0 auto',
  [breakpointMobile(props.theme)]: {
    gridRow: '1 / 4',
  },
}));

const DetailsTitle = styled.h2(props => ({
  alignSelf: 'end',
  [breakpointMobile(props.theme)]: {
    gridColumn: '2 / 4',
  }
}));

const DetailsBorder = styled.div(props => ({
  alignSelf: 'start',
  [breakpointMobile(props.theme)]: {
    gridColumn: '2 / 4',
  }
}));

function CountryDetailsComponent({countryDetails, dispatch, allCountries}: Props) {
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
      <Button onClick={() => navigate(-1)}>Back</Button>
      <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={Promise.all([countryData, allCountries])}>
          { ([countryData, allCountries]: [CountryDetails, CountryEntry[]]) => (
            <DetailsGrid>
              <DetailsFlag src={countryData.flags.png} alt={countryData.flags.alt}></DetailsFlag>
              <DetailsTitle>{countryData.name.common}</DetailsTitle>
              <div css={{marginTop: '0.5rem', lineHeight: '1.3rem'}}>
                <div><strong>Native Name:</strong> {Object.values(countryData.name.nativeName)[0].official}</div>
                <div><strong>Population:</strong> {countryData.population}</div>
                <div><strong>Region:</strong> {countryData.region}</div>
                <div><strong>Sub Region:</strong> {countryData.subregion}</div>
                <div><strong>Capital:</strong> {countryData.capital}</div>
              </div>
              <div css={{marginTop: '0.5rem', lineHeight: '1.3rem'}}>
                <div><strong>Top Level Domain:</strong> {countryData.tld.join(', ')}</div>
                <div><strong>Currencies:</strong> {Object.values(countryData.currencies).map(currency => currency.name).join(', ')}</div>
                <div><strong>Languages:</strong> {Object.values(countryData.languages).join(', ')}</div>
              </div>
              <DetailsBorder css={{marginTop: '0.5rem', lineHeight: '1.3rem'}}>
                <strong>Border Countries:</strong>
                {countryData.borders ? <ul css={[flexLayout('1rem', undefined, true), {listStyle: 'none', marginTop: '0.5rem'}]}>
                  {countryData.borders.map(border => (
                    <li key={border}>
                      <Button onClick={() => navigate("/country/" + border)}>{allCountries.find(c => c.cca3 === border)?.name.common}</Button>
                    </li>
                  ))}
                </ul> : <div>None</div>}
              </DetailsBorder>
            </DetailsGrid>
          )}
        </Await>
      </Suspense>
    </div>
  )
}

export default connector(CountryDetailsComponent);
