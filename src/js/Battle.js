import * as PIXI from 'pixi.js';
import gsap from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);

export default class Battle{

    constructor(userPokemon, pokemons, stage){
        this._userPokemon = userPokemon;
        this._pokemons = pokemons;
        this._defeatedPokemon = [];
        this._colors = {
            red: 0xff0000,
            green:0x00ff00,
            yellow:0xffff00
        },
        this._stage = stage;
        this._eventEmitter = new PIXI.utils.EventEmitter();
    }

    _drawBattleStage(pokemon1, pokemon2){
        const container = new PIXI.Container();
        const pokemon1Container = this._drawPokemonContainer(0, 154, pokemon1, 'back');
        const pokkemon2Container = this._drawPokemonContainer(154, 0, pokemon2);
        this._stage.removeChildren();
        container.addChild(pokemon1Container, pokkemon2Container);
        this._stage.addChild(container);
    }

    _drawPokemon(pokemon, x, y, position){
        let sprite = PIXI.Sprite.fromImage(pokemon.sprites.front);
        if (position === 'back') sprite = PIXI.Sprite.fromImage(pokemon.sprites.back);
        sprite.x = x;
        sprite.y = y;
        sprite.name = `${pokemon.name}_sprite`;
        return sprite;
    }

    
    _drawPokemonContainer(x, y, pokemon, facing = 'front'){
        const containerPokemon = new PIXI.Container();
        const containerInfo = new PIXI.Container();
        const pokemonSprite = this._drawPokemon(pokemon, x, y, facing);
        const pokemonHP = this._drawHpBar(pokemon.name);
        const pokemonName = this._drawPokemonName(pokemon)
        
        containerInfo.addChild(pokemonHP, pokemonName);
        containerInfo.x = x - containerInfo.width;
        if (facing === 'back') containerInfo.x = x + 96;
        containerInfo.y = y + 48;
        containerPokemon.addChild(pokemonSprite, containerInfo);
        containerPokemon.position = {x, y}
        containerPokemon.name = `${pokemon.name}_container`
        return containerPokemon
    }
    
    _drawPokemonName(pokemon){
        const name = new PIXI.Text(pokemon.name,{fontSize: 12, fill:'white'});
        return name;
    }
    
    _drawHpBar(name){
        const bar = new PIXI.Graphics();
        bar.beginFill(this._colors.green);
        bar.drawRect(0, 20, 100, 5);
        bar.name = `${name}_hp` 
        return bar;
        
    }

    _drawText(text){
        const pixiText = new PIXI.Text(text, {fontSize: 50, fill: 'white'});
        pixiText.position = {x: 200 - pixiText.width, y: 200 - pixiText.height}
        return pixiText;
    }
    
    _removePokemon(pokemon){
        this._pokemons = this._pokemons.filter(r => r.name !== pokemon.name)
        this._defeatedPokemon.push(pokemon);
    }
    
    battle(winner = null){
        const randomPokemon = this._pokemons[Math.floor(Math.random()*this._pokemons.length)]
        const orderBySpeed = [this._userPokemon, randomPokemon].sort((a,b) => b.speed - a.speed);
        this._drawBattleStage(this._userPokemon, randomPokemon)
        this._battleLogic(...orderBySpeed, this._userPokemon.stats.hp, randomPokemon.stats.hp);
        this._eventEmitter.off('battle_over');
        this._eventEmitter.on('battle_over', (e) => {
            // console.error(e.name)
            // if (e.name === this._userPokemon.name) {
            //     this._removePokemon(randomPokemon)
            //     console.log('WIN'),
            //     this.battle();
            // } else {
            //     console.error('Lose:', this._defeatedPokemon)
            // }
        });
        
    }


    _battleLogic(attacker, opponent, hpAttacker, hpOpponent){
        const tl = gsap.timeline({onComplete: () => {
            console.log(opponent.name, hpOpponent)
            if (hpOpponent <= 0) {

                this._eventEmitter.emit('battle_over', attacker);
            } else {
                this._battleLogic(opponent, attacker, hpOpponent, hpAttacker);
            }    
        }})
        const attack = attacker.stats.attack;
        const defense = opponent.stats.defense;
        const damage = (attack / defense) * Math.floor(Math.random() * 50);
        const color = this._hpColor((hpOpponent - damage) / opponent.hp)
        this._animations(tl, attacker, opponent, hpOpponent, damage, color);
        hpOpponent = hpOpponent - damage;
        
    }
    
    _animations(tl, attacker, opponent, hpOpponent, damage, color){
        const attackerSprite = this._stage.children[0].getChildByName(`${attacker.name}_container`).getChildByName(`${attacker.name}_sprite`);
        const opponentSprite = this._stage.children[0].getChildByName(`${opponent.name}_container`).getChildByName(`${opponent.name}_sprite`);
        const opponentBar = this._stage.children[0].getChildByName(`${opponent.name}_container`).children[1].getChildByName(`${opponent.name}_hp`);
        const scale = (1 - (damage/hpOpponent)) < 0 ? 0 : 1 - (damage/hpOpponent);
        console.log(opponentSprite)
        
        tl.to(attackerSprite, {duration:0.1, y: '-=10', repeat:3, yoyo:true})
          .to(attackerSprite, {duration: 1, pixi: {positionX: opponentSprite.worldTransform.tx + 96, positionY: opponentSprite.worldTransform.ty + 96}, repeat:1, yoyo: true})
          .to(opponentBar, {duration: .5, pixi: {scaleX: scale, fillColor: color}})
    }

    _hpColor(healthPercentage) {
        if(healthPercentage > 0.5) {
            return this._colors.green;
        }else if (healthPercentage < 0.5 && healthPercentage > 0.2) {
            return this._colors.yellow;
        } else {
            return this._colors.red;
        }
    }
}