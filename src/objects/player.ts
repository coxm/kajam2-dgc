import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { SoundChannel } from './soundChannel';

const JUMP_SPEEDS: number[] = [
    80, // 0 tiles
    245, // 1
    300, // 2
    380,
    460,
    530,  // 5
    590,
    650
]

export class Player extends Phaser.Sprite {

    MOVEMENT_SPEED = 140;

    jumpLevel = 0;

    jumpDetector: p2.Rectangle;
    floorShape: any;

    canJump: boolean;
    downKeyHeld: boolean;

    soundChannel: SoundChannel;

    constructor(game : Phaser.Game, collisionGroups: CollisionGroups, x : number, y : number) {
        super(game, x, y, 'hero');

        this.anchor.setTo(0.5);

        game.physics.p2.enable(this, Constants.DEBUG_SHAPES);
        this.body.debug = Constants.DEBUG_OBJECT_BODIES;

        this.body.clearShapes();
        this.body.addShape(new p2.Rectangle(0.75, 1.5), 0, 0.5);
        this.jumpDetector = new p2.Rectangle(0.5, 0.5);
        this.jumpDetector.sensor = true;
        this.body.addShape(this.jumpDetector, 0, 16);

        this.body.collideWorldBounds = true;
        this.body.setCollisionGroup(collisionGroups.player);
        this.body.collides(collisionGroups.player);
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

    update() {
      // Movement
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
          this.body.velocity.x -= this.MOVEMENT_SPEED / 5;
          this.scale.x = -1;
      }
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
          this.body.velocity.x += this.MOVEMENT_SPEED / 5;
          this.scale.x = 1;
      }
      if (!this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT) && !this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.body.velocity.x *= 0.85;
      }
      let dx = this.body.velocity.x ||  0;
      this.body.velocity.x = dx/(Math.abs(dx) || 1) * Math.min(this.MOVEMENT_SPEED, Math.abs(dx)); // clamp

      if (this.canJump && !this.downKeyHeld && this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
          this.body.velocity.y = -this.getJumpSpeed();
          this.canJump = false;
          this.downKeyHeld = true;
          this.soundChannel.play('jump');
      }
      if (this.downKeyHeld && !this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
          this.downKeyHeld = false;
          this.body.velocity.y = Math.max(0, this.body.velocity.y);
      }
      if (!this.canJump && this.floorShape !== null && this.body.velocity.y > -1) {
          // Jumped while hitting a ceiling
          this.canJump = true;
      }
    }

    getJumpSpeed(): number {
      let effectiveJumpLevel = Math.min(this.jumpLevel, JUMP_SPEEDS.length - 1);
      return JUMP_SPEEDS[effectiveJumpLevel];
    }

    onBeginContact(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any, contectEq: any[]) {
        if (shape === this.jumpDetector) {
            this.canJump = true;
            this.floorShape = otherShape;
        }
    }

    onEndContact(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any) {
        if (shape === this.jumpDetector && otherShape === this.floorShape) {
            this.canJump = false;
            this.floorShape = null;
        }
    }

}
 
