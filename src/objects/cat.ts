import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';
import { SoundChannel } from './soundChannel';
import { LivingThing } from './livingThing';

export class Cat extends LivingThing {

    direction: number = 1;
    nextJump: number = 0;

    constructor(game : Phaser.Game, collisionGroups: CollisionGroups, x : number, y : number) {
        super(game, collisionGroups, x, y, 'tilesetSheet', 65);

        this.body.onBeginContact.add(this.detectWall, this);
    }

    initShapesAndReturnJumpDetector(body: p2.Body): p2.Rectangle {
        this.body.addShape(new p2.Circle(0.375), 0, 0.5);
        let jumpDetector = new p2.Rectangle(0.5, 0.5);
        jumpDetector.sensor = true;
        this.body.addShape(jumpDetector, 0, 8);
        return jumpDetector;
    }

    detectWall(body: Phaser.Physics.P2.Body, otherBody: Phaser.Physics.P2.Body, shape: any, otherShape: any, contactEqs: any[]) {
        for (let eq of contactEqs) {
            let normal = (eq as any).normalA;
            if (normal && normal[0] !== 0) {
                this.direction *= -1;
                break;
            }
        }
    }

    update() {
        this.scale.x = - this.body.velocity.x / (Math.abs(this.body.velocity.x) || 1);

        this.nextJump -= this.game.time.elapsed / 1000;
        if (this.nextJump < 0) {
            if (this.jump()) {
                this.soundChannel.play('jump_cat', false, 0.4);
            }
            this.nextJump = Math.random();
        }
        this.body.velocity.x = this.direction * 50;
    }

    getJumpSpeed(): number {
        return 200;
    }

}
