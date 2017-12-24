export class Pogometer {
    private count: number = 0;
    private group: Phaser.Group;
    private missing: Phaser.Image[] = [];
    private obtained: Phaser.Image[] = [];

    constructor(game: Phaser.Game, x: number, y: number, numPogos: number) {
        this.group = game.add.group();
        this.group.alpha = 0.6;
        this.group.fixedToCamera = true;
        const yIncrement: number = Math.min((200 / numPogos) | 0, 32);
        y += (numPogos - 1) * yIncrement;
        for (let i = 0; i < numPogos; ++i, y -= yIncrement) {
            this.obtained.push(game.make.sprite(x, y, 'tilesetSheet', 50));
            this.missing.push(
                game.add.sprite(x, y, 'tilesetSheet', 51, this.group));
        }
    }

    add(): void {
        this.group.add(this.obtained[this.count]);
        this.group.remove(this.missing[this.count]);
        ++this.count;
    }
}
