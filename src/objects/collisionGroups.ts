export class CollisionGroups {
    objects: Phaser.Physics.P2.CollisionGroup;
    environment: Phaser.Physics.P2.CollisionGroup;

    constructor(game: Phaser.Game) {
        this.objects = game.physics.p2.createCollisionGroup();
        this.environment = game.physics.p2.createCollisionGroup();
    }
}
