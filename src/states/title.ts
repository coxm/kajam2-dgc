import { AbstractState } from './abstract';
import { Menu } from '../objects/menu';
import { SoundChannel } from '../objects/soundChannel';
import { MyGame } from '../index';

export class Title extends AbstractState {

    private myGame : MyGame;

    constructor(game: MyGame) {
        super();
        this.myGame = game;
    }

    create() {
        this.add.sprite(0, 0, 'title');

        let mapGroup = this.add.group();

        let map = this.add.tilemap('TitleScreen');
        map.addTilesetImage('tileset', 'tileset');
        for (let i = 0; i < map.layers.length; i++) {
            map.createLayer(i, undefined, undefined, mapGroup);
        }

        let menu = new Menu(this.game, 150, 172, ['Start game', 'Story', 'Controls'], this.onMenuExit, this)
        this.world.add(menu);
    }

    update() {
        let ambientChannel: SoundChannel = this.myGame.ambientChannel;
        let ambientSound: Phaser.Sound|null = ambientChannel.get(ambientChannel.lastPlayed);
        if (ambientSound !== null && !ambientSound.isPlaying) {
            this.myGame.ambientChannel.play('ambient_loop', true);
        }
        if (this.myGame.musicChannel.lastPlayed !== 'music_title') {
            this.myGame.musicChannel.play('music_title', true, 0.8);
        }
    }


    onMenuExit(selectedOption: number) {
        switch (selectedOption) {
             case 0:
                 this.state.start('Level01');
                 break;
             
             default:
                 break;
         }
    }

}
