export class Game extends Phaser.State {
    score: number;
    scoreLabel: Phaser.Text;
    bonuses: Phaser.Sprite[];
    nextBonus: number;
    bonusGroup: Phaser.Group;
    burglar: Phaser.Sprite;
    gameOver: Boolean = false;
    fontStyle;

    create() {
        this.stage.backgroundColor = "#FFD";

        this.physics.startSystem(Phaser.Physics.ARCADE);

        this.bonusGroup = this.add.group();
        this.bonuses = [];
        this.nextBonus = 0;

        this.fontStyle = {
            font: '64px Walter Turncoat',
            fill: '#300'
        };
        this.scoreLabel = this.add.text(this.world.centerX, 50, '0', this.fontStyle);
        this.scoreLabel.anchor.setTo(0.5);
        this.scoreLabel.z = 10;
        this.score = 0;

        this.burglar = this.add.sprite(this.world.centerX, 520, 'burglar', 0);
        this.burglar.anchor.setTo(0.5);
        this.burglar.animations.add('walk');
        this.burglar.animations.play('walk', 7, true);
        this.physics.arcade.enable(this.burglar);
        this.burglar.body.collideWorldBounds = true;
    }

    createBonus() {
      let x = this.world.centerX + (Math.floor(Math.random() * 3) - 1) * 150;
      let type = Math.floor(Math.random() * 4);
      let sprite;
      switch (type) {
        case 0: sprite = 'gold1'; break;
        case 1: sprite = 'gold2'; break;
        case 2: sprite = 'gold3'; break;
        case 3: sprite = 'police'; break;
      }

      let bonus = this.make.sprite(x, -40, sprite);
      this.physics.arcade.enable(bonus);

      bonus.anchor.setTo(0.5);
      bonus.z = -1;
      this.bonusGroup.add(bonus);
      this.bonuses.push(bonus);
    }

    onOverlap(obj1, obj2) {
      let item = (obj1.key === 'burglar') ? obj2 : obj1;
      if (item.key === 'police') {
        obj2.kill();
        this.gameOver = true;
        let gameOverLabel = this.add.text(this.world.centerX, this.world.centerY, 'you ded', this.fontStyle);
        gameOverLabel.anchor.setTo(0.5);
      } else {
        obj1.kill();
        this.score += 100 * parseInt(item.key.replace('gold', ''));
      }
    }

    update() {
      if (this.gameOver) return;

      this.scoreLabel.text = this.score.toString();

      // Bonus movement
      for (let bonus of this.bonuses) {
        const BONUS_SPEED = 4;
        bonus.y += BONUS_SPEED;
        if (bonus.y > 800) {
          this.bonuses.splice(this.bonuses.indexOf(bonus), 1);
          bonus.destroy();
        }
        this.physics.arcade.overlap(bonus, this.burglar, this.onOverlap, undefined, this);
      }

      // Bonus spawn
      if (this.nextBonus < 0) {
        this.nextBonus += 1000 - this.score;
        this.createBonus();
      } else {
        this.nextBonus -= this.time.elapsedMS;
      }

      // Movement
      const SPEED = 10;
      if (this.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.burglar.x -= SPEED;
      }
      if (this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.burglar.x += SPEED;
      }
    }
}
