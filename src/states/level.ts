import { Player } from '../objects/player';
import { Pickup } from '../objects/pickup';
import '../objects/health';
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


export class Level extends AbstractState {
    readonly name: string;

    private tilemap: Phaser.Tilemap | null = null;
    private layer: Phaser.TilemapLayer | null = null;
    private player: Player | null = null;
    private pickups: Pickup[] = [];
    private collisionGroups: CollisionGroups | null = null;
    private scoreLabel: Phaser.BitmapText | null = null;

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
        else this.tilemap.setCollisionBetween(16, 999);

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

        let playerSpawn: Phaser.Point = this.getPlayerSpawnPoint(this.tilemap);
        this.player = new Player(this.game, this.collisionGroups, playerSpawn.x, playerSpawn.y);
        this.world.add(this.player);
        this.camera.follow(this.player);
        // Suspect the Phaser typings are out of date here.
        for (const obj of (this.tilemap.objects as any).Pickups) {
            this.pickups.push(new Pickup(this.game, this.collisionGroups, obj));
        }

        this.scoreLabel = this.add.bitmapText(20, 20, 'upheaval', '0/0 parts', 20);
        this.scoreLabel.fixedToCamera = true;

        this.add.bitmapText(playerSpawn.x - 50, playerSpawn.y - 80, 'terminal', 'welcome to the\nwonderful world\nof Kommandant RNLF', 11);
    }

    getPlayerSpawnPoint(tilemap: Phaser.Tilemap): Phaser.Point {
        let objectLayers: any = tilemap.objects;
        let playerLayer: any[] = objectLayers.Players;
        let playerInfo: any = playerLayer[0]; // only one object is supported for now
        return new Phaser.Point(playerInfo.x, playerInfo.y);
    }

    proceedToNextLevel(): void {
        this.game.state.start(toLevelName(this.id + 1));
    }
}
