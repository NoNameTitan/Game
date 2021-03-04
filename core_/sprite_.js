import { v2 } from "./math_.js";

class Sprite2D {
    //#region Static Private
    // static #list = new Array
    //#endregion

    //#region Private
    #pos
    #to
    //#endregion

    constructor(name = "Sprite") {
        this.name = name
        this.#pos = v2()
        this.#to = v2()
        // Sprite2D.#list.push(this)
    }

    //#region Static Public
    static getList() {
        // return Sprite2D.#list
    }
    /**
     * @param {( sprite: Sprite, index: number )=>any } callback
     */
    static forEach(callback) {
        // for (let i = 0; i < Sprite.#list.length; i++) {
        //     callback(Sprite.#list[i], i)
        // }
    }
    //#endregion

    //#region Update position
    updateX() {
        this.#pos.addX(this.#to.x)
    }
    updateY() {
        this.#pos.addY(this.#to.y)
    }
    //#endregion

    //#region Get position
    /**
     * @param { number } x
     * @param { number } y
     * @returns { v2 }
     */
    getPos(x, y) {
        return this.#pos.copy(x, y)
    }
    /**
     * @param { number } x
     */
    getX(x) {
        return this.#pos.x * (x | 1)
    }
    /**
     * @param { number } y
     */
    getY(y) {
        return this.#pos.y * (y | 1)
    }
    getTo() {
        return this.#to
    }
    //#endregion

    //#region Set position
    /**
     * @param { number } x
     * @param { number } y
     */
    setPos(x, y) {
        this.#pos.set(x, y)
    }
    /**
     * @param { number } x
     */
    setPosX(x) {
        this.#pos.x = x || 0
    }
    /**
     * @param { number } y
     */
    setPosY(y) {
        this.#pos.y = y || 0
    }
    /**
     * @param { number } x
     * @param { number } y
     */
    setTo(x, y) {
        this.#to.set(x, y)
    }
    /**
     * @param { number } x
     */
    setX(x) {
        this.#to.x = x
    }
    /**
     * @param { number } y
     */
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

globalThis.sprite = Sprite2D
export default Sprite2D