 import { Constants } from '../constants';

export class Score  {

    private background: Phaser.Image;
    private label: Phaser.BitmapText;
    private hardware: Phaser.Image[] = [];
    private hardwareMissing: Phaser.Image[] = [];

    constructor(
        game: Phaser.Game,
        private _max: number = 0,
        private _val: number = 0
    ) {
        this.background = game.make.image(3, 3, 'hud');
        this.background.fixedToCamera = true;

        this.label = game.make.bitmapText(11, 1, 'upheaval', '', 20);
        this.label.fixedToCamera = true;

        for (let i = 0; i < 5; i++) {
            let sprite = game.make.image(11 + i * 37, 25, 'hardwareMissingSheet', i);
            sprite.fixedToCamera = true;
            this.hardware.push(sprite);
        }

        this.refresh();
    }

    get max(): number {
        return this._max;
    }

    set max(m: number) {
        this._max = m;
        this.refresh();
    }

    get value(): number {
        return this._val;
    }

    set value(v: number) {
        this._val = v;
        this.refresh();
    }

    addToWorld(world: Phaser.World) {
        world.add(this.background);
        world.add(this.label);
        for (let sprite of this.hardware) {
            world.add(sprite);
        }
        for (let sprite of this.hardwareMissing) {
            world.add(sprite);
        }
    }

    private refresh(): void {
       this.label.text = `${this._val}/${this._max} parts`;
       for (let i = 0; i < this.hardware.length; i++) {
           let tex = (this._val > i) ? 'hardwareSheet' : 'hardwareMissingSheet';
           this.hardware[i].loadTexture(tex, this.hardware[i].frame);
       }
    }
}
