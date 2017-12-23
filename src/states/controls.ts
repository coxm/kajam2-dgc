import { Level } from './Level';
import { Menu } from '../objects/menu';
import { MyGame } from '../index';

export class Controls extends Level {

    constructor(game: MyGame) {
        super('TextScreen', game, true);
    }

    create() {
        super.create();
        
        this.addBigText(75, 20, 'Controls');

        let options = ['Back to menu'];
        let menu = new Menu(this.game, 40, 238, options, this.onMenuExit, this)
        this.world.add(menu);
    }

    update() {
        this.ensureAmbientSound();
        this.myGame.musicChannel.stopChannel();
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
