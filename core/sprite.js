class Sprite {
    static #list = new Array
    #pos
    #to

    constructor(name = "Sprite", radius = 0.3, style = [255, 255, 255]) {
        this.name = name
        this.state = {
            w: false,
            a: false,
            s: false,
            d: false,
        }
        this.#pos = v2()
        this.#to = v2()
        this.radius = radius
        this.style = style
        this.speed = 0.02
        Sprite.#list.push(this)
    }

    static getList() {
        return Sprite.#list
    }
    /**
     * @param {( sprite: Sprite, index: number )=>any } callback
     */
    static forEachWithOutHero(callback) {
        var arr = Sprite.#list
        for (let i = 0; i < arr.length; i++) {
            if (!(arr[i] instanceof Hero)) {
                callback(Sprite.#list[i], i)
            }
        }
    }
    /**
     * @param {( sprite: Sprite, index: number )=>any } callback
     */
    static forEach(callback) {
        for (let i = 0; i < Sprite.#list.length; i++) {
            callback(Sprite.#list[i], i)
        }
    }
    updateX(keyState) {
        if (keyState.KeyA && keyState.KeyD) {
            this.setX(0)
        } else if (keyState.KeyA) {
            this.setX(this.speed * (-1))
        } else if (keyState.KeyD) {
            this.setX(this.speed)
        } else {
            this.setX(0)
        }
        this.#pos.addX(this.#to.x)
    }
    updateY(keyState) {
        if (keyState.KeyW && keyState.KeyS) {
            this.setX(0)
        } else if (keyState.KeyW) {
            this.setY(this.speed * (-1))
        } else if (keyState.KeyS) {
            this.setY(this.speed)
        } else {
            this.setY(0)
        }
        this.#pos.addY(this.#to.y)
    }
    getPos(x, y) {
        return this.#pos.copy(x, y)
    }
    getX(x) {
        return this.#pos.x * (x | 1)
    }
    getY(y) {
        return this.#pos.y * (y | 1)
    }
    getTo() {
        return this.#to
    }
    setPos(x, y) {
        this.#pos.set(x, y)
    }
    setPosX(x) {
        this.#pos.x = x || 0
    }
    setPosY(y) {
        this.#pos.y = y || 0
    }
    setTo(x, y) {
        this.#to.set(x, y)
    }
    setX(x) {
        this.#to.x = x
    }
    setY(y) {
        this.#to.y = y
    }
    clear() {
        this.#to.clear()
    }
}

class Hero extends Sprite {
    /** @type { Hero } */
    static #self__

    constructor(style = [255, 255, 255]) {
        if ((Hero.#self__ == undefined) || (Hero.#self__ == null)) {
            super("Hero", 0.3, style)
            this.size = v3(24, 24, 32)
            Hero.#self__ = this
        } else {
            return Hero.#self__
        }
    }
    init(x, y) {
        Hero.#self__.setPos(x, y)
        // document.addEventListener("keydown", Hero.#self__.move)
        // document.addEventListener("keyup", Hero.#self__.stop)
    }
    move(ev) {
        let self = Hero.#self__
        if (ev.code == "KeyW") { self.state.w = true }
        if (ev.code == "KeyA") { self.state.a = true }
        if (ev.code == "KeyS") { self.state.s = true }
        if (ev.code == "KeyD") { self.state.d = true }
    }
    stop(ev) {
        let self = Hero.#self__
        if (ev.code == "KeyW") { self.state.w = false }
        if (ev.code == "KeyA") { self.state.a = false }
        if (ev.code == "KeyS") { self.state.s = false }
        if (ev.code == "KeyD") { self.state.d = false }
    }
}