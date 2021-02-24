import { Engine, Scene, Sprite2D, is, Loop, v2, Noise } from "../../index_.js"

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
//#region 

//#region Scene
class HomeScene extends Scene {
    constructor(canvas) {
        super(canvas)
        this.b = 30
        this.size = v2(30, 30)
        this.mainhero = new MainHero()
        this.grid = new MapGridSystem("Main city", this.size, 2334255463)
        this.mainhero.setPos(3, 3)
        this.grid.generate()
        new Loop(this.draw.bind(this), true)
        new Loop(this.tick.bind(this), true)
    }

    draw(time) {

        console.log()
    }
    tick(time) {

    }
}
new Titan()
//#endregion