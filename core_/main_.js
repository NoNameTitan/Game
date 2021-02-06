import Draw from "../draw/draw_.js"
import Engine from "./engine_.js"
import Scene from "./scene.js"

class Main extends Engine {
    constructor() {
        super()
        let draw = new Draw(document.getElementById("canvas"))
        this.use(draw)
        this.start()
        this.use(new SudokuScene())
        this.init()
        draw.reSize(200,200)
    }
}
class Grid {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    draw(ctx) {
        let w = ctx.canvas.width
        let h = ctx.canvas.height
        let x__ = w / this.x
        let y__ = h / this.y
        for (let i = 0; i < this.x +1; i++) {
            for (let j = 0; j < this.y + 1; j++) {
                ctx.moveTo(x__ * i, 0)
                ctx.lineTo(x__ * i, h)
                ctx.stroke()
                ctx.moveTo(0, y__ * j)
                ctx.lineTo(w, y__ * j)
                ctx.stroke()
            }
        }
    }
}

class SudokuScene extends Scene {
    constructor() {
        super()
        let grid = new Grid(3,3)
        
        this.draw_ = function (x) {
            let c = x.canvas
            x.beginPath()
            x.clearRect(0, 0, c.width, c.height)
            grid.draw(x)
            x.closePath()
        }
    }
}
let main = new Main()

export default Main