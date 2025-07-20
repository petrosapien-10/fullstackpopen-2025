import { useState, useEffect } from "react";
import axios from "axios";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/name";
export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    axios.get(`${baseUrl}/${name}`)
      .then((response) => setCountry(response.data))
      .catch((error) => {
        setCountry(null)
        console.error(error)
      })
  }, [name])

  return country
}