export class Game extends Phaser.State {
    hero: Phaser.Sprite;

    create() {
        this.stage.backgroundColor = "#ABC";

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.hero = this.add.sprite(this.world.centerX, this.world.centerY, 'spritesheet', 25);
        this.hero.anchor.setTo(0.5);
        this.physics.arcade.enable(this.hero);
        this.hero.body.collideWorldBounds = true;
        this.hero.body.gravity.set(0, 500);
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
        this.hero.body.velocity.y = -1000; // Terrible jump implementation that doesn't even check for the floor
      }
    }
}
