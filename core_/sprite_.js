import { v2 } from "./math_.js";

class Sprite2D {
    //#region Static Private
    static #list = new Array
    //#endregion

    //#region Private
    #pos
    #to
    //#endregion

    constructor(name = "Sprite", radius = 0.3, style = [255, 255, 255]) {
        this.name = name
        this.#pos = v2()
        this.#to = v2()
        this.radius = radius
        this.style = style
        this.speed = 0.02
        Sprite.#list.push(this)
    }

    //#region Static Public
    static getList() {
        return Sprite.#list
    }
    /**
     * @param {( sprite: Sprite, index: number )=>any } callback
     */
    static forEach(callback) {
        for (let i = 0; i < Sprite.#list.length; i++) {
            callback(Sprite.#list[i], i)
        }
    }
    //#endregion

    //#region Update position
    updateX() {
        this.#pos.addX(this.#to.x)
    }
    updateY(keyState) {
        this.#pos.addY(this.#to.y)
    }
    //#endregion

    //#region Get position
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
    //#endregion

    //#region Set position
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

    //#endregion

    //#region Clear move position
    clear() {
        this.#to.clear()
    }
    //#endregion
}   