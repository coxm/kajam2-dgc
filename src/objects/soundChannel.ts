import { Constants } from '../constants';
import { MyGame } from '../index';

/**
 * Supports playing any loaded sound, making sure only one at a time is playing.
 */
export class SoundChannel {

    game: Phaser.Game;
    sounds: { [key:string]: Phaser.Sound } = {};

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    add(key: string): void {
        if (!this.sounds[key]) {
            this.sounds[key] = this.game.add.audio(key);
        }
    }

    play(key: string, loop: boolean = false): void {
        if (!Constants.DEBUG_MUTE && !(this.game as MyGame).mute) {
            this.add(key);
            for (let storedKey in this.sounds) {
                let sound: Phaser.Sound = this.sounds[storedKey];
                if (storedKey === key) {
                    sound.loop = loop;
                    sound.play();
                } else {
                    sound.stop();
                }
            }
        }
    }

    stop(key: string): void {
        let sound: Phaser.Sound | null = this.get(key);
        if (sound !== null) {
            sound.stop();
        }
    }

    stopChannel(): void {
        for (let storedKey in this.sounds) {
            this.sounds[storedKey].stop();
        }
    }

    get(key: string): Phaser.Sound | null {
        this.add(key);
        return this.sounds[key];
    }


}
