import { Level } from './level';
import { Menu } from '../objects/menu';
import { MyGame } from '../index';

export class Credits extends Level {

    constructor(game: MyGame) {
        super('TextScreen', game, true);
    }

    create() {
        super.create();
        
        this.addBigText(75, 20, 'Credits');

        let options = ['Back to menu'];
        let menu = new Menu(this.game, 40, 238, options, this.onMenuExit, this)
        this.world.add(menu);

        let text = `This game was assembled in Dec. 2017
for the "2nd Kajam" event. The team consists in:

KDRNIC: German fashion advisor

RNLF: Boom operator

SORCERESS: Jumping advisor

TIJN (aka. NERK): Chiptune programmer

TOASTY: Floppy disk operator

WAN: Hero licensing advisor

Join us at:
https://www.alakajam.com
https://www.dosgameclub.com`;
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
