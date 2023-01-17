import React, { useState, useEffect } from "react";
import './index.css'
const App = () => {
  const [data, setData] = useState(null);
  const [types, setTypes] = useState(null);
  const [filterData, setFilterData] = useState(null)

  const fetchAPITypes = async () => {
    const types = await fetch("https://pokeapi.co/api/v2/type");
    const typesJson = await types.json();
    setTypes(typesJson.results);
  };

  const fetchAPI = async () => {
    const pokeList = await fetch(
      "https://pokeapi.co/api/v2/pokemon?limit=150&offset=0"
    );
    const dataJson = await pokeList.json();
    const data = dataJson.results;
    fetchOnePoke(data);
  };

  const fetchOnePoke = async (data) => {
    const pokeData = data.map(async (el) => {
      let info = await fetch(el.url);
      let infoJson = await info.json();
      return infoJson;
    });
    const results = await Promise.all(pokeData);
    setData(results);
    setFilterData(results)
  };

  useEffect(() => {
    fetchAPI();
    fetchAPITypes();
  }, []);

  const filterByType = (ev) => {
    const filter = ev.target.value;
    const newList = data.filter((el) => {
      return el.types.some((innerType) => innerType.type.name === filter);
    });
    setFilterData(newList);
  };

  return (
    <div className="App">
      <h1>Pokemones</h1>
      <select onChange={filterByType} name="pokemones" id="poke">
        {types?.map((type) => (
          <option key={type.id} value={type.name}>
            {type.name}
          </option>
        ))}
      </select>
      <div className="card-container">
        {filterData?.map((pokemon) => (
          <div key={pokemon.id} className='card'>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
            <p>Nombre: {pokemon.name}</p>
            {pokemon?.types?.map((type) => (
              <p>Tipo: {type.type.name}</p>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
