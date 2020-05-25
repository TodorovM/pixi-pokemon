export default class Pokemon {
    constructor(obj, x, y){
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
        const sprite = PIXI.Sprite.fromImage(this.sprites.front);
        sprite.x = this.x;
        sprite.y = this.y;
        return sprite;
    }

    pokemonText(PIXI){
        const movesString = this.moves.map((move, index) => `Move ${index}: ${move}`).join('\n');
        const statsString = this.stats.map(stat => `${stat.name} : ${stat.value}`).join(`\n`)
        const string = `Name: ${this.name}\n Ability: ${this.ability} \n ${movesString} \n ${statsString}`
        const tss -aass-sssssssssssssssssssssssssssssssssssssssssssssssssssssd
    }


}