import { Player } from './player';
import { CollisionGroups } from './collisionGroups';
import { Constants } from '../constants';


/** Pickup options, loaded from an exported Tiled object. */
export interface PickupOptions {
    readonly type: string;
    readonly gid: number;
    readonly x: number;
    readonly y: number;
}


/** An object defining pickup behaviour. */
export interface Traits {
    /** Initialise the Pickup body. */
    initBody?: (
        game: Phaser.Game,
        owner: Pickup,
        body: Phaser.Physics.P2.Body
    ) => void;

    /** React to a pickup being consumed. */
    onConsumed(
        pickup: Pickup,
        consumer: Phaser.Sprite,
        defn: PickupOptions
    ): void;
}


/** A function which creates a Traits object for a new Pickup. */
type TraitsFactory =
    (game: Phaser.Game, pickup: Pickup, options: PickupOptions) => Traits;


/** All traits factories. */
export const traits: {[pickupName: string]: TraitsFactory;} = {};


export class Pickup extends Phaser.Sprite {
    readonly traits: Traits;
    private consumer: Phaser.Sprite | null = null;

    constructor(
        game: Phaser.Game,
        collisionGroups: CollisionGroups,
        readonly defn: PickupOptions
    ) {
        // Not sure why but the GID seems to be one too large.
        super(game, defn.x, defn.y, (defn.type === 'hardware') ? 'hardwareSheet' : 'tilesetSheet', defn.gid - 1);

        console.assert(!!defn.type, 'Pickup type is undefined');
        console.assert(!!traits[defn.type], 'No such pickup traits:', defn.type);
        this.traits = traits[defn.type](game, this, defn);

        // Init physics.
        game.physics.p2.enable(this, Constants.DEBUG_SHAPES);
        this.body.setCircle(4);
        this.body.debug = Constants.DEBUG_OBJECT_BODIES;
        this.body.static = true;
        this.body.collideWorldBounds = true;
        this.body.setCollisionGroup(collisionGroups.pickups);
        this.body.collides(collisionGroups.player);
        this.body.fixedRotation = true;
        this.body.damping = 0.9;
        this.body.inertia = 0;

        for (const shape of this.body.data.shapes) {
            shape.sensor = true;
        }
        if (this.traits.initBody) {
            this.traits.initBody(game, this, this.body);
        }

        // Correct the sprite & body positions.
        this.body.x += (this.width / 2) | 0;
        this.body.y -= (this.height / 2) | 0;

        this.body.onBeginContact.add(this.onBeginContact, this);
        game.world.add(this);
    }

    update(): void {
        if (this.consumer) {
            this.traits.onConsumed(this, this.consumer, this.defn);
            this.destroy();
        }

        // Animate sprite
        if (this.game) {
            let seconds = Math.floor(this.game.time.time / 1000);
            this.scale.x = (seconds % 2) === 1 ? 1 : -1;
        }
    }

    onBeginContact(other: Phaser.Physics.P2.Body | null): void {
        if (this.consumer) {
            return;
        }
        if (other && other.sprite instanceof Player) {
            this.consumer = other.sprite;
        }
    }
}
