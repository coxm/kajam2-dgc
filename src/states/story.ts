import { Level } from './level';
import { Menu } from '../objects/menu';
import { MyGame } from '../index';

export class Story extends Level {

    constructor(game: MyGame) {
        super('TextScreen', game, true);
    }

    create() {
        super.create();
        
        this.addBigText(75, 20, 'Story');

        let options = ['Back to menu'];
        let menu = new Menu(this.game, 40, 238, options, this.onMenuExit, this)
        this.world.add(menu);

        let text = `rnlf's cat has slept on his DOS computer...
Sitting right on the cooling fan! The poor PC
overheated and broke down before his master
had a chance to complete this month's game.

Help rnlf retrieve the replacement parts throughout
his place, so he can complete his beloved DOS game
in time!

But be careful, as a lot of hazardous
hardware is sitting around, turning his home
into a dangerous maze...`;
        this.addText(40, 90, text);
    }

    update() {
        this.ensureAmbientSound();
        this.myGame.musicChannel.stopChannel();
        if (this.escapeKey.justDown) {
            this.state.start('Title');
            this.myGame.sfxChannel.play('menu_confirm');
        }
    }

    onMenuExit(selectedOption: number) {
        switch (selectedOption) {
             case 0:
                 this.state.start('Title');
                 break;

             default:
                 break;
         }
    }

}
