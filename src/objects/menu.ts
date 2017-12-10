import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { SoundChannel } from './soundChannel';

const OPTION_SPACING = 16;
const LEGEND_OFFSET = new Phaser.Point(20, 4);

export class Menu extends Phaser.Sprite {

    game: Phaser.Game;

    sounds: SoundChannel;

    upKey: Phaser.Key;
    downKey: Phaser.Key;
    enterKey: Phaser.Key;

    baseY: number;

    selected: number = 0;
    max: number = 0

    callback: Function;
    callbackBinding: object;

    constructor(game : Phaser.Game, x : number, y : number, options: string[], callback: Function, callbackBinding: object) {
        super(game, x, y, 'tileset', 48);

        this.game = game;
        this.baseY = y;
        this.max = options.length;
        this.callback = callback;
        this.callbackBinding = callbackBinding;

        this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
        this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
        this.enterKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);

        let i = 0;
        for (let option of options) {
            game.add.bitmapText(x + LEGEND_OFFSET.x, y + i * OPTION_SPACING + LEGEND_OFFSET.y, 'terminal', option, 11);
            i++;
        }

        this.sounds = new SoundChannel(game);

        this.refreshPosition();
    }

    update() {
        if (this.upKey.justDown) {
            this.selected = (this.selected - 1 + this.max) % this.max;
            this.refreshPosition();
            this.sounds.play('jump');
        }
        if (this.downKey.justDown) {
            this.selected = (this.selected + 1) % this.max;
            this.refreshPosition();
            this.sounds.play('jump');
        }
        if (this.enterKey.justDown) {
            this.callback.call(this.callbackBinding, this.selected);
            this.sounds.play('jump');
        }
    }

    refreshPosition() {
        this.y = this.baseY + this.selected * OPTION_SPACING;
    }


}
