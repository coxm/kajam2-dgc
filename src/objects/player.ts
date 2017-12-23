import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { LivingThing } from './livingThing';

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

export class Player extends LivingThing {

    MOVEMENT_SPEED = 140;

    jumpLevel = 0;
    downKeyHeld: boolean = false;

    constructor(game : Phaser.Game, collisionGroups: CollisionGroups, x : number, y : number) {
        super(game, collisionGroups, x, y, 'hero');
    }

    update() {
      super.update();

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
          if (this.jump()) {
              this.soundChannel.play('jump');
          }
          this.downKeyHeld = true;
      }
      if (this.downKeyHeld && !this.game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
          this.downKeyHeld = false;
          this.body.velocity.y = Math.max(0, this.body.velocity.y);
      }
    }

    initShapesAndReturnJumpDetector(body: p2.Body): p2.Rectangle {
        this.body.addShape(new p2.Rectangle(0.75, 1.5), 0, 0.5);
        let jumpDetector = new p2.Rectangle(0.5, 0.5);
        jumpDetector.sensor = true;
        this.body.addShape(jumpDetector, 0, 16);
        return jumpDetector;
    }

    getJumpSpeed(): number {
      let effectiveJumpLevel = Math.min(this.jumpLevel, JUMP_SPEEDS.length - 1);
      return JUMP_SPEEDS[effectiveJumpLevel];
    }

    onLanding() {
        this.soundChannel.play('land', false, 0.5);
    }

}
 
