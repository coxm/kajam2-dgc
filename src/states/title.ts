import { Level, toLevelName } from './level';
import { Menu } from '../objects/menu';
import { SoundChannel } from '../objects/soundChannel';
import { MyGame } from '../index';
import { Constants } from '../constants';

export class Title extends Level {

    private logo: Phaser.Sprite;
    private musicStartTime: number = 0;
    private delKey: Phaser.Key;

    constructor(game: MyGame) {
        super('TitleScreen', game, true);
    }

    create() {
        super.create();

        this.delKey = this.input.keyboard.addKey(Phaser.KeyCode.DELETE);

        this.logo = this.add.sprite(0, 0, 'title');

        let options = ['Start game', 'Story', 'Controls', 'Credits'];
        if (this.myGame.score.value === 0) {
            this.addText(104, 215, '(please use UP/DOWN and ENTER)', 'light');
        } else {
            this.addText(104, 215, '(press DEL to reset your save)', 'light');
            options[0] = 'Continue game';
        }

        let menu = new Menu(this.game, 100, 158, options, this.onMenuExit, this)
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
            this.musicStartTime = this.game.time.time;
        }

        // Animate logo
        this.logo.y = -8./*px*/ * (((this.game.time.time - this.musicStartTime) * 129/*bpm*/ / 60) % 1000) / 1000;

        if (this.delKey.justDown) {
            this.myGame.score.value = 0;
            this.state.restart();
        }
    }


    onMenuExit(selectedOption: number) {
        switch (selectedOption) {
             case 0:
                 let levelId = Math.min(this.myGame.score.value + 1, Constants.LEVEL_COUNT);
                 this.state.start(toLevelName(levelId));
                 break;

             case 1: 
                 this.state.start('Story');
                 break;

             case 2: 
                 this.state.start('Controls');
                 break;

             case 3: 
                 this.state.start('Credits');
                 break;

             default:
                 break;
         }
    }

}
