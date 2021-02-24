import Scene from "./scene.js"
import { Mono, is, logger, forEach } from "./math_.js"
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
//#endregion

export default class Engine extends Mono {

    //#region Private
    /**
     * @type {{
     * self: Event,
     * callEvent: callEvent_,
     * addEvent: addEvent_ 
     * }}
     **/ #event
    /** @type { Scene } */ #scene
    /** @type { Engine } */ static #self__
    #inited = false
    //#endregion

    constructor() {
        super()
        this.#event = Event.init(["init", "use", "kill"])
        this.addEvent = this.#event.addEvent
        Engine.#self__ = this
    }

    init() {
        if (this.#inited) return
        this.#event?.callEvent("init", this)
        this.#inited = true
    }

    /**
     * @param {Scene} box
     */
    use(scene) {
        this.#event?.callEvent("use", this)
        if (scene instanceof Scene) {
            this.#scene = scene
            return true
        }
        return false
    }

    destroy() {
        this.#event?.callEvent("kill", this)
        let kills = []
        forEach([this.#event?.self, this.#scene], (x) => {
            if (!is.empty(x)) {
                kills.push("kill: " + x.constructor.name)
                x.destroy()
            }
        })
        delete this
        logger("KILL", ...kills)
    }
}