class Block {
    static #size__ = v3(32, 32, 24)
    #size

    constructor(x = -1, y = -1, style = [255, 255, 255]) {
        this.pos = v2(x, y)
        this.#size = Block.#size__
        this.style = style
    }

    setPos(x, y) {
        this.pos.set(x, y)
    }
    setSize(x, y, z) {
        this.#size = v3(x, y, z)
    }
    setBlock(size) {
        this.#size = v3(size, size, (size / 4 * 3))
    }
    setStandart() {
        this.#size = Block.#size__
    }
    getSize() {
        return this.#size
    }
    getset(x, y) {
        this.pos.set(x, y)
        return this
    }
    copy(x, y) {
        return this.pos.copy(x, y)
    }
    static getBlock() {
        return Block.#size__
    }
}

class Tile {
    constructor(x, y, style = [255, 255, 255]) {
        this.pos = v2(x, y)
        this.size = v2(32, 32)
        this.style = style
    }
}