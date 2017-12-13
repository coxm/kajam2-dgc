import { Level } from '../states/level';
import { Pickup, traits, Traits, PickupOptions } from './pickup';


const health: Traits = {
    initBody(_: Phaser.Game, pickup: Pickup, body: Phaser.Physics.P2.Body) {
        body.addShape(new (p2 as any).Box({width: 1, height: 1}));
    },

    onConsumed(pickup: Pickup, consumer: Phaser.Sprite, defn: PickupOptions) {
        console.log('Health pickup consumed!');
    },
}


traits['health'] = (): Traits => health;
