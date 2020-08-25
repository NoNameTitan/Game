var fps = $("#fps")
var filterStrength2 = 20;
var frameTime2 = 0, lastTime2 = new Date, thisTime2

class Draw {
    /** @type { Draw } */
    static #self__
    #canvas
    #ctx
    /** @type { BigMap } */
    #Map
    #block
    #pos
    /** @type { Sprite } */
    #characters
    #scale

    constructor(canvas, map = {}, characters = Sprite, block = v3(32, 32, 24)) {
        if ((Draw.#self__ == undefined) || (Draw.#self__ == null)) {
            this.#canvas = canvas
            this.#ctx = canvas.getContext("2d")
            this.#Map = map
            this.#characters = characters

            this.#pos = v2(50, 50)
            this.#block = block
            this.#scale = 3

            this.screen = v2(window.innerWidth, window.innerHeight)
            this.fps = 30
            this.vec = v2()
            this.old = v2()
            this.m = false
            this.lastTime = 0
            Draw.#self__ = this

            // this.init()
        } else {
            return Draw.#self__
        }
    }

    init() {
        this.#Map.init()
        lastTime2 = new Date()
        setInterval(function () {
            fps.innerHTML = (1000 / frameTime2).toFixed(1) + " fps";
        }, 1000);

        this.resize()
        window.addEventListener("resize", Draw.#self__.resize)
        this.#canvas.addEventListener("wheel", Draw.#self__.map_scale)
        this.#canvas.addEventListener("mousedown", Draw.#self__.map_down)
        this.#canvas.addEventListener("mousemove", Draw.#self__.map_move)
        this.#canvas.addEventListener("mouseup", Draw.#self__.map_up)
        this.loop()
    }
    update(x, y) {
        Draw.#self__.#pos.push(Draw.#self__.vec)
        Draw.#self__.vec.clear()
    }
    resize() {
        Draw.#self__.#canvas.width = Draw.#self__.screen.x = window.innerWidth
        Draw.#self__.#canvas.height = Draw.#self__.screen.y = window.innerHeight
    }
    static getDraw() {
        return {
            self: Draw.#self__,
            pos: Draw.#self__.#pos,
            scale: Draw.#self__.#scale,
            block: Draw.#self__.#block,
            ctx: Draw.#self__.#ctx
        }
    }

    block_draw(x, y, style = [255, 255, 255]) {
        let { pos, scale, block, ctx } = Draw.getDraw()

        ctx.beginPath()
        ctx.rect(((x * block.x) + pos.x) * scale,
            ((y * block.y) + pos.y - block.z) * scale,
            block.x * scale,
            (block.y + block.z) * scale)
        ctx.fillStyle = rgb(style)
        ctx.strokeStyle = "#333"
        ctx.fill()
        ctx.stroke()
        ctx.closePath()

        ctx.beginPath()
        ctx.rect(((x * block.x) + pos.x) * scale,
            ((y * block.y) + pos.y + block.y - block.z) * scale,
            block.x * scale,
            block.z * scale)
        ctx.fillStyle = rgb_assets(style, [-28, -28, -28])
        ctx.strokeStyle = "#333"
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
    tile_draw(x, y, style = [255, 255, 255]) {
        let { pos, scale, block, ctx } = Draw.getDraw()

        ctx.beginPath()
        ctx.rect(((x * block.x) + pos.x) * scale,
            ((y * block.y) + pos.y) * this.#scale,
            block.x * scale,
            block.y * scale)
        ctx.fillStyle = rgb(style)
        ctx.strokeStyle = "#333"
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
    }
    sprite_draw(target, style = [255, 255, 255]) {
        let x = target.getX()
        let y = target.getY()
        let { pos, scale, block, ctx } = Draw.getDraw()

        ctx.beginPath()
        ctx.rect(((x * block.x) + pos.x - (block.x * target.radius)) * scale,
            ((y * block.y) + pos.y - (block.y * target.radius * 2)) * scale,
            block.x * target.radius * scale * 2,
            block.y * target.radius * scale * 2.1)
        ctx.fillStyle = rgb_assets(style, [-28, -28, -28])
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(((x * block.x) + pos.x) * scale,
            ((y * block.x) + pos.y) * scale,
            target.radius * (block.x + block.y) / 2 * scale, 0, Math.PI)
        ctx.fillStyle = rgb_assets(style, [-28, -28, -28])
        ctx.fill()
        ctx.closePath()
        ctx.beginPath()
        ctx.arc(((x * block.x) + pos.x) * scale,
            ((y * block.y) + pos.y - (block.y * target.radius * 2)) * scale,
            target.radius * (block.x + block.y) / 2 * scale, 0, Math.PI * 2)
        ctx.fillStyle = rgb(style)
        ctx.fill()
        ctx.closePath()
    }
    map_draw() {
        let self = Draw.#self__
        let ctx = Draw.#self__.#ctx

        ctx.clearRect(0, 0, self.screen.x, self.screen.y)

        let layers = self.#Map.layers

        let sprites = self.#characters.getList()
        let hero = sprites[0]
        let minX = Math.floor(hero.getX() - 3)
        let maxX = Math.round(hero.getX() + 3)
        let minY = Math.floor(hero.getY() - 3)
        let maxY = Math.round(hero.getY() + 3)
        for (let y = minY; y < maxY; y++) {
            for (let i = minX; i < maxX; i++) {
                if (onType(layers[y]?.all[i], Tile)) {
                    self.tile_draw(
                        layers[y]?.all[i]?.pos.x,
                        layers[y]?.all[i]?.pos.y,
                        layers[y]?.all[i]?.style
                    )
                }
            }
        }
        for (let y = minY; y < maxY; y++) {
            for (let i = 0; i < sprites.length; i++) {
                if (Math.ceil(sprites[i].getY()) == y && Math.floor(sprites[i].getX()) > minX - 0.2 && Math.ceil(sprites[i].getX() < maxX + 0.2)) {
                    self.sprite_draw(sprites[i], sprites[i].style)
                }
            }
            for (let i = minX; i < maxX; i++) {
                if (onType(layers[y]?.all[i], Block)) {
                    self.block_draw(
                        layers[y]?.all[i]?.pos.x,
                        layers[y]?.all[i]?.pos.y,
                        layers[y]?.all[i]?.style
                    )
                }
            }
        }
    }

    map_scale(e) {
        if (e.deltaY < 0) {
            if (Draw.#self__.#scale >= 11) {
                return
            }
            Draw.#self__.#scale += 0.1
        } else {
            if (Draw.#self__.#scale <= 0.5) {
                return
            }
            Draw.#self__.#scale -= 0.1
        }
    }
    map_down(e) {
        Draw.#self__.m = true
        Draw.#self__.old.set(e.clientX, e.clientY)
    }
    map_up(e) {
        Draw.#self__.m = false
        Draw.#self__.old.clear()
        Draw.#self__.vec.clear()
    }
    map_move(e) {
        let self = Draw.#self__
        if (!self.m) {
            return
        }
        self.vec.set(e.clientX - self.old.x, e.clientY - self.old.y)

        self.old.set(e.clientX, e.clientY)
    }
    loop() {
        var thisFrameTime2 = (thisTime2 = new Date) - lastTime2;
        frameTime2 += (thisFrameTime2 - frameTime2) / filterStrength2;
        lastTime2 = thisTime2;

        Draw.#self__.map_draw()
        setTimeout(Draw.#self__.loop, 1000 / Draw.#self__.fps)
    }
}

function onType(target, type) {
    return target instanceof type
}

function mapping(context, pos, size, count) {
    for (var x = 0.5; x < size.x; x += size.x / count.x) {
        context.beginPath()
        context.moveTo(x + pos.x, pos.y)
        context.lineTo(x + pos.x, pos.y + size.y)
        context.strokeStyle = "#888"
        context.stroke()
        context.closePath()
    }
    for (var y = 0.5; y < size.y; y += size.y / count.y) {
        context.beginPath()
        context.moveTo(pos.x, y + pos.y)
        context.lineTo(pos.x + size.x, y + pos.y)
        context.strokeStyle = "#888"
        context.stroke()
        context.closePath()
    }
}