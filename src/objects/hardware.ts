import { Level } from '../states/level';
import { Pickup, traits, Traits, PickupOptions } from './pickup';


const hardware: Traits = {
    initBody(_: Phaser.Game, pickup: Pickup, body: Phaser.Physics.P2.Body) {
        body.addShape(new (p2 as any).Box({width: 1, height: 1}));
    },

    onConsumed(pickup: Pickup, consumer: Phaser.Sprite, defn: PickupOptions) {
        const level = pickup.game.state.getCurrentState() as Level;
        ++level.score.value;
        console.log('Hardware pickup consumed!');
    },
}


traits['hardware'] = (): Traits => hardware;
