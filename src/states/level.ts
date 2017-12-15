import { Player } from '../objects/player';
import { Pickup } from '../objects/pickup';
import { Cat } from '../objects/cat';
import '../objects/health';
import '../objects/hardware';
import '../objects/pogo';
import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { MyGame } from '../index';
import { AbstractState } from './abstract';

const TILESETS: any = {
    'Level01': 'basic',
    'Level02': 'tileset'
};


const toLevelName = (id: number): string => {
    let str = 'Level';
    if (id < 10) {
        str += '0';
    }
    return str + id;
};


export class Score {
    constructor(
        public label: Phaser.BitmapText | null = null,
        private _max: number = 0,
        private _val: number = 0
    ) {
        this.updateText();
    }

    get max(): number {
        return this._max;
    }

    set max(m: number) {
        this._max = m;
        this.updateText();
    }

    get value(): number {
        return this._val;
    }

    set value(v: number) {
        this._val = v;
        this.updateText();
    }

    private updateText(): void {
        if (this.label) {
            this.label.text = `${this._val}/${this._max} parts`;
        }
    }
}


export class Level extends AbstractState {
    readonly name: string;
    readonly score = new Score();

    private tilemap: Phaser.Tilemap | null = null;
    private layer: Phaser.TilemapLayer | null = null;
    private player: Player | null = null;
    private pickups: Pickup[] = [];
    private collisionGroups: CollisionGroups | null = null;
    private hardwarePartCount: number = 0;

    constructor(readonly id: number) {
        super();
        this.name = toLevelName(id);
    }

    preload(): void {
        this.load.tilemap(
            this.name,
            `assets/tilemaps/${this.name}.json`,
            undefined,
            Phaser.Tilemap.TILED_JSON
        );

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setBounds(0, 0, this.world.width, this.world.height);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = Constants.GRAVITY;
        this.physics.p2.world.defaultContactMaterial.friction = 0;
        this.physics.p2.world.setGlobalStiffness(1e5);
    }

    create(): void {
        let tilesetKey = TILESETS[this.name] || 'tileset';
        this.stage.backgroundColor = (tilesetKey === 'basic') ? '#FFD' : '#555';

        this.collisionGroups = new CollisionGroups(this.game);

        this.tilemap = this.add.tilemap(this.name);
        this.tilemap.addTilesetImage(tilesetKey);
        if (tilesetKey === 'basic') this.tilemap.setCollisionBetween(0, 999);
        else this.tilemap.setCollisionBetween(16 * 4, 999);

        this.layer = this.tilemap.createLayer('Ground');
        this.layer.resizeWorld();
        //this.layer.wrap = true; // not working for collisions it seems
        this.layer.debug = Constants.DEBUG_SHAPES;

        let tiles: Phaser.Physics.P2.Body[] = this.physics.p2.convertTilemap(this.tilemap, this.layer);
        for (let tile of tiles) {
            tile.setCollisionGroup(this.collisionGroups.environment);
            tile.collides(this.collisionGroups.player);
            tile.debug = Constants.DEBUG_TILE_BODIES;
        }

        let catSpawn: Phaser.Point|null = this.getSpawnPoint(this.tilemap, 'cat');
        if (catSpawn !== null) {
            this.world.add(new Cat(this.game, this.collisionGroups, catSpawn.x, catSpawn.y));
        }

        let playerSpawn: Phaser.Point = this.getSpawnPoint(this.tilemap, 'player') || new Phaser.Point();
        this.player = new Player(this.game, this.collisionGroups, playerSpawn.x, playerSpawn.y);
        this.world.add(this.player);
        this.camera.follow(this.player);

        // Suspect the Phaser typings are out of date here.
        for (const obj of (this.tilemap.objects as any).Pickups) {
            this.pickups.push(new Pickup(this.game, this.collisionGroups, obj));
            if (obj.type === 'hardware') this.hardwarePartCount++;
        }

        this.score.label = this.add.bitmapText(20, 20, 'upheaval', '', 20);
        this.score.label.fixedToCamera = true;
        this.score.max = this.hardwarePartCount;

     //   this.add.bitmapText(playerSpawn.x - 50, playerSpawn.y - 80, 'terminal', 'welcome to the\nwonderful world\nof Kommandant RNLF', 11);
    }

    getSpawnPoint(tilemap: Phaser.Tilemap, type: string): Phaser.Point | null {
        let objectLayers: any = tilemap.objects;
        let playersLayer: any[] = objectLayers.Players;
        for (let object of playersLayer) {
            if (object.type === type) {
                return new Phaser.Point(object.x, object.y);
            }
        }
        return null;
    }

    proceedToNextLevel(): void {
        this.game.state.start(toLevelName(this.id + 1));
    }
}
