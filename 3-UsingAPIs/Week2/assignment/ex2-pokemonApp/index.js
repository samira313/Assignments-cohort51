/*------------------------------------------------------------------------------
Full description at: https://github.com/HackYourFuture/Assignments/blob/main/3-UsingAPIs/Week2/README.md#exercise-2-gotta-catch-em-all

Complete the four functions provided in the starter `index.js` file:

`fetchData`: In the `fetchData` function, make use of `fetch` and its Promise 
  syntax in order to get the data from the public API. Errors (HTTP or network 
  errors) should be logged to the console.

`fetchAndPopulatePokemons`: Use `fetchData()` to load the pokemon data from the 
  public API and populate the `<select>` element in the DOM.
  
`fetchImage`: Use `fetchData()` to fetch the selected image and update the 
  `<img>` element in the DOM.

`main`: The `main` function orchestrates the other functions. The `main` 
  function should be executed when the window has finished loading.

Use async/await and try/catch to handle promises.

Try and avoid using global variables. As much as possible, try and use function 
parameters and return values to pass data back and forth.
------------------------------------------------------------------------------*/
const apiUrl = 'https://pokeapi.co/api/v2/pokemon?limit=151';

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Data could not be fetched, status = ' + response.status);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchAndPopulatePokemons(apiUrl, selectElement) {
  try {
    const data = await fetchData(apiUrl);
    if (!data || !data.results) throw new Error('No Pokémon data available');

    data.results.forEach((pokemon) => {
      const option = document.createElement('option');
      option.textContent = pokemon.name;
      option.value = pokemon.url;
      selectElement.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating Pokémon:', error);
  }
}

async function fetchImage(url) {
  const pokemonData = await fetchData(url);
  if (!pokemonData || !pokemonData.sprites)
    console.error('No Pokémon image available');
  return pokemonData.sprites.front_default;
}

async function main() {
  const pokemonBox = document.createElement('div');
  pokemonBox.classList.add('pokemon-box');
  document.body.appendChild(pokemonBox);
  const select = document.createElement('select');
  pokemonBox.appendChild(select);
  const defaultOption = document.createElement('option');
  defaultOption.textContent = 'Select a Pokémon';
  select.appendChild(defaultOption);
  const img = document.createElement('img');
  pokemonBox.appendChild(img);

  await fetchAndPopulatePokemons(apiUrl, select);

  select.addEventListener('change', async (event) => {
    const fetchedImage = await fetchImage(event.target.value);
    img.src = fetchedImage;
  });
}

window.addEventListener('load', main);