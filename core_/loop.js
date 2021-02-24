import { is } from "./math_.js"

export default class Loop {

    //#region Private
    /** @type { (timestep: number) => void } */ #render
    /** @type { number } */ #deltaT
    /** @type { number } */ #lastT
    /** @type { number } */ #max
    //#endregion

    /**
     * @param { (timestep: number) => void } render
     * @param {{
     * start: boolean,
     * maxOffsetInterval: number,
     * }} start
     */
    constructor(render, options) {
        if (!is.func(render)) throw new TypeError("Bad render")
        this.#render = render
        start ? this.start() : void 0
    }

    start() {
        this.#deltaT = this.#lastT = 0
        this.#max = 40

        function tick(currentT = 0) {
            requestAnimationFrame(tick)
            this.#deltaT = currentT - this.#lastT
            if (this.#deltaT < this.#max) this.#render(this.#deltaT /1000)
            this.#lastT = currentT
        }

        tick = tick.bind(this)
        tick()
    }
}