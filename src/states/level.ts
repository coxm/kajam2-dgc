import { Player } from '../objects/player';
import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';

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
        this.layer.wrap = true;
        this.layer.debug = Constants.DEBUG_SHAPES;

        let tiles: Phaser.Physics.P2.Body[] = this.physics.p2.convertTilemap(this.tilemap, this.layer);
        for (let tile of tiles) {
            tile.setCollisionGroup(this.collisionGroups.environment);
            tile.collides(this.collisionGroups.objects);
        }

        this.player = new Player(this.game, this.collisionGroups, this.world.centerX, 100);
        this.game.camera.follow(this.player);

    }

    proceedToNextLevel(): void {
        this.game.state.start(toLevelName(this.id + 1));
    }
}
