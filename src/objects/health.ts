import { Pickup, traits, Traits, PickupOptions } from './pickup';
import { MyGame } from '../index';

const health: Traits = {
    onConsumed(pickup: Pickup, consumer: Phaser.Sprite, defn: PickupOptions) {
        let myGame: MyGame = consumer.game as MyGame;
        myGame.sfxChannel.play('item');
        console.log('Health pickup consumed!');
    },
}


traits['health'] = (): Traits => health;
