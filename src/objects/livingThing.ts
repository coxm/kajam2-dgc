import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { SoundChannel } from './soundChannel';

export abstract class LivingThing extends Phaser.Sprite {

    private readonly OFF_LEDGE_JUMP_DELAY = 80;

    private jumpDetector: p2.Rectangle;
    private collidingFloorShapes: any[] = [];
    private fellLedgeTime: number = 0;
    private jumping: boolean = false;

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

    onLanding() {
        // Override me
    }

    protected jump(): boolean {
      if (this.canJump) {
          this.body.velocity.y = -this.getJumpSpeed();
          this.fellLedgeTime = 0;
          this.jumping = true;
          return true;
      } else {
          return false;
      }
    }

    get canJump(): boolean {
        return this.collidingFloorShapes.length > 0 || this.game.time.time - this.fellLedgeTime < this.OFF_LEDGE_JUMP_DELAY;
    }

    onBeginContact(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any, contactEqs: any[]) {
        if (shape === this.jumpDetector) {
            if (this.collidingFloorShapes.length === 0) {
                this.jumping = false;
                this.onLanding();
            }
            if (this.collidingFloorShapes.indexOf(otherShape) === -1) {
                this.collidingFloorShapes.push(otherShape);
            }
        }
    }

    onEndContact(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any) {
        if (shape === this.jumpDetector) {
            let index = this.collidingFloorShapes.indexOf(otherShape)
            if (index !== -1) {
                this.collidingFloorShapes.splice(index, 1);
            }
            if (this.collidingFloorShapes.length === 0 && !this.jumping) {
                this.fellLedgeTime = this.game.time.time;
            }
        }
    }

}
 
