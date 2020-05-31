import * as PIXI from 'pixi.js'
import Pokemon from './Pokemon'
import Battle from './Battle'

const POKEMON_URL = 'https://pokeapi.co/api/v2/pokemon/';

const EventEmiter = new PIXI.utils.EventEmitter();

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
  const pokemonData = await getData(POKEMON_URL + '?limit=151');
  for (const pokemonRequest of pokemonData.results) {
    const data = await fetch(POKEMON_URL + pokemonRequest.name);
    const pokemon = await data.json()
    pokemonArray.push(pokemon);
  }
  return pokemonArray;
}

function createPokemonObjects(data) {
  let pokemons = [];
  data.forEach(pkmn => {
    const pokemon = new Pokemon(pkmn, 0, 0);
    pokemons.push(pokemon);
  })
  return pokemons;
}

function drawButton(x, y, text, color){
  const rect = new PIXI.Graphics();
  const textColor = color === '0xFFFFFF' ? 'black' : 'white' ; 
  const options = {fontSize: 20, padding: 10, fill: textColor, fontWeight: 900}
  const textComponent = new PIXI.Text(text, options);
  
  rect.beginFill(color);
  rect.drawRect(x, y, textComponent.width + 20, textComponent.height + 20);
  rect.lineStyle(3, color)
  rect.interactive = true;

  textComponent.x = x + 10;
  textComponent.y = y + 10;

  rect.addChild(textComponent);
  return rect;
}

function drawPokemon(pokemon, x, y, text) {
  pokemon.x = x;
  pokemon.y = y;
  const container = pokemon.pokemonContainer(text);
  container.interactive = true;
  container.on('click', () => {
     EventEmiter.emit('pokemon_clicked', pokemon.name);
  })
  app.stage.addChild(container) 
}

function drawGrid(data) {
  const spriteWidth = 96;
  const columns = Math.floor(window.innerWidth / spriteWidth);
  const rows = Math.floor(data.length / columns);
  data.forEach((el, index) => {
    const x = (index % columns) * spriteWidth;
    const y = Math.floor(index / columns) * (spriteWidth) ;
    drawPokemon(el, x, y );
  });
  const height = (((rows + 1) * spriteWidth) > window.innerHeight) ? (rows + 1) * spriteWidth : window.innerHeight;
  app.renderer.resize(window.innerWidth, height);
}

function showInfo(pokemon){
  drawPokemon(pokemon, 250 - 48, 0, true)
  const fightButton = drawButton(140, 330, 'Fight!', '0xFF0000')
  fightButton.on('click', () => {
    EventEmiter.emit('start_battle', pokemon);
  })

  const resetButton = drawButton((140 + fightButton.width + 50), 330, 'Go Back', '0x0000FF');
  resetButton.on('click', () => {
    EventEmiter.emit('reset')
  })

  app.stage.addChild(fightButton);
  app.stage.addChild(resetButton);
}

function clear(){
  app.stage.removeChildren();
}

function reset(data){
  clear();
  app.renderer.resize(window.innerWidth, window.innerHeight);
  drawGrid(data);
}

function start(data) {
  const pokemons = createPokemonObjects(data);
  drawGrid(pokemons);
  EventEmiter.on('pokemon_clicked', (e) =>{
    clear();
    app.renderer.resize(500, 500);
    const pokemonClicked = pokemons.find(r => r.name === e)
    showInfo(pokemonClicked);
  })
  EventEmiter.on('start_battle', (e) => {
    clear();
    app.renderer.resize(400, 400);
    const pokemonOpponents = pokemons.filter(r => r !== e);
    const battle = new Battle(e, pokemonOpponents, app.stage);
    battle.battle();
  })
  EventEmiter.on('reset', () => {
    reset(pokemons);
  })
}

getAllPokemon().then(data => start(data))