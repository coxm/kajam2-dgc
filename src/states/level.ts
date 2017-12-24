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
import { SoundChannel } from '../objects/soundChannel';

const TILESETS: {[levelId: string]: string;} = {
    'Level01': 'tileset',
    'Level02': 'tileset'
};


export const toLevelName = (id: number|string): string => {
    if (typeof id === 'number') {
        let str = 'Level';
        if (id < 10) {
            str += '0';
        }
        return str + id;
    } else {
        return id;
    }
};


const findLayer = (tilemap: Phaser.Tilemap, name: string): boolean|null => {
    for (let i = 0, len = tilemap.layers.length; i < len; ++i) {
        const layer = tilemap.layers[i];
        if (layer.name === name) {
            return layer;
        }
    }
    return null;
};


export class Level extends AbstractState {
    readonly name: string;

    private tilemap: Phaser.Tilemap | null = null;
    private layer: Phaser.TilemapLayer | null = null;
    private player: Player | null = null;
    private overlay: Phaser.TilemapLayer | null = null;
    private underlay: Phaser.TilemapLayer | null = null;
    private pickups: Pickup[] = [];
    private collisionGroups: CollisionGroups | null = null;
    private hardwarePartCount: number = 0;
    private restartKey: Phaser.Key;
    private hideGui: boolean;

    protected escapeKey: Phaser.Key;
    protected myGame : MyGame;

    constructor(readonly id: number|string, game: MyGame, hideGui: boolean = false) {
        super();
        this.name = toLevelName(id);
        this.myGame = game;
        this.hideGui = hideGui;
    }

    preload(): void {
        console.log("Starting level " + this.name);

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
        this.stage.backgroundColor = '#555';

        this.escapeKey = this.input.keyboard.addKey(Phaser.Keyboard.ESC);
        this.restartKey = this.input.keyboard.addKey(Phaser.Keyboard.R);

        this.collisionGroups = new CollisionGroups(this.game);

        this.tilemap = this.add.tilemap(this.name);
        this.tilemap.addTilesetImage(tilesetKey);
        this.tilemap.setCollisionBetween(16 * 4, 999);

        this.layer = this.tilemap.createLayer('Ground');
        this.layer.resizeWorld();
        this.layer.debug = Constants.DEBUG_SHAPES;

        let tiles: Phaser.Physics.P2.Body[] = this.physics.p2.convertTilemap(this.tilemap, this.layer);
        for (let tile of tiles) {
            tile.setCollisionGroup(this.collisionGroups.environment);
            tile.collides(this.collisionGroups.player);
            tile.debug = Constants.DEBUG_TILE_BODIES;
        }

        if (findLayer(this.tilemap, 'Underlay')) {
            this.underlay = this.tilemap.createLayer('Underlay');
        }

        let catSpawn: Phaser.Point|null = this.getSpawnPoint(this.tilemap, 'cat');
        if (catSpawn !== null) {
            this.world.add(new Cat(this.game, this.collisionGroups, catSpawn.x, catSpawn.y));
        }

        let playerSpawn: Phaser.Point|null = this.getSpawnPoint(this.tilemap, 'player');
        if (playerSpawn != null) {
            this.player = new Player(this.game, this.collisionGroups, playerSpawn.x, playerSpawn.y);
            this.world.add(this.player);
            this.camera.follow(this.player);
        }

        // Suspect the Phaser typings are out of date here.
        let objectLayers = this.tilemap.objects as any
        for (const obj of objectLayers.Pickups) {
            this.pickups.push(new Pickup(this.game, this.collisionGroups, obj));
            if (obj.type === 'hardware') this.hardwarePartCount++;
        }
        let animationFrames = [37, 38, 39, 40];
        for (const obj of objectLayers.Players) {
            if (obj.type === 'smoke') {
                let smoke = this.add.sprite(obj.x, obj.y - 16, 'tilesetSheet', 37);
                smoke.animations.add('smoke', animationFrames);
                smoke.animations.play('smoke', 10, true);
                animationFrames.push(animationFrames.shift() as number);
            }
        }
        if (objectLayers.Text) {
            for (const obj of objectLayers.Text) {
                this.addText(obj.x, obj.y, obj.type.replace(/\\n/g, '\n'));
            }
        }

        if (findLayer(this.tilemap, 'Overlay')) {
            this.overlay = this.tilemap.createLayer('Overlay');
        }

        if (!this.hideGui) {
            this.myGame.score.addToWorld(this.world);
        }
    }

    getSpawnPoint(tilemap: Phaser.Tilemap, type: string): Phaser.Point | null {
        let objectLayers: any = tilemap.objects;
        let playersLayer: any[]|null = objectLayers.Players;
        if (playersLayer != null) {
            for (let object of playersLayer) {
                if (object.type === type) {
                    return new Phaser.Point(object.x, object.y);
                }
            }
        }
        return null;
    }

    ensureAmbientSound() {
        let ambientChannel: SoundChannel = this.myGame.ambientChannel;
        let ambientSound: Phaser.Sound|null = ambientChannel.get(ambientChannel.lastPlayed);
        if (ambientSound !== null && !ambientSound.isPlaying) {
            this.myGame.ambientChannel.play('ambient_loop', true);
        }
    }

    update() {
        this.ensureAmbientSound();
        if (this.myGame.musicChannel.lastPlayed !== 'music_level') {
            this.myGame.musicChannel.play('music_level', true, 0.9);
        }
        if (this.escapeKey.justDown) {
            setTimeout((): void => { this.state.start('Title'); }, 400);
            this.myGame.sfxChannel.play('menu_confirm');
        }
        if (this.restartKey.justDown) {
            this.state.restart();
        }
    }

    proceedToNextLevel(): void {
        setTimeout(() => {
            if (typeof this.id === 'number') {
                let nextLevel = this.id + 1;
                if (nextLevel <= Constants.LEVEL_COUNT) {
                    this.game.state.start(toLevelName(nextLevel));
                } else {
                    this.game.state.start('Ending');
                }
            }
        }, 1000);
    }

    shutdown() {
        this.world.removeAll();
    }
}
