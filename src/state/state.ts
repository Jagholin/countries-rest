import { Action, createReducer, createAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

export const REGIONS = ["Americas", "Africa", "Oceania", "Europe", "Asia", "Antarctic"] as const;
export type CountryEntry = {
  flags: {
    svg: string;
    png: string;
    alt: string;
  },
  name: {
    common: string;
    official: string;
    nativeName: {
      [key: string]: {
        official: string;
        common: string;
      }
    }
  },
  capital: string[];
  region: typeof REGIONS[number];
  population: number;
  id: number;
  cca3: string;
}

export type CountryDetails = CountryEntry & {
  tld: string[];
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    }
  };
  subregion: string;
  languages: {
    [key: string]: string;
  };
  borders?: string[];
}

export type State = {
  countries: Promise<CountryEntry[]>;
  details: Map<string, Promise<CountryDetails>>;
}

export const initialState: State = {
  countries: axios.get<CountryEntry[]>("https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,cca3").then(response => {
    return response.data.map((country, index) => ({
      ...country,
      id: index,
    }));
  }),
  details: new Map(),
};

export type ActionTypes = 'SET_COUNTRIES' | 'SET_DETAILS';

export interface SetCountriesAction extends Action<'SET_COUNTRIES'> {
  payload: Promise<CountryEntry[]>;
}

export interface SetDetailsAction extends Action<'SET_DETAILS'> {
  payload: {
    id: string;
    details: Promise<CountryDetails>;
  };
}

export const reducer = createReducer(initialState, (builder) => {
  builder.addCase('SET_COUNTRIES', (state, action: SetCountriesAction) => {
    state.countries = action.payload;
  }).addCase('SET_DETAILS', (state, action: SetDetailsAction) => {
    state.details.set(action.payload.id, action.payload.details);
  });
});

export const setCountries = createAction<Promise<CountryEntry[]>>('SET_COUNTRIES');
export const setDetails = createAction<{id: string, details: Promise<CountryDetails>}>('SET_DETAILS');
