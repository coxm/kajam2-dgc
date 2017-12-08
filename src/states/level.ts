const tilesetImage: string = 'assets/images/tiles.png';
const tilesetImageKey: string = 'basic';


const toLevelName = (id: number): string => {
    let str = 'Level';
    if (id < 10) {
        str += '0';
    }
    return str + id;
};


export class Level extends Phaser.State {
    readonly name: string;

    private tilemap: Phaser.Tilemap | null = null;
    private layer: Phaser.TilemapLayer | null = null;

    constructor(readonly id: number) {
        super();
        this.name = toLevelName(id);
    }

    preload(): void {
        this.load.tilemap(
            this.name,
            `assets/tilemaps/${this.name}.json`,
            undefined,
            Phaser.Tilemap.TILED_JSON
        );
        this.load.image(tilesetImageKey, tilesetImage);
    }

    create(): void {
        this.stage.backgroundColor = '#FFD';
        this.tilemap = this.add.tilemap(this.name);
        this.tilemap.addTilesetImage(tilesetImageKey);
        this.layer = this.tilemap.createLayer('Ground');
        this.layer.wrap = true;
    }

    proceedToNextLevel(): void {
        this.game.state.start(toLevelName(this.id + 1));
    }
}
