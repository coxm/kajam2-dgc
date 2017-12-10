import { Boot } from './states/boot';
import { Loading } from './states/loading';
import { AbstractState } from './states/abstract';
import { Level } from './states/level';
import { Title } from './states/title';
import { Constants } from './constants';

export class MyGame extends Phaser.Game {

    scaledCanvasContext: CanvasRenderingContext2D;

    scaledWidth: number = Constants.WIDTH * Constants.PIXEL_SCALING;
    scaledHeight: number = Constants.HEIGHT * Constants.PIXEL_SCALING;

    mute: boolean = false;
    muteKeyDown: boolean = false;

    constructor() {
        super(Constants.WIDTH, Constants.HEIGHT, Phaser.CANVAS, '', {
            preload: () => this.preload()
        });
        (window as any).game = this;
    }

    preload() {
        this.initCanvas();
        this.initStates();
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

        for (let i = 0; i < Constants.LEVEL_COUNT; ++i) {
            const level = new Level(i);
            this.state.add(level.name, level);
        }

        this.state.start('Boot');
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
