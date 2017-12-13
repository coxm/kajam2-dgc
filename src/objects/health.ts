import { Pickup, traits, Traits, PickupOptions } from './pickup';


const health: Traits = {
    onConsumed(pickup: Pickup, consumer: Phaser.Sprite, defn: PickupOptions) {
        console.log('Health pickup consumed!');
    },
}


traits['health'] = (): Traits => health;
