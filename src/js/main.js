import * as PIXI from 'pixi.js'
import Pokemon from './Pokemon'


const API_URL = 'https://pokeapi.co/api/v2/pokedex/kanto';
const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/';

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  view: document.querySelector('#scene'),
  resolution: window.devicePixelRatio || 1
});

async function getData(url) {
  let data = await fetch(url);
  let json = await data.json();
  return json;
}

async function getAllPokemon() {
  let pokemonArray = [];
  const pokemonData = await getData(API_URL);
  for (const pokemonRequest of pokemonData.pokemon_entries) {
    const data = await fetch(POKEMON_URL + pokemonRequest.pokemon_species.name);
    const pokemon = await data.json()
    pokemonArray.push(pokemon);
  }
  return pokemonArray;
}

function drawPokemon(data) {
  const spriteWidth = 96;
  const columns = Math.floor(window.innerWidth / spriteWidth);
  const rows = Math.floor(data.length / columns);
  data.forEach((el, index) => {
    const x = (index % columns) * spriteWidth;
    const y = (Math.floor(index / columns)) * spriteWidth;
    const pokemon = new Pokemon(el, x, y);
    app.stage.addChild(pokemon.pokemonSprite(PIXI))
    
  });
  app.renderer.resize(window.innerWidth, (rows + 1) * spriteWidth)
}

function start(data) {
  drawPokemon(data);
}

getAllPokemon().then(data => start(data))