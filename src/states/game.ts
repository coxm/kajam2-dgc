export class Game extends Phaser.State {
    hero: Phaser.Sprite;
    walls: Phaser.Group;

    create() {
        this.stage.backgroundColor = "#ABC";

        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.gravity.y = 600;

        this.hero = this.add.sprite(this.world.centerX, this.world.centerY, 'spritesheet', 25);
        this.hero.anchor.setTo(0.5);
        this.physics.arcade.enable(this.hero);
        this.hero.body.collideWorldBounds = true;

        this.walls = this.add.group();
        for (let i = 0; i < 4; i++) {
            this.walls.add(this.createWall(i * 70 + 100, 200 + i * 70));
        }
    }

    createWall(x, y) {
        let wall = this.add.sprite(x, y, 'spritesheet', 32 * 4 + 9);
        wall.anchor.setTo(0.5);
        this.physics.arcade.enable(wall);
        wall.body.immovable = true;
        wall.body.allowGravity = false;
        return wall;
    }

    update() {
      this.physics.arcade.collide(this.hero, this.walls);

      // Movement
      const SPEED = 10;
      if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.hero.x -= SPEED;
      }
      if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.hero.x += SPEED;
      }
      if (this.input.keyboard.isDown(Phaser.Keyboard.UP) && this.hero.body.onFloor()) {
        this.hero.body.velocity.y = -1000;
      }
    }
}
