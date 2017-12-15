import { MyGame } from '../index';
import { Constants } from '../constants';
import { AbstractState } from './abstract';

export class Loading extends AbstractState {
    ready: boolean = false;

    loadingText: Phaser.Text;

    create() {
        let fontStyle = {
            font: '18px Walter Turncoat',
            fill: '#7edcfc'
        };

        let loadingBarBg = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'loadingBarBg');
        loadingBarBg.tint = 0x7edcfc;
        loadingBarBg.anchor.setTo(0.5);

        let loadingBar = this.game.add.sprite(this.game.world.centerX - 175, this.game.world.centerY - 16, 'loadingBar');
        loadingBar.tint = 0xdcfc7e;

        this.load.setPreloadSprite(loadingBar);

        this.loadingText = this.add.text(this.world.centerX, this.world.centerY - 30, 'Loading...', fontStyle);
        this.loadingText.anchor.setTo(0.5);

        this.game.load.bitmapFont('terminal', 'assets/images/terminal11_0.png', 'assets/images/terminal11.fnt');
        this.game.load.bitmapFont('upheaval', 'assets/images/upheaval20_0.png', 'assets/images/upheaval20.fnt');

        this.game.load.image('example', 'assets/images/loading-bar.png');
        this.game.load.image('title', 'assets/images/title.png');
        this.game.load.image('basic', 'assets/images/tiles.png');
        this.game.load.image('tileset', 'assets/images/tileset.png');
        this.game.load.image('hero', 'assets/images/hero.png');

        this.game.load.spritesheet('tilesetSheet', 'assets/images/tileset.png', 16, 16);
        this.game.load.spritesheet('hardwareSheet', 'assets/images/hardware.png', 32, 32);

        this.game.load.audio('jump', 'assets/audio/jump.wav');

        this.game.load.tilemap('TitleScreen', 'assets/tilemaps/TitleScreen.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.game.load.start();
    }

    update() {
        if (this.ready) {
            if (Constants.DEBUG_FORCE_LEVEL) {
                console.log("Debug: loading level " + Constants.DEBUG_FORCE_LEVEL)
                this.game.state.start(Constants.DEBUG_FORCE_LEVEL);
            } else if (Constants.DEBUG_SKIP_TITLE) {
                this.game.state.start('Level00');
            } else {
                this.game.state.start('Title');
            }
        }
    }

    fileComplete(
        progress: number|string,
        cacheKey: string,
        success: boolean,
        totalLoaded: number,
        totalFiles: number
    ) {
        this.loadingText.setText('Loading... ' + progress + '%');

        if (progress === 100) {
            this.ready = true;
        }
    }
}
