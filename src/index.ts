import { Boot } from './states/boot';
import { Loading } from './states/loading';
import { Game } from './states/game';
import { Level } from './states/level';
import { Constants } from './constants';

export class MyGame extends Phaser.Game {
    constructor() {
        super(900, 600);

        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('Game', Game);

        for (let i = 0; i < Constants.LEVEL_COUNT; ++i) {
            const level = new Level(i);
            this.state.add(level.name, level);
        }

        (window as any).game = this;

        this.state.start('Boot');
    }
}

new MyGame(); // This kicks everything off
