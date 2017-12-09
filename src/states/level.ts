import { Player } from '../objects/player';
import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { MyGame } from '../index';

const tilesetImage: string = 'assets/images/tiles.png';
const tilesetImageKey: string = 'basic';


const toLevelName = (id: number): string => {
    let str = 'Level';
    if (id < 10) {
        str += '0';
    }
    return str + id;
};


export class Level extends Phaser.State {
    readonly name: string;

    private tilemap: Phaser.Tilemap | null = null;
    private layer: Phaser.TilemapLayer | null = null;
    private player: Player | null = null;
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
        this.load.image(tilesetImageKey, tilesetImage);

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setBounds(0, 0, this.world.width, this.world.height);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = Constants.GRAVITY;
        this.physics.p2.world.defaultContactMaterial.friction = 0.99;
        this.physics.p2.world.setGlobalStiffness(1e5);
    }

    create(): void {
        this.stage.backgroundColor = '#FFD';

        this.collisionGroups = new CollisionGroups(this.game);

        this.tilemap = this.add.tilemap(this.name);
        this.tilemap.addTilesetImage(tilesetImageKey);
        this.tilemap.setCollisionBetween(0, 999);

        this.layer = this.tilemap.createLayer('Ground');
        this.layer.resizeWorld();
        //this.layer.wrap = true; // not working for collisions it seems
        this.layer.debug = Constants.DEBUG_SHAPES;

        let tiles: Phaser.Physics.P2.Body[] = this.physics.p2.convertTilemap(this.tilemap, this.layer);
        for (let tile of tiles) {
            tile.setCollisionGroup(this.collisionGroups.environment);
            tile.collides(this.collisionGroups.objects);
        }

        let playerSpawn: Phaser.Point = this.getPlayerSpawnPoint(this.tilemap);
        this.player = new Player(this.game, this.collisionGroups, playerSpawn.x, playerSpawn.y);
        this.camera.follow(this.player);

        this.scoreLabel = this.add.bitmapText(20, 20, 'upheaval', '0/0 parts', 20);
        this.scoreLabel.fixedToCamera = true;
        
        this.add.bitmapText(playerSpawn.x - 50, playerSpawn.y - 80, 'terminal', 'welcome to the\nwonderful world\nof Kommandant RNLF', 11);
    }

    getPlayerSpawnPoint(tilemap: Phaser.Tilemap): Phaser.Point {
        let objectLayers: any = tilemap.objects;
        let playerLayer: any[] = objectLayers["Players"];
        let playerInfo: any = playerLayer[0]; // only one object is supported for now
        return new Phaser.Point(playerInfo.x, playerInfo.y);
    }

    proceedToNextLevel(): void {
        this.game.state.start(toLevelName(this.id + 1));
    }

    render() {
        (this.game as MyGame).renderCanvas();
    }
}
