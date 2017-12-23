import { Level, toLevelName } from './Level';
import { Menu } from '../objects/menu';
import { SoundChannel } from '../objects/soundChannel';
import { MyGame } from '../index';
import { Constants } from '../constants';

export class Title extends Level {

    logo: Phaser.Sprite;
    musicStartTime: number = 0;
    showContinueOption: boolean;

    constructor(game: MyGame) {
        super('TitleScreen', game, true);
    }

    create() {
        super.create();

        this.showContinueOption = this.myGame.score.value > 0;

        this.logo = this.add.sprite(0, 0, 'title');

        let options = ['Start game', 'Story', 'Controls'];
        if (this.showContinueOption) {
            options.splice(0, 1, 'Continue game', 'Restart game');
        }
        let menu = new Menu(this.game, 100, 160, options, this.onMenuExit, this)
        this.world.add(menu);

        this.addText(104, 215, '(please use UP/DOWN and ENTER)', true);
    }

    update() {
        let ambientChannel: SoundChannel = this.myGame.ambientChannel;
        let ambientSound: Phaser.Sound|null = ambientChannel.get(ambientChannel.lastPlayed);
        if (ambientSound !== null && !ambientSound.isPlaying) {
            this.myGame.ambientChannel.play('ambient_loop', true);
        }
        if (this.myGame.musicChannel.lastPlayed !== 'music_title') {
            this.myGame.musicChannel.play('music_title', true, 0.8);
            this.musicStartTime = this.game.time.time;
        }

        // Animate logo
        this.logo.y = -8./*px*/ * (((this.game.time.time - this.musicStartTime) * 129/*bpm*/ / 60) % 1000) / 1000;
    }


    onMenuExit(selectedOption: number) {
        if (!this.showContinueOption) {
            selectedOption++;
        }

        switch (selectedOption) {
             case 0: // Continue game
                 let levelId = Math.min(this.myGame.score.value + 1, Constants.LEVEL_COUNT);
                 this.state.start(toLevelName(levelId));
                 break;

             case 1: // Start game
                 this.myGame.score.value = 0;
                 this.state.start('Level01');
                 break;

             default:
                 break;
         }
    }

}
