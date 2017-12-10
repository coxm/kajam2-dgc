import { Constants } from '../constants';

export class SoundChannel {

    game: Phaser.Game;
    sounds: { [key:string]: Phaser.Sound } = {};

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    addSound(key: string) {
        if (!this.sounds[key]) {
            this.sounds[key] = this.game.add.audio(key);
        }
    }

    play(key: string) {
        if (!Constants.DEBUG_MUTE) {
            this.addSound(key);
            for (let storedKey in this.sounds) {
                let sound: Phaser.Sound = this.sounds[key];
                if (storedKey === key) {
                    sound.play();
                } else {
                    sound.stop();
                }
            }
        }
    }


}
