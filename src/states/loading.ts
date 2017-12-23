import { MyGame } from '../index';
import { Constants } from '../constants';
import { AbstractState } from './abstract';

export class Loading extends AbstractState {
    ready: boolean = false;

    readonly SOUNDS: string[] = [
        'ambient_loop',
        'item',
        'jump',
        'jump_cat',
        'land',
        'menu_change',
        'menu_confirm',
        'music_level',
        'music_title',
        'super_item',
        'walk'
    ];

    private message = {
        text: null as Phaser.Text | null,
        lastChanged: Date.now(),
        frameDuration: 512,
        spinners: '-/|\\',
        index: 0,
        update(): void {
            const now = Date.now();
            if (now < this.lastChanged + this.frameDuration) {
                return;
            }
            this.index = (this.index + 1) % this.spinners.length;
            this.text!.text = 'Loading... ' + this.spinners[this.index];
            this.lastChanged = now;
        },
    };

    create() {
        this.message.text = this.add.text(
            this.world.centerX - 30,
            this.world.centerY - 30,
            'Loading...',
            {
                font: '11px Terminal',
                fill: '#fff',
                fontWeight: 'bold',
            }
        );
        // Anchor from the left so it doesn't move when the spinner changes.
        this.message.text.anchor.setTo(0);
        this.stage.backgroundColor = '0x00f';

        this.game.load.bitmapFont('terminal', 'assets/images/terminal11_0.png', 'assets/images/terminal11.fnt');
        this.game.load.bitmapFont('terminal_light', 'assets/images/terminal11light_0.png', 'assets/images/terminal11.fnt');
        this.game.load.bitmapFont('upheaval', 'assets/images/upheaval20_0.png', 'assets/images/upheaval20.fnt');

        this.game.load.image('example', 'assets/images/loading-bar.png');
        this.game.load.image('title', 'assets/images/title.png');
        this.game.load.image('tileset', 'assets/images/tileset.png');
        this.game.load.image('hero', 'assets/images/hero.png');

        this.game.load.spritesheet('tilesetSheet', 'assets/images/tileset.png', 16, 16);
        this.game.load.spritesheet('hardwareSheet', 'assets/images/hardware.png', 32, 32);

        for (let soundName of this.SOUNDS) {
            this.game.load.audio(soundName, ['assets/audio/' + soundName + '.ogg', 'assets/audio/' + soundName + '.mp3']);
        }

        this.game.load.tilemap('TitleScreen', 'assets/tilemaps/TitleScreen.json', null, Phaser.Tilemap.TILED_JSON);

        this.game.load.onFileComplete.add(this.fileComplete, this);

        this.game.load.start();
    }

    update() {
        this.message.update();

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
        if (progress === 100) {
            // Nothing says retro like slow loading.
            setTimeout((): void => { this.ready = true; }, Constants.DEBUG_FAST_LOADING ? 0 : 5000);
        }
    }
}
