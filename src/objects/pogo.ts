import { Pickup, traits, Traits, PickupOptions } from './pickup';
import { Player } from './player';
import { MyGame } from '../index';

const pogo: Traits = {
    onConsumed(pickup: Pickup, consumer: Player): void {
        let myGame: MyGame = consumer.game as MyGame;
        myGame.sfxChannel.play('item');

        consumer.jumpLevel++;
    },
};


traits['pogo'] = (): Traits => pogo;
