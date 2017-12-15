import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { SoundChannel } from './soundChannel';

export abstract class LivingThing extends Phaser.Sprite {

    private jumpDetector: p2.Rectangle;
    private floorShape: any;

    canJump: boolean = true;
    neverJumped: boolean = true; // hack to prevent broken jump if player tile is placed too low on the map

    soundChannel: SoundChannel;

    constructor(game : Phaser.Game, collisionGroups: CollisionGroups, x : number, y : number, sprite: string, frame?: number) {
        super(game, x, y, sprite, frame);

        this.anchor.setTo(0.5);

        game.physics.p2.enable(this, Constants.DEBUG_SHAPES);
        this.body.debug = Constants.DEBUG_OBJECT_BODIES;

        this.body.clearShapes();
        this.jumpDetector = this.initShapesAndReturnJumpDetector(this.body);

        this.body.collideWorldBounds = true;
        this.body.setCollisionGroup(collisionGroups.player);
        this.body.collides(collisionGroups.environment);
        this.body.collides(collisionGroups.pickups);
        this.body.fixedRotation = true;
        this.body.damping = 0.9;
        this.body.inertia = 0;
        this.body.mass = 0.5;

        this.body.onBeginContact.add(this.onBeginContact, this);
        this.body.onEndContact.add(this.onEndContact, this);

        this.soundChannel = new SoundChannel(game);
    }

    abstract initShapesAndReturnJumpDetector(body: p2.Body): p2.Rectangle;

    abstract getJumpSpeed(): number;

    update() {
      if (!this.canJump && this.floorShape !== null && this.body.velocity.y > -1) {
          // Jumped while hitting a ceiling
          this.canJump = true;
      }
    }

    protected jump(): boolean {
      if (this.canJump) {
          this.body.velocity.y = -this.getJumpSpeed();
          this.canJump = false;
          this.neverJumped = true;
          this.soundChannel.play('jump');
          return true;
      } else {
          return false;
      }
    }

    onBeginContact(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any, contactEqs: any[]) {
        if (shape === this.jumpDetector) {
            this.canJump = true;
            this.floorShape = otherShape;
        }
    }

    onEndContact(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any) {
        if (shape === this.jumpDetector && otherShape === this.floorShape && !this.neverJumped) {
            this.canJump = false;
            this.floorShape = null;
        }
    }

}
 
