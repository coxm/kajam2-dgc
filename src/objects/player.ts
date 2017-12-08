import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';

export class Player extends Phaser.Sprite {

    SPEED = 400;
    JUMP_SPEED = 650;

    jumpDetector: p2.Rectangle;
    floorShape: any;

    canJump: boolean;

    constructor(game : Phaser.Game, collisionGroups: CollisionGroups, x : number, y : number) {
        super(game, x, y, 'spritesheet', 25);

        this.anchor.setTo(0.5);

        game.physics.p2.enable(this, Constants.DEBUG_SHAPES);

        this.body.setCircle(48);
        this.body.offset = new Phaser.Point(0, -16);
        this.body.addShape(new p2.Rectangle(3, 1), 0, 40);
        this.jumpDetector = new p2.Rectangle(0.5, 1);
        this.jumpDetector.sensor = true;
        this.body.addShape(this.jumpDetector, 0, 46);

        this.body.collideWorldBounds = true;
        this.body.setCollisionGroup(collisionGroups.objects);
        this.body.collides(collisionGroups.objects);
        this.body.collides(collisionGroups.environment);
        this.body.fixedRotation = true;
        this.body.damping = 0.9;
        this.body.inertia = 0;

        this.body.onBeginContact.add(this.onBeginContact, this);
        this.body.onEndContact.add(this.onEndContact, this);

        game.world.add(this);
    }

    update() {
      // Movement
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
          this.body.velocity.x = -this.SPEED;
      }
      if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
          this.body.velocity.x = this.SPEED;
      }

      if (this.canJump && this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
          this.body.velocity.y = -this.JUMP_SPEED;
          this.canJump = false;
      }
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
 
