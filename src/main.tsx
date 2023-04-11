import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter, defer } from 'react-router-dom'
import axios from 'axios'
import App from './App'
import CountryList from "./pages/CountryList";
import './index.css'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <CountryList />,
        loader: async () => {
          const data = await axios.get("https://restcountries.com/v3.1/all?fields=name,capital,flags,population,region");
          return defer({data: data.data});
        }
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
