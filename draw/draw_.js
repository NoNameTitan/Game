import { Mono } from "../core_/math_.js"
import version from "../core_/version.js"
class Draw extends Mono {
    #inited = false
    /**
     * @param { HTMLCanvasElement } canvas
     */
    constructor(canvas) {
        super()
        this.canvas = canvas
        this.ctx = canvas.getContext("2d")
    }
    init() {
        if (this.#inited) { return }
        this.#inited = true

        let c = this.canvas
        let x = this.ctx
        let b = 10

        c.width < 500 ? c.width = 500 : void 0;
        c.height < 300 ? c.height = 300 : void 0;
        
        x.fillStyle = "black"
        x.fillRect(0, 0, b, b)
        x.fillRect(c.width - b, 0, b, b)
        x.fillRect(0, c.height - b, b, b)
        x.fillRect(c.width - b, c.height - b, b, b)
        x.fillText("Game Engine " + version, 0, c.height / 2)
    }
    destroy() {
        delete this
    }
}

export default Draw