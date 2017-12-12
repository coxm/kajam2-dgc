export namespace Constants {
    const evalArg = (val: any) => Function(`return ${val}`)();
    const search: {[key: string]: any;} = location.search
        .slice(1).split('&').reduce(
            (obj: {[key: string]: string;}, assignment: any) => {
                const [key, val] = assignment.split('=');
                obj[key] = val === undefined ? true : evalArg(val);
                return obj;
            },
            {}
        );
    console.log('Search', search);

    // Canvas
    export const WIDTH: number = 447; // = 16 * 28
    export const HEIGHT: number = 304; // = 16 * 19
    export const PIXEL_SCALING: number = 2;

    // Contents
    export const LEVEL_COUNT: number = 2;

    // Physics
    export const GRAVITY: number = 1600;

    // Debug
    export const DEBUG_BODIES: boolean = !!search['debug-bodies'];
    export const DEBUG_SHAPES: boolean = false;
    export const DEBUG_MUTE: boolean = false;
    export const DEBUG_SKIP_TITLE: boolean = true;
}
