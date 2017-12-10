 import { MyGame } from '../index';

 export abstract class AbstractState extends Phaser.State {

    onUnmute(): void {
        // Override me
    }

    render() {
        (this.game as MyGame).renderCanvas();
    }

}
