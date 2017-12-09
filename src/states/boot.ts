export class Boot extends Phaser.State {
    init() {
    }

    preload() {
        this.load.image('loadingBarBg', 'assets/images/loading-bar-bg.png');
        this.load.image('loadingBar', 'assets/images/loading-bar.png');

        this.load.spritesheet('tiles', 'assets/images/tiles.png', 32, 32);
    }

    create() {
        this.game.input.maxPointers = 1;
        this.game.antialias = false;

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

        //this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL; // Use max screen space
        this.game.state.start('Loading');
    }
}
