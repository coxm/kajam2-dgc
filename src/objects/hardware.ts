import { Level } from '../states/level';
import { Pickup, traits, Traits, PickupOptions } from './pickup';


const hardware: Traits = {
    onConsumed(pickup: Pickup, consumer: Phaser.Sprite, defn: PickupOptions) {
        const level = pickup.game.state.getCurrentState() as Level;
        ++level.score.value;
        console.log('Hardware pickup consumed!');
    },
}


traits['hardware'] = (): Traits => hardware;
