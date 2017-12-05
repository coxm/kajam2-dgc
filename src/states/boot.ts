export class Boot extends Phaser.State {
    fontLoaded: boolean = false;

    init() {
        // Create the object expected by webfont below
        window['WebFontConfig'] = {
            active: () => this.fontLoaded = true,
            google: { families: ['Walter Turncoat'] }
        };
    }

    preload() {
        // The loading state needs the webfont and loading bar images
        this.load.script('webfont',
            '//ajax.googleapis.com/ajax/libs/webfont/1/webfont.js');

        this.load.image('loadingBarBg', 'assets/images/loading-bar-bg.png');
        this.load.image('loadingBar', 'assets/images/loading-bar.png');

        this.load.spritesheet('spritesheet', 'assets/images/spritesheet.png', 128, 128, -1, 0, 2);
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
    }

    update() {
        if (this.fontLoaded) {
            this.game.state.start('Loading');
        }
    }
}
