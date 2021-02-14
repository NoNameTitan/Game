import { Engine, Draw, Scene, Sprite2D, is,v2 } from "../index_.js"

class Main extends Engine {
    constructor() {
        super()
        let canvas = document.getElementById("canvas")
        let draw = new Draw(canvas)
        draw.FPS = 28
        this.TickTime = 28
        this.use(draw)
        this.start()
        this.block = 100
        let sudoku = new SudokuScene(this.block)
        this.use(sudoku)
        this.init()
        draw.reSize(this.block * 3, this.block * 3)

        canvas.addEventListener("click", (e) => {
            let x = Math.floor(e.layerX / this.block),
                y = Math.floor(e.layerY / this.block),
                check = false
            if (x > 2 || y > 2) {
                return
            }
            sudoku.xoxo_list.forEach((xoxo) => {
                let pos = xoxo.getPos()
                if (pos.x == x && pos.y == y) {
                    check = true
                }
            })
            check ? void 0 : sudoku.addXOXO(v2(x, y))
        })
        this.check = () => {
            if (sudoku.xoxo_list.length == 9) {
                sudoku.xoxo_list = []
                return
            }
            let g = {
                0: [],
                1: [],
                2: [],
                length: 3
            }
            sudoku.xoxo_list.forEach((xoxo) => {
                g[xoxo.getX()][xoxo.getY()] = xoxo.name
            })
            for (let i = 0; i < g.length; i++) {
                if (g[i][0] == g[i][1] && g[i][1] == g[i][2] && g[i][0] !== undefined) {
                    return g[i][0]
                }
                if (g[0][i] == g[1][i] && g[1][i] == g[2][i] && g[0][i] !== undefined) {
                    return g[i][0]
                }
            }
            if (g[0][0] == g[1][1] && g[1][1] == g[2][2] && g[0][0] !== undefined) {
                return g[0][0]
            }
            if (g[0][2] == g[1][1] && g[1][1] == g[2][0] && g[0][2] !== undefined) {
                return g[0][2]
            }
        }
        this.updateOnTick = true
        this.addEvent("update", () => {
            let winner = this.check()
            if (!is.empty(winner)) {
                sudoku.xoxo_list = []
                alert(winner)
            }
        })
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
        for (let i = 0; i < this.x + 1; i++) {
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

class XOXO extends Sprite2D {
    /**
     * @param { boolean } isX
     * @param { number } block
     * @param { v2 } gridPos
     */
    constructor(isX, gridPos) {
        if (isX) {
            super("x")
            this.draw_ = (x, pos, block) => {
                x.beginPath()
                x.moveTo(pos.x * block, pos.y * block)
                x.lineTo((pos.x * block) + block, (pos.y * block) + block)
                x.moveTo((pos.x * block) + block, pos.y * block)
                x.lineTo(pos.x * block, (pos.y * block) + block)
                x.strokeStyle = "#ff0000"
                x.stroke()
                x.closePath()
            }
        } else {
            super("o")
            this.draw_ = (x, pos, block) => {
                let half = block / 2
                x.beginPath()
                x.arc((pos.x * block) + half, (pos.y * block) + half, half, 0, Math.PI * 2)
                x.strokeStyle = "#0000ff"
                x.stroke()
                x.closePath()
            }
        }
        this.setPos(gridPos.x, gridPos.y)
    }
    /**
     * @param { CanvasRenderingContext2D } x
     */
    draw(x, block) {
        let pos = this.getPos()
        // x.fillRect(pos.x * block, pos.y * block, block, block)
        is.func(this.draw_) ? this.draw_(x, pos, block) : void 0
    }
}

class SudokuScene extends Scene {
    constructor(block) {
        super()
        this.block = block
        let grid = new Grid(3, 3)
        /**
         * @type { XOXO[] }
         */
        this.xoxo_list = []
        this.X = true

        this.draw_ = function (x) {
            let c = x.canvas
            x.beginPath()
            x.clearRect(0, 0, c.width, c.height)
            x.strokeStyle = "#000000"
            grid.draw(x)
            x.closePath()
            this.xoxo_list.forEach((xoxo) => {
                xoxo.draw(x, this.block)
            })
        }
    }
    addXOXO(pos) {
        this.xoxo_list.push(new XOXO(this.X, pos))
        this.X = !this.X
    }
}
let main = new Main()

export default Main