import { is } from "./math_.js"
import Draw from "../draw/draw_.js"

// Types
/**
 * @typedef {( scene: Scene ) => void } alphaScene
 */



class Scene {
    #inited = false
    constructor() {
        /** @type { alphaScene } */
        this.tick = undefined
        /** @type { alphaScene } */
        this.init_ = undefined
        /** @type { alphaScene } */
        this.update_ = undefined
        /** @type {( ctx: CanvasRenderingContext2D ) => void } */
        this.draw_ = undefined
    }
    init() {
        if (this.#inited) { return }
        if (is.func(this.init_)) {
            this.init_(this)
        }
        this.#inited = true
    }
    update() {
        if (is.func(this.update_)) {
            this.update_(this)
        }
    }
    destroy() {
        delete this
    }
    get Inited() { return this.#inited }
}
export default Scene