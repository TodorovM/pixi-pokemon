import * as PIXI from 'pixi.js'

export default class Pokemon {
    constructor(obj, x, y){
        this.name = obj.name;
        this.ability = obj.abilities.find(r => r.is_hidden === false).ability;
        this.sprites = {
            back: obj.sprites.back_default,
            front: obj.sprites.front_default
        }
        this.stats = obj.stats.reduce((acc, curr) => (acc[curr.stat.name] = curr.base_stat, acc), {})
        this.moves = obj.moves.map(r => r.move.name).slice(0,4);
        this.x = x;
        this.y = y;
    }

    _pokemonSprite() {
        const sprite = PIXI.Sprite.fromImage(this.sprites.front);
        sprite.x = this.x;
        sprite.y = this.y;
        sprite.name = this.name
        return sprite;
    }

    _pokemonText(){
        const movesString = this.moves.map((move, index) => `Move ${index + 1}: ${move}`).join('\n');
        const statsString = Object.keys(this.stats).map(key => `${key} : ${this.stats[key]}`).join(`\n`);
        const string = `Name: ${this.name}\n -------- \nAbility: ${this.ability.name} \n${movesString} \n${statsString}`;
        const options = {fontSize: 12, fill: 'white'}
        const text = new PIXI.Text(string, options);
        text.x = this.x;
        text.y = this.y + 96;
        return text;
    }

    pokemonContainer(text){
        const container = new PIXI.Container();
        container.addChild(this._pokemonSprite(PIXI));
        if(text) container.addChild(this._pokemonText(PIXI));
        container.name = this.name;
        return container;
    }

}