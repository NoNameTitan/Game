var out = $("#tick")
var filterStrength = 20;
var frameTime = 0, lastTime = new Date, thisTime


class Main {
    /** @type { Main } */
    static #self__
    static mapSize = v2(16, 8)
    static #block = v3(32, 32, 24)
    /** @type { BigMap } */
    #map
    /** @type { Sprite[] } */
    #enemy
    /** @type { Hero } */
    #hero
    /** @type { Draw } */
    #draw
    #characters = Sprite
    #matrix = Matrix

    constructor(canvas = document.createElement("canvas")) {
        if ((Main.#self__ == undefined) || (Main.#self__ == null)) {
            this.#map = new BigMap(Main.mapSize, Main.block)
            this.#hero = new Hero()
            this.#draw = new Draw(canvas, this.#map, Sprite, Main.block)
            this.#enemy = new Array()
            this.keyState = {
                KeyW: false,
                KeyA: false,
                KeyS: false,
                KeyD: false
            }

            Main.#self__ = this
        } else {
            return Main.#self__
        }
    }
    hasKeyMove(keyCode) {
        var res = false
        var keyState = Main.getData().self.keyState
        for (const key in keyState) {
            if (keyState.hasOwnProperty(key)) {
                if (keyCode == key) {
                    return true
                }
            }
        }
        return false
    }
    keyMove(ev) {
        var { self } = Main.getData()
        if (self.hasKeyMove(ev.code)) {
            self.keyState[ev.code] = true
        }
    }
    keyStop(ev) {
        var { self } = Main.getData()
        if (self.hasKeyMove(ev.code)) {
            self.keyState[ev.code] = false
        }
    }

    init() {
        for (let i = 0; i < 11; i++) {
            this.#enemy.push(new Sprite("Enemy", 0.4, colors.violet))
            this.#enemy[i].setPos(
                Math.random() * (Main.mapSize.x - 4) + 2,
                Math.random() * (Main.mapSize.y - 4) + 2
            )
            this.#enemy[i].setTo(-0.002, -0.02)
        }
        this.#hero.init((Main.mapSize.x / 2), (Main.mapSize.y / 2))
        this.#draw.init()
        setInterval(function () {
            out.innerHTML = (1000 / frameTime).toFixed(1) + " tick";
        }, 1000);


        document.addEventListener("keydown", this.keyMove)
        document.addEventListener("keyup", this.keyStop)
        this.tick()
    }
    static getData() {
        return {
            self: Main.#self__,
            map: Main.#self__.#map,
            characters: Main.#self__.#characters,
            matrix: Main.#self__.#matrix,
            hero: Main.#self__.#hero
        }
    }
    getRandomMove() {
        var k = {
            KeyW:false,
            KeyA:false,
            KeyS:false,
            KeyD:false
        }
        if (Math.random() > Math.random()) {
            k.KeyW = true
        }
        else  {
            k.KeyS = true
        }
        if (Math.random() > Math.random()) {
            k.KeyA = true
        }
        else {
            k.KeyD = true
        }
        return k
    }
    move(sprite) {
        let { self } = Main.getData()
        let pos = sprite.getPos()
        let arr = self.getArrPos(pos.x, pos.y)
        if (sprite instanceof Hero) {
            sprite.updateX(self.keyState)
        } 
        // else {
        //     sprite.updateX(self.getRandomMove())
        // }

        for (let wall of arr) {
            collisionDetectX(sprite, wall)
        }
        if (sprite instanceof Hero) {
            sprite.updateY(self.keyState)
        } 
        // else {
        //     sprite.updateY(self.getRandomMove())
        // }
        for (let wall of arr) {
            collisionDetectY(sprite, wall)
        }
    }
    tick() {
        let thisFrameTime = (thisTime = new Date) - lastTime;
        frameTime += (thisFrameTime - frameTime) / filterStrength;
        lastTime = thisTime;
        let { self, map, characters, matrix, hero } = Main.getData()

        self.#draw.update()
        self.move(hero)
        // characters.forEach((sprite) => {
        //     self.move(sprite)
        // });
        setTimeout(Main.#self__.tick, 1000 / 75)
    }
    getArrPos(x, y) {
        let { self, matrix } = Main.getData()
        let arr = []
        for (let x_ of self.rangePos(x - 1, 2)) {
            for (let y_ of self.rangePos(y - 1, 2)) {
                let z = matrix.getBlock(x_, y_)
                if (onType(z, Block)) {
                    arr.push(z)
                }
            }
        }
        return arr
    }
    rangePos(from, to) {
        let max = Math.ceil(from + to)
        let result = []
        let pos = from
        do {
            if (!result.includes(Math.floor(pos))) {
                result.push(Math.floor(pos))
            }
            pos += 1
        } while (pos < max)
        return result
    }
}



function collisionDetectX(target, wall) {
    let pos = target.getPos()

    if ((Math.floor(pos.y - target.radius) == wall.pos.y || (Math.ceil(pos.y - (1 - target.radius)) == wall.pos.y))
        && pos.x > wall.pos.x) {
        if (pos.x - (1 + target.radius) < wall.pos.x && target.getTo().x < 0) {
            target.setPosX(wall.pos.x + (1 + target.radius))
            target.setX(0)
        }
    } else if ((Math.floor(pos.y - target.radius) == wall.pos.y || (Math.ceil(pos.y - (1 - target.radius)) == wall.pos.y))
        && pos.x < wall.pos.x) {
        if (pos.x + target.radius > wall.pos.x && target.getTo().x > 0) {
            target.setPosX(wall.pos.x - target.radius)
            target.setX(0)
        }
    }
}
function collisionDetectY(target, wall) {
    let pos = target.getPos()

    if ((Math.floor(pos.x - target.radius) == wall.pos.x || (Math.ceil(pos.x - (1 - target.radius)) == wall.pos.x))
        && pos.y > wall.pos.y) {
        if (pos.y - (1 + target.radius) < wall.pos.y && target.getTo().y < 0) {
            target.setY(0)
            target.setPosY(wall.pos.y + (1 + target.radius))
        }
    } else if ((Math.floor(pos.x - target.radius) == wall.pos.x || (Math.ceil(pos.x - (1 - target.radius)) == wall.pos.x))
        && pos.y < wall.pos.y) {
        if (pos.y + target.radius > wall.pos.y && target.getTo().y > 0) {
            target.setY(0)
            target.setPosY(wall.pos.y - target.radius)
        }
    }
}