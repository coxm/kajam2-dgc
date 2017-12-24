import { Pickup, traits, Traits, PickupOptions } from './pickup';
import { Player } from './player';
import { MyGame } from '../index';
import { Level } from '../states/level';

const pogo: Traits = {
    onConsumed(pickup: Pickup, consumer: Player): void {
        let myGame: MyGame = consumer.game as MyGame;
        myGame.sfxChannel.play('item');

        consumer.jumpLevel++;
        const level = myGame.state.getCurrentState() as Level;
        level.pogometer!.add();
    },
};


traits['pogo'] = (): Traits => pogo;
