export class CollisionGroups {
    player: Phaser.Physics.P2.CollisionGroup;
    environment: Phaser.Physics.P2.CollisionGroup;
    pickups: Phaser.Physics.P2.CollisionGroup;

    constructor(game: Phaser.Game) {
        this.player = game.physics.p2.createCollisionGroup();
        this.environment = game.physics.p2.createCollisionGroup();
        this.pickups = game.physics.p2.createCollisionGroup();
    }
}
