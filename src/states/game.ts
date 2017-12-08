import { Player } from '../objects/player';
import { CollisionGroups } from '../objects/collisionGroups';
import { Constants } from '../constants';

export class Game extends Phaser.State {
    player: Player;
    walls: Phaser.Group;
    collisionGroups: CollisionGroups;

    create() {
        this.initPhysics();
        this.initWorld();
    }

    initPhysics() {

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setBounds(0, 0, this.world.width, this.world.height);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.y = Constants.GRAVITY;
        this.physics.p2.world.defaultContactMaterial.friction = 0.99;
        this.physics.p2.world.setGlobalStiffness(1e5);
    }

    initWorld() {
        this.stage.backgroundColor = "#ABC";

        this.collisionGroups = new CollisionGroups(this.game);
        this.player = new Player(this.game, this.collisionGroups, this.world.centerX, 100);

        // Placeholder map
        this.walls = this.add.group();
        for (let i = 0; i < 7; i++) {
            this.walls.add(this.createWall(i * 90 + 100, 200 + i * 70));
        }
    }

    createWall(x, y) {
        let wall = this.add.sprite(x, y, 'spritesheet', 32 * 4 + 9);
        wall.anchor.setTo(0.5);
        this.physics.p2.enable(wall, Constants.DEBUG_SHAPES);
        this.physics.p2.setCollisionGroup(wall, this.collisionGroups.environment);
        wall.body.collides(this.collisionGroups.objects);
        wall.body.static = true;
        return wall;
    }
}
