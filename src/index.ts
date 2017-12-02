/// <reference path="../node_modules/phaser-ce/typescript/phaser.d.ts"/>

import { Boot } from './states/boot';
import { Loading } from './states/loading';
import { Game } from './states/game';
// Import additional states here

export class MyGame extends Phaser.Game {
    constructor() {
        super(600, 600);

        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('Game', Game);

        this.state.start('Boot');
    }
}

new MyGame(); // This kicks everything off
