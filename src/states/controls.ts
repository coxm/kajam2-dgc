import { Level } from './level';
import { Menu } from '../objects/menu';
import { MyGame } from '../index';

export class Controls extends Level {

    pages: string[] = [
`In order to help rnlf retrieve the computer
hardware pieces, you will have to make use of
your keyboard skills.

The screen is presented in a 2D manner, so that
the character is always facing either left or
right. Use the ARROW keys from your keyboard to
have him navigate through his home.

If you are at anytime stuck in your progress,
press the R key to restart the level.

In case you have issues understanding how this
all works, see the next page for a breakdown
of the available keys.

[1/4]`,

`Here is a detailed view of the available keys:

- LEFT lets your character move to the left side
of the screen, relative to your own point of view.
- RIGHT lets your character move to the right.
- UP makes the character jump. You can only jump
if you are on the floor. The longer you press the
button, the higher the jump. The maximum height
can vary according to bonuses (explained later).
- R restarts the level in case you're stuck (as
already explained in the previous page)
- If your keyboard features a such key, ESCAPE
lets you go back to the title screen. Otherwise,
you will need to reboot your computer in order
to access the title screen after the game starts.

[2/4]`,

`You will encounter a variety of bonuses while
exploring the home of rnlf:

- POGO STICKS: The more you gather, the higher
you will be able to jump. Due to his love of
all things retro, rnlf has a large selection of
pogo sticks laying around in his home.

- HARDWARE PARTS: You will need to gather all
five (5) replacement parts in order to help rnlf
repair his computer. Each level features a
unique hardware part that you have to collect
for completing the level.

[3/4]`,

`Finally, here is a list of all the creatures
you can encounter in the wonderful world of
Kommander RNLF:

- CAT: The cat. Despite its cute looks, you
cannot interact with it in anyway. Again, *please*
do not ask for refunds if you are unable to
interact with the cat, as this is intended
behaviour. We are sorry if you thought otherwise.

There are no other creatures in the game.

Best of luck for completing Kommandant RNLF!

[4/4]`
];

    currentPage: number = 0
    text: Phaser.BitmapText;

    constructor(game: MyGame) {
        super('TextScreen', game, true);
    }

    create() {
        super.create();
        
        this.addBigText(75, 20, 'Controls');

        let options = ['Next page', 'Back to menu'];
        let menu = new Menu(this.game, 40, 228, options, this.onMenuExit, this)
        this.world.add(menu);

        this.text = this.addText(40, 90, this.getCurrentPageText());
    }

    update() {
        this.ensureAmbientSound();
        if (this.myGame.musicChannel.lastPlayed !== 'music_menu') {
            this.myGame.musicChannel.play('music_menu', true);
        }
        if (this.escapeKey.justDown) {
            this.state.start('Title');
            this.myGame.sfxChannel.play('menu_confirm');
        }
    }

    onMenuExit(selectedOption: number) {
        switch (selectedOption) {
             case 0:
                 this.currentPage++;
                 this.text.text = this.getCurrentPageText();
                 break;

             case 1:
                 this.state.start('Title');
                 break;

             default:
                 break;
         }
    }

    getCurrentPageText() {
        return this.pages[this.currentPage % this.pages.length];
    }

}
