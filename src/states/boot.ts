import { MyGame } from '../index';

export class Boot extends Phaser.State {
    init() {
    }

    preload() {
        // Loading screen assets
        this.load.image('loadingBarBg', 'assets/images/loading-bar-bg.png');
        this.load.image('loadingBar', 'assets/images/loading-bar.png');
        this.load.audio('ambient_boot', 'assets/audio/ambient_boot.mp3');
    }

    create() {
        let myGame: MyGame = (this.game as MyGame);
        myGame.ambientChannel.play('ambient_boot');

        this.game.input.maxPointers = 1;
        this.game.antialias = false;
        this.game.renderer.renderSession.roundPixels = true;

        if (!this.game.device.desktop) {
            this.scale.forceOrientation(true, false);
        }

        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        // prevent page from scrolling upon key presses
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.LEFT);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.RIGHT);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ENTER);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.ESC);
        this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.M);

        this.game.state.start('Loading');
    }
}
