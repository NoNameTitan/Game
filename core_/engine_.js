import Scene from "./scene.js"
import { Mono, is, logger, forEach, Mixin } from "./math_.js"
import Event from "./event.js"

//#region Types
/**
 * @typedef {(
 *      eventName: string,
 *      self: {} | undefined,
 *      ...args)=> void
 * } callEvent_
 */
/**
 * @typedef {( self: object ) => void } alphaSelf
 */
/**
 * @typedef {(
 *      eventName: string,
 *      callback: alphaSelf,
 *      options: { once: boolean }
 * )=>void} addEvent_
 */
/**
 * @typedef {{
 * self: Event,
 * callEvent: callEvent_,
 * addEvent: addEvent_ 
 * }} EVENT
 */
//#endregion

class MiniEngine {
    /** @type { Engine } */ #parentEngine
    /** @type { EVENT } */ #event
    #inited = false
    constructor(parentEngine) {
        if (!(parentEngine instanceof Engine)) throw new TypeError("Bad ParentEngine")
        this.#parentEngine = this.#parentEngine
        this.#event = Event.init(["init", "kill"])
    }
    get INITED() { return this.#inited }
    init() {
        if (this.#inited) return
        this.#event.callEvent("init", this)
        this.#inited = true
    }
    destroy() { delete this }
}




export default class Engine extends Mono {

    //#region Private
    /** @type { EVENT } */ #event
    /** @type { Scene } */ #scene
    /** @type { Engine } */ static #self__
    #inited = false
    //#endregion

    constructor() {
        super()
        this.#event = Event.init(["init", "use", "kill"])
        this.addEvent = this.#event.addEvent
        this.miniEngine_list = []
        Engine.#self__ = this
    }

    static MiniEngine = MiniEngine
    init() {
        if (this.#inited) return
        this.#event.callEvent("init", this)
        this.#inited = true
    }

    /**
     * @param { MiniEngine | Scene } box
     */
    use(box) {
        this.#event?.callEvent("use", this)
        if (box instanceof Scene) {
            this.#scene = box
            return true
        } else if (box instanceof MiniEngine) {
            this.miniEngine_list.push(box)
            return true
        }
        return false
    }

    destroy() {
        this.#event.callEvent("kill", this)
        forEach([this.#event?.self, this.#scene, ...this.miniEngine_list], x => (is.empty(x)) ? void 0 : x.destroy())
        delete this
        logger("KILL", ...kills)
    }
}