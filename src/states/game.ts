export class Game extends Phaser.State {
    hero: Phaser.Sprite;
    walls: Phaser.Group;
    objectCollisionGroup: Phaser.Physics.P2.CollisionGroup;
    environmentCollisionGroup: Phaser.Physics.P2.CollisionGroup;

    create() {
        this.stage.backgroundColor = "#ABC";

        this.physics.startSystem(Phaser.Physics.P2JS);
        this.physics.p2.setBounds(0, 0, this.world.width, this.world.height);
        this.physics.p2.setImpactEvents(true);
        this.physics.p2.gravity.x = 0;
        this.physics.p2.gravity.y = 1000;

        this.objectCollisionGroup = this.physics.p2.createCollisionGroup();
        this.environmentCollisionGroup = this.physics.p2.createCollisionGroup();

        this.hero = this.add.sprite(this.world.centerX, 100, 'spritesheet', 25);
        this.hero.anchor.setTo(0.5);
        this.physics.p2.enable(this.hero);
        this.physics.p2.setCollisionGroup(this.hero, this.objectCollisionGroup);
        this.hero.body.collideWorldBounds = true;
        this.hero.body.fixedRotation = true;
        this.hero.body.collides(this.objectCollisionGroup);
        this.hero.body.collides(this.environmentCollisionGroup);

        this.walls = this.add.group();
        for (let i = 0; i < 7; i++) {
            this.walls.add(this.createWall(i * 70 + 100, 200 + i * 70));
        }
    }

    createWall(x: number, y: number): Phaser.Sprite {
        let wall = this.add.sprite(x, y, 'spritesheet', 32 * 4 + 9);
        wall.anchor.setTo(0.5);
        this.physics.p2.enable(wall);
        this.physics.p2.setCollisionGroup(wall, this.environmentCollisionGroup);
        wall.body.collides(this.objectCollisionGroup);
        wall.body.static = true;
        return wall;
    }

    update() {
      // Movement
      const SPEED = 10;
      if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.hero.x -= SPEED;
      }
      if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.hero.x += SPEED;
      }
      if (this.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.hero.body.velocity.y = -400;
      }
    }
}
