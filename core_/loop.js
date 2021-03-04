import { is } from "./math_.js"

export class Loop {

    //#region Private
    /** @type { (timestep: number) => void } */ #render
    /** @type { number } */ #deltaT
    /** @type { number } */ #lastT
    /** @type { number } */ #max
    #started = false
    //#endregion

    /**
     * @param { (timestep: number) => void } render
     * @param {{
     * start: boolean,
     * maxOffsetInterval: number,
     * }} options
     */
    constructor(render, options) {
        if (!is.func(render)) throw new TypeError("Bad render")
        this.#render = render
        this.#deltaT = this.#lastT = 0
        is.empty(options?.start) ? void 0 : (options.start ? this.start() : void 0);
        this.#max = is.empty(options?.maxOffsetInterval) ? 40 : options.maxOffsetInterval;
    }
    start() {
        if (this.#started) return
        this.#started = true
        let tick = (function (currT = 0) {
            requestAnimationFrame(tick)
            this.#deltaT = currT - this.#lastT
            if (this.#deltaT < this.#max) this.#render(this.#deltaT / 1000)
            this.#lastT = currT
        }).bind(this)
        tick()
    }
}

export class LoopMachine {

    //#region Private
    /** @type { (timestep: number) => void } */ #a
    /** @type { (timestep: number) => void } */ #b
    /** @type { number } */ #deltaT
    /** @type { number } */ #lastT
    /** @type { number } */ #max
    #started = false
    //#endregion

    /**
     * @param { (timestep: number) => void } render
     * @param {{
     * start: boolean,
     * maxOffsetInterval: number,
     * }} options
     */
    constructor({ render, draw }, options) {
        if (!is.func(render) && !is.func(draw)) throw new TypeError("Bad render or draw")
        this.#a = render
        this.#b = draw
        this.#deltaT = this.#lastT = 0
        is.empty(options?.start) ? void 0 : (options.start ? this.start() : void 0);
        this.#max = is.empty(options?.maxOffsetInterval) ? 40 : options.maxOffsetInterval;
    }
    start() {
        if (this.#started) return
        this.#started = true
        let tick = (function (currT = 0) {
            requestAnimationFrame(tick)
            this.#deltaT = currT - this.#lastT
            if (this.#deltaT < this.#max) {
                this.#a(this.#deltaT / 1000)
                this.#b(1000 / this.#deltaT | 0)
            }
            this.#lastT = currT
        }).bind(this)
        tick()
    }
}