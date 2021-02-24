import { is } from "./math_.js"

class Scene {

    //#region Private
    /** @type { HTMLCanvasElement } */ #canvas
    /** @type { CanvasRenderingContext2D } */ #ctx
    //#endregion

    /** 
     * @param { HTMLCanvasElement } canvas
     */
    constructor(canvas) {
        if (is.empty(canvas)) throw new TypeError("Bad canvas")
        this.#canvas = canvas
        this.#ctx = canvas.getContext("2d")
    }
    get canvas() { return this.#canvas }
    get ctx() { return this.#ctx }
    destroy() { delete this }
}
export default Scene