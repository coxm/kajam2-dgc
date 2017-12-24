 import { MyGame } from '../index';

 export abstract class AbstractState extends Phaser.State {

    onUnmute(): void {
        // Override me
    }

    render() {
        (this.game as MyGame).renderCanvas();
    }

    /**
     * @param  {number}            x  
     * @param  {number}            y  
     * @param  {string}            text 
     * @param  {string|null}       variant    Can be: "light", "white", or left empty
     * @return {Phaser.BitmapText} 
     */
    addText(x: number, y: number, text: string, variant: string|null = null): Phaser.BitmapText {
        return this.add.bitmapText(x, y, 'terminal' + (variant ? '_' + variant : ''), text, 11)
    }

    addBigText(x: number, y: number, text: string): Phaser.BitmapText {
        return this.add.bitmapText(x, y, 'upheaval', text, 20)
    }

}
