import { Pickup, traits, Traits, PickupOptions } from './pickup';
import { Player } from './player';


const pogo: Traits = {
    onConsumed(pickup: Pickup, consumer: Player): void {
        consumer.jumpSpeed += 100;
    },
};


traits['pogo'] = (): Traits => pogo;
