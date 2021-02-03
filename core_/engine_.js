import Scene from "./scene.js"
import { Mono, is, logger, forEach } from "./math_.js"
import Event from "./event.js"
import Draw from "../draw/draw_.js"
import version from "./version.js";

// Types
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

class Engine extends Mono {
    /** @type {{ self: Event, callEvent: callEvent_, addEvent: addEvent_ }} */
    #event
    /** @type { Draw } */
    #draw
    /** @type { Scene } */
    #nowScene
    #tickTime = 30
    #inited = false
    constructor() {
        super()
        this.#event = new Event(["init", "kill", "tick", "update", "use"])
        this.addEvent = this.#event.addEvent

    }
    init() {
        if (this.#inited) { return }
        this.#event?.callEvent("init", this)
        this.#inited = true
        this.#draw?.init()
        this.#nowScene?.init()
    }
    use(box) {
        this.#event?.callEvent("use", this)
        let done = false
        if (box instanceof Scene) {
            this.#nowScene = box
            done = true
        } else if (box instanceof Draw && is.empty(this.#draw)) {
            this.#draw = box
            done = true
        }
        return done
    }
    start(param) {

    }
    tick() {
        this.#event?.callEvent("tick", this)

    }
    update() {
        this.#event?.callEvent("update", this)

    }
    destroy() {
        this.#event?.callEvent("kill", this)
        let kills = []
        forEach([this.#draw, this.#event?.self, this.#nowScene], (x) => {
            if (!is.empty(x)) {
                kills.push("kill: " + x.constructor.name)
                x.destroy()
            }
        })
        delete this
        logger("KILL", ...kills)
    }
    /**  @param { number } value */
    set tickTime(value) {
        if (typeof value == "number" && value >= 38 && value <= 120) {
            this.#tickTime = value
        }
    }
}
export default Engine