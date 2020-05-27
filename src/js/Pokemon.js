import * as PIXI from 'pixi.js'

export default class Pokemon {
    constructor(obj, x, y, index){
        this.index = index;
        this.name = obj.name;
        this.ability = obj.abilities[0];
        this.sprites = {
            back: obj.sprites.back_default,
            front: obj.sprites.front_default
        }
        this.stats = obj.stats.reduce((acc, curr) => acc.concat([{name: curr.stat.name, value: curr.base_stat}]), []);
        this.moves = obj.moves.map(r => r.move.name).slice(0,4);
        this.x = x;
        this.y = y;
    }

    _click(e){
        console.log(e);
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
        const statsString = this.stats.map(stat => `${stat.name} : ${stat.value}`).join(`\n`)
        const string = `Name: ${this.name}\n -------- \nAbility: ${this.ability.ability.name} \n${movesString} \n${statsString}`;
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