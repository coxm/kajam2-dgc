import { Level } from './level';
import { Menu } from '../objects/menu';
import { MyGame } from '../index';

export class Ending extends Level {

    private hardware: Phaser.Image[] = [];

    constructor(game: MyGame) {
        super('TextScreen', game, true);
    }

    create() {
        super.create();
        
        this.addBigText(75, 20, 'Thank you!');

        let options = ['Back to menu'];
        let menu = new Menu(this.game, 40, 238, options, this.onMenuExit, this)
        this.world.add(menu);

        for (let i = 0; i < 5; i++) {
            let sprite = this.add.image(95 + i * 50, 90, 'hardwareSheet', i);
            this.hardware.push(sprite);
        }

        this.add.sprite(60, 90, 'hero');

        let text = `YOU DID IT!

Thanks to your work, rnlf was able to repair his
computer in time, and finally managed to do his
homework for the Dos Game Club!

Do you want to play more Kommander RNLF? Buy the
next game of the series "Kommander RNLF II: The 
Search for Tijn" by sending $25 to:

DOS GAME CLUB - E.T. Dump, South White Sands Bvd.
Alamogordo, New Mexico, USA`;
        this.addText(40, 140, text);
    }

    update() {
        this.ensureAmbientSound();
        if (this.myGame.musicChannel.lastPlayed !== 'music_title') {
            this.myGame.musicChannel.play('music_title', true, 0.8);
        }
        if (this.escapeKey.justDown) {
            this.state.start('Title');
            this.myGame.sfxChannel.play('menu_confirm');
        }

        let i = 0;
        for (let sprite of this.hardware) {
            sprite.y = 92.5 + Math.sin(this.time.time / 100 + i * 5) * 5
            i++
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
