import * as PIXI from 'pixi.js';

export default class Battle{

    constructor(pokemon1, pokemons, x, y){
        this._pokemon1 = pokemon1;
        this._pokemons = pokemons;
        this.x = x;
        this.y = y;
        this._defeatedPokemon = [];
        this.colors = {
            red: 0xff0000,
            green:0x00ff00,
            yellow:0xffff00
        }
    }

    _setBattleStage(){
        const container = new PIXI.Container();
        container.x = this.x;
        container.y = this.y;
        return container;
    }

    _drawPokemon(pokemon, x, y, position){
        console.log(pokemon)
        let sprite = PIXI.Sprite.fromImage(pokemon.sprites.front);
        if (position === 'back') sprite = PIXI.Sprite.fromImage(pokemon.sprites.back);
        sprite.x = x;
        sprite.y = y;
        return sprite;
    }

    startBattle(stage){
        const battleStage = this._setBattleStage();
        let randomPokemon = this._pokemons[Math.floor(Math.random()*this._pokemons.length)]
        

        battleStage.addChild(containerPokemon1);
        battleStage.addChild(containerPokemon2);
        stage.addChild(battleStage);

        console.log(this._pokemon1, randomPokemon);


    }

    _battle(stage){
        
    }

    _drawPokemonContainer(x, y, pokemon, position = 'front'){
        const containerPokemon = new PIXI.Container();
        const pokemonSprite = this._drawPokemon(pokemon, x, y, position);
        const pokemonHP = this._drawHpBar(x, y + 200, pokemon);
        containerPokemon.x = 0;
        containerPokemon.y = 104;
        pokemonHP.y = 80;
        containerPokemon.addChild(pokemonSprite);
        containerPokemon.addChild(pokemonHP); 
    }

    _drawHpBar(pokemon){
        const container = new PIXI.Container();
        const bar = new PIXI.Graphics();
        const name = new PIXI.Text(pokemon.name,{fontSize: 12, fill:'white'});

        bar.beginFill(this.colors.green);
        bar.drawRect(0, 20, 100, 5);
        
        container.addChild(name);
        container.addChild(bar);
        return container;

    }

    _removePokemon(pokemon){
        this._pokemons = this._pokemons.filter(r => r.name !== pokemon.name)
        this._defeatedPokemon.push(pokemon);
    }

}