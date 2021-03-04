import { rgb, rgb_assets } from "../../core_/math_.js"
import { Engine, Scene, Sprite2D, is, Loop, LoopMachine, v2, Noise, forEach } from "../../index_.js"

//#region Engine
class Titan extends Engine {
    constructor() {
        super()
        this.use(new HomeScene(document.querySelector("canvas")))

    }


}
//#endregion

//#region Map
class MapGridSystem {
    /** @type { string } */ #MapName
    /** @type { v2 } */ #MapSize
    /** @type { number } */ #MapHeight
    /** @type { Noise } */  #noise
    /** @type { number[] } */ #MAP
    /**
     * @param { string } mapName
     * @param { v2 } size
     */
    constructor(mapName = "Map_unnamed", size, seed) {
        this.#MapName = mapName
        this.#MapSize = size
        this.#MapHeight = 3
        this.#noise = new Noise(seed)
        this.#MAP = []
    }
    /**
     * @param { number } z
     */
    generate(z) {
        is.empty(z) ? z = 0 : void 0
        let n = this.#noise
        let s = this.#MapSize
        for (let y = 0; y < s.y; y++) {
            let row = []
            for (let x = 0; x < s.x; x++) {
                row.push(n.simplex2(z, x, y))
            }
            this.#MAP.push(row)
        }
    }
    getPoint(x, y) { return this.#MAP[y][x] }
    get MapName() { return this.#MapName }
    /** @returns { v2 } */
    get MapSize() { return this.#MapSize.copy() }
    get MapHeight() { return this.#MapHeight }
    get Seed() { return this.#noise.Seed }
}
//#endregion

//#region Sprite
class SpriteBuild extends Sprite2D {
    /** @type { number } */ #posZ
    /** @type { string } */ #color
    /** @type { HTMLImageElement | undefined } */ #skin
    /**
     * @param { string } name
     * @param { string } color
     */
    constructor(name, color, skin) {
        super(name)
        this.#color = ("string" == typeof color ? color : "#000")
        this.#skin = (skin instanceof Image ? skin : undefined)
    }
    /**
     * @param { CanvasRenderingContext2D } ctx 
     * @param { number } x 
     * @param { number } y 
     * @param { number } b 
     */
    draw(ctx, x, y, b) {
        // ctx.fillStyle = this.#color
        // ctx.fillRect(x * b, y * b, b * 2, b * 2)
        let w = this.#skin.width
        let h = this.#skin.height
        ctx.drawImage(this.#skin, (x * b) - (w * 2), (y * b) - (h * 4), w * 4, h * 4)
    }
}
class MainHero extends SpriteBuild {
    constructor() {
        let img = new Image(22, 24)
        img.src = "../../src/redTitan.png"
        super("MainHero", "#f00", img)
    }
}
//#endregion 

//#region Scene
class HomeScene extends Scene {
    constructor(canvas) {

        //#region Constructor
        super(canvas)
        this.pos = v2(2, 2)
        this.b = 40
        this.halfB = this.b / 2
        this.size = v2(24, 16)
        this.mainhero = new MainHero()
        // 2334255463
        this.grid = new MapGridSystem("Main city", this.size, 406200223296762)
        //#endregion

        //#region init
        this.mainhero.setPos(3, 3)
        this.grid.generate()
        this.resize()
        //#endregion

        //#region Loop
        new LoopMachine({
            render: this.tick.bind(this),
            draw: this.draw.bind(this)
        }, { start: true })
        //#endregion

        //#region AddEventListener
        addEventListener("resize", this.resize.bind(this))
        addEventListener("keypress", (ev) => {
            if (is.WASD(ev.code)) {
                switch (ev.code.slice(3)) {
                    case "W":
                        this.mainhero.setY(-1)
                        break
                    case "A":
                        this.mainhero.setX(-1)
                        break
                    case "S":
                        this.mainhero.setY(1)
                        break
                    case "D":
                        this.mainhero.setX(1)
                        break
                }
            }
        })
        //#endregion

    }

    //#region Public
    resize() {
        this.canvas.width = window.innerWidth
        this.canvas.height = window.innerHeight
        this.ctx.translate(this.pos.x * this.b, this.pos.y * this.b)
    }
    clear() {
        this.ctx.clearRect(-this.pos.x * this.b, -this.pos.y * this.b, this.canvas.width, this.canvas.height)
    }
    draw() {
        this.clear()
        this.drawMap([this.mainhero])
    }
    /**
     * @param { Sprite2D[] } sprite
     */
    drawMap(spr = []) {
        for (let y = 0; y < this.size.y; y++) {
            for (let x = 0; x < this.size.x; x++) {
                let p = this.grid.getPoint(x, y)
                this.drawZ(x, y, p, [0, p * 175 + 40, 0])
            }
            spr.forEach((s) => {
                if (Math.ceil(s.getY()) == y) {
                    let xy = s.getPos()
                    this.drawSprite(xy.x, xy.y, this.grid.getPoint(xy.x, xy.y), [200, 0, 0])
                }
            })
        }
    }
    drawRect(x, y, color = [0, 0, 0]) {
        this.ctx.fillStyle = rgb(color)
        this.ctx.fillRect(x * this.b, y * this.b, this.b, this.b)
    }
    drawZ(x, y, z, color = [0, 0, 0]) {
        this.drawBox(x, y - z, color)
    }
    drawSprite(x, y, z, color = [0, 0, 0]) {
        this.drawBox(x, y - 0.5 - z, color)
    }
    drawBox(x, y, color = [0, 0, 0]) {
        this.ctx.fillStyle = rgb(color)
        this.ctx.strokeStyle = "black"
        this.ctx.beginPath()
        this.ctx.rect(x * this.b, (y * this.b) - this.halfB, this.b, this.b)
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.closePath()
        this.ctx.fillStyle = rgb_assets(color, [-45, -45, -45])
        this.ctx.beginPath()
        this.ctx.rect(x * this.b, (y * this.b) + this.halfB, this.b, this.halfB)
        this.ctx.fill()
        this.ctx.stroke()
        this.ctx.closePath()
    }
    tick() {
        let m = this.mainhero
        let s = this.size
        let p = m.getPos()
        let a = m.getTo()

        if ((p.x <= 0 && a.x < 0) || (p.x >= s.x - 1 && a.x > 0)) m.setX(0)
        m.updateX()
        if (p.x < 0) m.setPosX(0)
        if (p.x > s.x - 1) m.setPosX(s.x - 1)

        if ((p.y <= 0 && a.y < 0) || (p.y >= s.y - 1 && a.y > 0)) m.setY(0)
        m.updateY()
        if (p.y < 0) m.setPosY(0)
        if (p.y > s.y - 1) m.setPosY(s.y - 1)

        m.clear()
    }
    //#endregion

}
globalThis.titan = new Titan()
//#endregion