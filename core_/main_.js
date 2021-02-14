import Draw from "../draw/draw_.js"
import Engine from "./engine_.js"
import { v2, v3, rgb, is } from "./math_.js"
import Scene from "./scene.js"
import Sprite2D from "./sprite_.js"
import Noise from "./noise.js"

let i = new Image(22, 24)
i.src = "../src/redTitan.png"
console.log(i instanceof Image)
i.addEventListener("load", (e) => {
    console.log(e)
})

class Main extends Engine {
    constructor() {
        super()
        let canvas = document.getElementsByTagName("canvas")[0]
        let scene = new HomeScene()
        let draw = new Draw(canvas)
        draw.FPS = 29
        this.use(scene)
        this.use(draw)
        this.init()
        window.addEventListener("keydown", (e) => {
            console.log(e)
            scene.onclick(e)
        })
        window.addEventListener("resize", () => {
            draw.reSize()
        })
        this.start()
        draw.reSize()
    }
}

class SpriteBuild extends Sprite2D {
    /** @type { number } */
    #posZ
    /** @type { string } */
    #color
    /** @type { HTMLImageElement | undefined } */
    #skin
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
        ctx.drawImage(this.#skin, (x * b) -(w*2), (y * b) - (h*4), w * 4, h * 4)
    }
}
class MainHero extends SpriteBuild {
    constructor() {
        super("MainHero", "#f00", i)
    }
}

class HomeScene extends Scene {
    /** @type { MapGridSystem } */
    #map
    /** @type { Sprite2D[] } */
    #sprite_list
    constructor() {
        super()
        this.b = 20
        this.size = v2(30, 30)
        // 2334255463
        this.mainhero = new MainHero()
        this.mainhero.setPos(3,3)
        this.grid = new MapGridSystem("Main sity", this.size, 2009)
        this.grid.generate()
        this.draw_ = (ctx) => {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
            let b = this.b
            for (let x = 0; x < this.size.x; x++) {
                for (let y = 0; y < this.size.y; y++) {
                    // ctx.fillStyle = Noise.to_hsl((this.grid.getPoint(x, y) * 80) + 80, 100, 30)
                    ctx.fillStyle = Noise.to_hsl(this.grid.getPoint(x, y)*360)
                    ctx.fillRect(x * b, y * b, b, b)
                }
            }
            let pos = this.mainhero.getPos()
            this.mainhero.draw(ctx, pos.x, pos.y, b)
        }
        this.tick = () => {
            this.mainhero.updateX()
            this.mainhero.updateY()
            this.mainhero.clear()
        }
    }
    onclick(ev) {
        if (this.movementKeysCheck(ev.code)) {
            let h = this.mainhero
            switch (ev.code) {
                case "KeyA":
                    h.setX(-1)
                    break
                case "KeyD":
                    h.setX(1)
                    break
                case "KeyS":
                    h.setY(1)
                    break
                case "KeyW":
                    h.setY(-1)
                    break
            }
        }
    }
    movementKeysCheck(keyCode) {
        return (keyCode == "KeyA" ||
            keyCode == "KeyW" ||
            keyCode == "KeyD" ||
            keyCode == "KeyS")
    }
}

class MapGridSystem {
    /** @type { string } */
    #MapName
    /** @type { v2 } */
    #MapSize
    /** @type { number } */
    #MapHeight
    /**
     * @param { string } mapName
     * @param { v2 } size
     */
    /** @type { Noise } */
    #noise
    /** @type { number[] } */
    #MAP
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
        for (let x = 0; x < s.x; x++) {
            let row = []
            for (let y = 0; y < s.y; y++) {
                row.push(n.simplex2(z, x, y))
            }
            this.#MAP.push(row)
        }
    }
    getPoint(x, y) {
        return this.#MAP[x][y]
    }
    get MapName() { return this.#MapName }
    get MapSize() { return this.#MapSize.copy() }
    get MapHeight() { return this.#MapHeight }
    get Seed() { return this.#noise.Seed }
}
new Main()
export default Main