import { Level } from '../states/level';
import { Pickup, traits, Traits, PickupOptions } from './pickup';
import { MyGame } from '../index';


const hardware: Traits = {
    onConsumed(pickup: Pickup, consumer: Phaser.Sprite, defn: PickupOptions) {
        let myGame: MyGame = consumer.game as MyGame;
        myGame.sfxChannel.play('super_item');

        const level = pickup.game.state.getCurrentState() as Level;
        ++level.score.value;
        console.log('Hardware pickup consumed!');
    },
}


traits['hardware'] = (): Traits => hardware;
