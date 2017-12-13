export namespace Constants {
    interface Dict { [key: string]: any; }

    const evalArg = (val: any) => Function(`return ${val}`)();
    const search: Dict = location.search.slice(1).split('&').reduce(
        (obj: {[key: string]: string;}, assignment: string): Dict => {
            const [key, val] = assignment.split('=');
            obj[key] = (val === undefined) ? 'true' : val;
            return obj;
        },
        {}
    );

    // Canvas
    export const WIDTH: number = 447; // = 16 * 28
    export const HEIGHT: number = 304; // = 16 * 19
    export const PIXEL_SCALING: number = 2;

    // Contents
    export const LEVEL_COUNT: number = 3;

    // Physics
    export const GRAVITY: number = 1400;

    // Debug
    export const DEBUG_OBJECT_BODIES: boolean = !!search['debug-bodies'];
    export const DEBUG_TILE_BODIES: boolean = !!search['debug-tile-bodies'];
    export const DEBUG_FORCE_LEVEL: string | null = search['level'] || null;
    export const DEBUG_SHAPES: boolean = false;
    export const DEBUG_MUTE: boolean = false;
    export const DEBUG_SKIP_TITLE: boolean = true;
}
