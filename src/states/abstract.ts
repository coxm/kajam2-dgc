 import { MyGame } from '../index';

 export abstract class AbstractState extends Phaser.State {

    onUnmute(): void {
        // Override me
    }

    render() {
        (this.game as MyGame).renderCanvas();
    }

    addText(x: number, y: number, text: string, light: boolean = false): Phaser.BitmapText {
        return this.add.bitmapText(x, y, (light ? 'terminal_light' : 'terminal'), text, 11)
    }

    addBigText(x: number, y: number, text: string): Phaser.BitmapText {
        return this.add.bitmapText(x, y, 'upheaval', text, 20)
    }

}
