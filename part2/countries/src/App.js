import React, { useState, useEffect } from 'react'
import axios from 'axios'


const SearchQuery = ({value, onChange, resultCount}) => {
  return (
    <>
      <div className='search'>find countries <input value={value} onChange={onChange} /></div>
      {resultCount > 10 &&  <div>Too many matches, specify another filter</div>}
    </>
  )
}

const CountryLanguages = ({langs}) => (langs ? <ul>{langs.map(lang => <li key={lang.name}>{lang.name}</li>)}</ul> : '')

const Country = ({country, onSelect}) => {
  return (
    <div>{country.name} <button onClick={() => onSelect(country)}>show</button></div>
  )
}

const Weather = ({weather}) => {
  if(!weather) return null
  const { current } = weather

  return (
    <div className='weather'>
      <h3>Weather in {weather.location.name}</h3>
      <div><img alt={current.condition.text} src={current.condition.icon} style={{maxWidth: 120}}/></div>
      <div><strong>Temperature:</strong> {current.temp_c}c ({current.temp_f}f)</div>
      <div><strong>Wind:</strong> {current.wind_dir} at {current.wind_kph} kph ({current.wind_mph} mph)</div>
    </div>
  )
}

const CountryDetail = ({country, weather}) => (
  <div>
    <h2>{country.name}</h2>
    <div><strong>Capital:</strong> {country.capital}</div>
    <div><strong>Population:</strong> {country.population}</div>
    <h3>Languages</h3>
    <CountryLanguages langs={country.languages} />
    <div><img alt='flag' src={country.flag} style={{maxWidth: 120}}/></div>
    <Weather weather={weather} />
  </div>
)

const Countries = ({getCountries, onSelect}) => {
  if(!getCountries) return null
  const countries = getCountries()

  // If only single country returned, select it for display.
  if(countries.length === 1) {
    onSelect(countries[0])
    return null
  }

  // Too many countries handled elsewhere.
  if(countries.length > 10) return null

  return countries.map( (value) => <Country key={value.name} country={value} onSelect={onSelect} /> )
}

function App() {
  const [ countries, setCountries] = useState([]) 
  const [ query, setQuery ] = useState('')
  const [ selected, setSelected ] = useState(undefined)
  const [ weather, setWeather ] = useState(undefined)

  const onChangeQuery = (event) => {
    const { value } = event.target

    // Reset selected country if query changes.
    if(value !== query) setSelected(undefined)

    setQuery(value)
  }

  useEffect(() => {
    console.log('effect')
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        //console.log('promise fulfilled')
        console.log(response)
        setCountries(response.data)
      })
  }, [])
  console.log('render', countries.length, 'countries')

  useEffect(() => {
    console.log('selected effect')
    if(selected) {
      axios
        .get(`https://api.apixu.com/v1/current.json?key=f2998130121c4048b05184713192808&q=${selected.capital}`)
        .then(response => {
          console.log(response)
          setWeather(response.data)
        })
    }
  }, [selected])

  const filteredCountries = (queryValue) => {
    if(!queryValue) return []

    const lcQuery = queryValue.toLocaleLowerCase()
    return countries.filter(value => value.name.toLocaleLowerCase().includes(lcQuery))
  }

  const handleOnSelect = (country) => setSelected(country)

  return (
    <div className="App">
      <SearchQuery value={query} onChange={onChangeQuery} resultCount={filteredCountries(query).length} />
      {selected && <CountryDetail country={selected} weather={weather} />}
      {!selected && <Countries getCountries={() => filteredCountries(query)} onSelect={handleOnSelect} />}
    </div>
  );
}

export default App;
