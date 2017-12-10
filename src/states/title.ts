import { AbstractState } from './abstract';
import { Menu } from '../objects/menu';

export class Title extends AbstractState {

    create() {
        this.add.sprite(0, 0, 'title');

        let mapGroup = this.add.group();

        let map = this.add.tilemap('TitleScreen');
        map.addTilesetImage('tileset', 'tileset');
        for (let i = 0; i < map.layers.length; i++) {
            map.createLayer(i, undefined, undefined, mapGroup);
        }

        let menu = new Menu(this.game, 150, 172, ['Start game', 'Story', 'Controls'], this.onMenuExit, this)
        this.world.add(menu);
    }

    onMenuExit(selectedOption: number) {
        switch (selectedOption) {
             case 0:
                 this.state.start('Level01');
                 break;
             
             default:
                 break;
         }
    }

}
