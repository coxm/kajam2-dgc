import { Boot } from './states/boot';
import { Loading } from './states/loading';
import { AbstractState } from './states/abstract';
import { Level } from './states/level';
import { Title } from './states/title';
import { Story } from './states/story';
import { Controls } from './states/controls';
import { Ending } from './states/ending';
import { Constants } from './constants';
import { SoundChannel } from './objects/soundChannel';
import { Score } from './objects/score';

export class MyGame extends Phaser.Game {

    scaledCanvasContext: CanvasRenderingContext2D;

    scaledWidth: number = Constants.WIDTH * Constants.PIXEL_SCALING;
    scaledHeight: number = Constants.HEIGHT * Constants.PIXEL_SCALING;

    mute: boolean = false;
    muteKeyDown: boolean = false;

    musicChannel: SoundChannel;
    ambientChannel: SoundChannel;
    sfxChannel: SoundChannel;

    private _score: Score|null = null;

    constructor() {
        super(Constants.WIDTH, Constants.HEIGHT, Phaser.CANVAS, '', {
            preload: () => this.preload()
        });
        (window as any).game = this;
    }

    preload() {
        this.initSound();
        this.initCanvas();
        this.initStates();
    }

    initSound() {
        this.musicChannel = new SoundChannel(this);
        this.ambientChannel = new SoundChannel(this);
        this.sfxChannel = new SoundChannel(this);
    }

    initCanvas() {
        this.canvas.style['display'] = 'none';
        let scaledCanvas = Phaser.Canvas.create(document.getElementById('phaser') as any, this.scaledWidth, this.scaledHeight);
        this.scaledCanvasContext = scaledCanvas.getContext('2d') as CanvasRenderingContext2D;
        Phaser.Canvas.addToDOM(scaledCanvas, document.getElementById('phaser') as any);
        Phaser.Canvas.setSmoothingEnabled(this.scaledCanvasContext, false);
    }

    initStates() {
        this.state.add('Boot', Boot);
        this.state.add('Loading', Loading);
        this.state.add('Title', Title);
        this.state.add('Story', Story);
        this.state.add('Controls', Controls);
        this.state.add('Ending', Ending);

        for (let i = 1; i <= Constants.LEVEL_COUNT; ++i) {
            const level = new Level(i, this);
            this.state.add(level.name, level);
        }

        this.state.start('Boot');
    }

    get score(): Score {
        if (this._score === null) {
            this._score = new Score(this, Constants.LEVEL_COUNT, Constants.DEBUG_FORCE_SCORE || 0);
        }
        return this._score;
    }

    renderCanvas() {
        this.scaledCanvasContext.drawImage(this.canvas, 0, 0, this.width, this.height, 0, 0, this.scaledWidth, this.scaledHeight);

        if (this.input.keyboard.isDown(Phaser.Keyboard.M) && !this.muteKeyDown) {
            this.mute = !this.mute;
            this.muteKeyDown = true;
            if (this.mute) {
                this.sound.stopAll();
            } else {
                if (this.state.getCurrentState() instanceof AbstractState) {
                    (this.state.getCurrentState() as AbstractState).onUnmute();
                }
            }
        } else if (!this.input.keyboard.isDown(Phaser.Keyboard.M)) {
            this.muteKeyDown = false;
        }
    }
}

new MyGame();
