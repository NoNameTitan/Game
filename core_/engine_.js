import Scene from "./scene.js"
import { Mono, is, logger, forEach } from "./math_.js"
import Event from "./event.js"
import Draw from "../draw/draw_.js"
import version from "./version.js"

let tick = document.getElementById("tick")
let filterStrength2 = 20;
let frameTime2 = 0, lastTime2 = new Date, thisTime2

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
    #tickTime = 50
    #inited = false

    /** @type { Engine } */
    static #self__

    constructor() {
        super()
        this.#event = new Event(["init", "kill", "tick", "update", "use"])
        this.addEvent = this.#event.addEvent
        this.updateOnTick = false
        Engine.#self__ = this
    }
    init() {
        if (this.#inited) { return }
        if (!(this.#draw instanceof Draw)) {
            this.#draw = new Draw()
        }
        this.#event?.callEvent("init", this)
        this.#nowScene?.init()
        this.#draw?.init(this.#nowScene)

        this.#inited = true
    }
    viewTick() {
        lastTime2 = new Date()
        setInterval(function () {
            tick.innerHTML = (1000 / frameTime2).toFixed(1) + " tick"
        }, 1000)
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
    start() {
        this.viewTick()
        this.tick()
    }
    tick() {
        let self = Engine.#self__

        let thisFrameTime2 = (thisTime2 = new Date) - lastTime2;
        frameTime2 += (thisFrameTime2 - frameTime2) / filterStrength2;
        lastTime2 = thisTime2

        self.#event?.callEvent("tick", self)
        self.updateOnTick ? self.update() : void 0

        setTimeout(self.tick, 1000 / self.#tickTime)
    }
    update() {
        let self = Engine.#self__
        self.#event?.callEvent("update", self)
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
    set TickTime(value) {
        if (typeof value == "number" && value >= 28 && value <= 120) {
            this.#tickTime = value
        }
    }
    static get self() {
        return Engine.#self__ || new Error("Engine not found")
    }
}
export default Engine