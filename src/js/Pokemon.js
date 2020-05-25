export default class Pokemon {
    constructor(obj, x, y){
        this.id = obj.id;
        this.name = obj.name;
        this.ability = obj.abilities.find(r => r.is_hidden);
        this.sprites = {
            back: obj.sprites.back_default,
            front: obj.sprites.front_default
        }
        this.stats = obj.stats.reduce((acc, curr) => acc.concat([{name: curr.stat.name, value: curr.base_stat}]), []);
        this.moves = obj.moves.map(r => r.move.name).slice(0,4);
        this.x = x;
        this.y = y;
    }

    pokemonSprite(PIXI) {
        let sprite = PIXI.Sprite.fromImage(this.sprites.front);
        sprite.x = this.x;
        sprite.y = this.y;
        return sprite;
    }


}