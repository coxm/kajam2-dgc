import { Pickup, traits, Traits, PickupOptions } from './pickup';
import { Player } from './player';

const pogo: Traits = {
    onConsumed(pickup: Pickup, consumer: Player): void {
        consumer.jumpLevel++;
    },
};


traits['pogo'] = (): Traits => pogo;
