import { useEffect, useState } from "react";
import axios from "axios";
import { useCountry } from "./hooks";

const baseUrl = "https://studies.cs.helsinki.fi/restcountries/api/";
const weatherMapUrl = "https://api.openweathermap.org/data/2.5/weather?q=";
const api = import.meta.env.VITE_API_KEY;

const Message = () => <p>Too many matches, specify another filter</p>;

const CountryInfo = ({ country, weatherData }) => {
  const languageList = [];
  for (let property in country.languages) {
    languageList.push(country.languages[property]);
  }

  return (
    <>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>

      <h2>Languages</h2>
      <ul>
        {languageList.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>

      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />

      <h2>Weather in {country.capital[0]}</h2>

      <div>
        {weatherData && (
          <>
            <p>Temperature {weatherData.main.temp} Celsius</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="weather icon"
            />
            <p>Wind {weatherData.wind.speed} m/s</p>
          </>
        )}
      </div>
    </>
  );
};

const ShowButton = ({ onClick }) => <button onClick={onClick}>Show</button>;

const CountryList = ({ input, matchedCountries, onShowCountry }) => {
  if (input.length === 0) return null;
  if (matchedCountries.length > 10) return <Message />;
  if (matchedCountries.length === 1) return null;

  return (
    <ul>
      {matchedCountries.map((country) => {
        return (
          <li key={country.name.common}>
            {country.name.common}
            <ShowButton onClick={() => onShowCountry(country)} />
          </li>
        );
      })}
    </ul>
  );
};

function App() {
  const [countries, setCountries] = useState([]);
  const [input, setInput] = useState("");
  const [matchedCountries, setMatchedCountries] = useState([]);
  const [name, setName] = useState(null);
  const [weatherData, setWeatherData] = useState(null);

  const country = useCountry(name)

  useEffect(() => {
    fetchAllCountries().then((allCountries) => {
      setCountries(allCountries);
    });
  }, []);

  useEffect(() => {
    setWeatherData(null);
    if (!country || !country.capital) return;

    fetchWeatherForCapital(country.capital[0]).then((data) => {
      setWeatherData(data);
    });
  }, [country]);

  const fetchAllCountries = () => {
    const request = axios.get(`${baseUrl}/all`);
    return request.then((response) => response.data);
  };

  const fetchWeatherForCapital = (capital) => {
    const request = axios.get(
      `${weatherMapUrl}${capital}&appid=${api}&units=metric`
    );
    return request.then((response) => response.data);
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setInput(value);
    const matches = countries.filter((c) =>
      c.name.common.toLowerCase().includes(value.toLowerCase())
    );

    if (matches.length === 1) {
      setName(matches[0].name.common);
    } else {
      setName(null);
    }

    setMatchedCountries(matches);
  };

  const handleShowClick = (country) => {
    setName(country.name.common);
  };

  const shouldShowCountryInfo =
    (matchedCountries.length === 1 || name) && country;

  return (
    <>
      <div>
        find countries: <input value={input} onChange={handleSearchChange} />
      </div>

      <CountryList
        input={input}
        matchedCountries={matchedCountries}
        onShowCountry={handleShowClick}
      />

      <div>
        {shouldShowCountryInfo && (
          <CountryInfo country={country} weatherData={weatherData} />
        )}
      </div>
    </>
  );
}

export default App;
