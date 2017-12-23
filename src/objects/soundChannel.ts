import { Constants } from '../constants';
import { MyGame } from '../index';

/**
 * Supports playing any loaded sound, making sure only one at a time is playing.
 */
export class SoundChannel {

    game: Phaser.Game;
    sounds: { [key:string]: Phaser.Sound } = {};
    lastPlayed: string|null = null;

    constructor(game: Phaser.Game) {
        this.game = game;
    }

    add(key: string): void {
        if (!this.sounds[key]) {
            this.sounds[key] = this.game.add.audio(key);
        }
    }

    play(key: string, loop: boolean = false, volume: number = 1): void {
        if (!Constants.DEBUG_MUTE && !(this.game as MyGame).mute) {
            this.add(key);
            for (let storedKey in this.sounds) {
                let sound: Phaser.Sound = this.sounds[storedKey];
                if (storedKey === key) {
                    sound.loop = loop;
                    sound.play(undefined, undefined, volume);
                    this.lastPlayed = key;
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
        if (key === this.lastPlayed) {
            this.lastPlayed = null;
        }
    }

    stopChannel(): void {
        for (let storedKey in this.sounds) {
            this.sounds[storedKey].stop();
        }
        this.lastPlayed = null;
    }

    get(key: string|null): Phaser.Sound | null {
        if (key !== null) {
            this.add(key);
            return this.sounds[key];
        } else {
            return null;
        }
    }

}
