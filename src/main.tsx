import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, defer } from 'react-router-dom'
import axios from 'axios'
import App from './App'
import CountryList from "./pages/CountryList";
import './index.css'
import CountryDetails from './pages/CountryDetails'
import { CountryEntry, reducer } from './state/state'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import { enableMapSet } from 'immer';

enableMapSet();

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <CountryList />,
        loader: async () => {
          const data = axios.get<CountryEntry[]>("https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region,cca3,cioc,borders").then(response => {
            return {
              ...response,
              data: response.data.map((country, index) => ({
                ...country,
                id: index,
              })),
            }
          });
          return defer({response: data});
        },
        shouldRevalidate: () => false,
      },
      {
        path: "country/:countryId",
        element: <CountryDetails />,
      }
    ]
  }
])

const store = configureStore({
  reducer,
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
)

