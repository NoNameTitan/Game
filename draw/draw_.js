import { is, Mono } from "../core_/math_.js"
import Scene from "../core_/scene.js";
import version from "../core_/version.js"

let fps = document.getElementById("fps")
let filterStrength2 = 20;
let frameTime2 = 0, lastTime2 = new Date, thisTime2

class Draw extends Mono {
    #inited = false
    #fps = 30
    /** @type { Draw } */
    static #self__
    /**
     * @param { HTMLCanvasElement } canvas
     */
    constructor(canvas) {
        super()
        this.canvas = canvas || document.getElementsByTagName("canvas")[0]
        this.ctx = this.canvas.getContext("2d")
        /** @type {( ctx: CanvasRenderingContext2D ) => void } */
        this.scene
        Draw.#self__ = this
    }
    /**
     * @param { Scene } scene
     */
    init(scene) {
        if (this.#inited) { return }
        this.#inited = true

        if (scene instanceof Scene) {
            this.scene = scene
        }

        let c = this.canvas

        c.width < 500 ? c.width = 500 : void 0
        c.height < 300 ? c.height = 300 : void 0

        this.fpsInit()
        this.reSize()
        this.drawIntro()
        this.tick()
    }
    fpsInit() {
        lastTime2 = new Date()
        setInterval(function () {
            fps.innerHTML = (1000 / frameTime2).toFixed(1) + " fps"
        }, 1000)
    }
    set FPS(value) {
        if (typeof value == "number" && value >= 28 && value <= 120) {
            this.#fps = value
        }
    }
    /**
     * @param { Scene } scene
     */
    tick() {
        let self = Draw.#self__

        let thisFrameTime2 = (thisTime2 = new Date) - lastTime2;
        frameTime2 += (thisFrameTime2 - frameTime2) / filterStrength2;
        lastTime2 = thisTime2

        if (is.func(self.scene?.draw_)) {
            self.scene.draw_(self.ctx)
        }

        setTimeout(self.tick, 1000 / self.#fps)
    }
    reSize(x, y) {
        if (!is.empty(x) && !is.empty(y)) {
            this.canvas.width = x
            this.canvas.height = y
        } else {
            this.canvas.width = document.body.clientWidth
            this.canvas.height = document.body.clientHeight
        }
    }

    drawIntro() {
        let c = this.canvas
        let x = this.ctx
        let b = 10
        x.fillStyle = "black"
        x.beginPath()
        x.clearRect(0, 0, c.width, c.height)
        x.rect(0, 0, b, b)
        x.rect(c.width - b, 0, b, b)
        x.rect(0, c.height - b, b, b)
        x.rect(c.width - b, c.height - b, b, b)

        x.arc(c.width / 2, c.height / 2, b, 0, Math.PI * 2)
        x.fillText("Game Engine " + version, 0, c.height / 2)
        x.fill()
        x.closePath()
    }
    destroy() {
        delete this
    }
}

export default Draw