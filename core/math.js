const $ = document.querySelector.bind(document)

function _if(bool, callback) {
    if (this == globalThis) {
        return new __if(false, bool, callback)
    }
}
class __if {
    #bool
    #callback
    #done
    constructor(done = false, bool = false, callback = () => { }) {
        this.#bool = bool
        this.#callback = callback
        this.#done = done
        this.init()
    }
    init() {
        if (!!(this.#bool) && !(this.#done)) {
            this.#done = true
            this.#callback()
            return new __if()
        } else {
            return this
        }
    }
    then(callback) {
        if (!(this.#done) && this.#bool) {
            this.#done = true
            callback()
            return new __if(true)
        } else {
            return new __if(false)
        }
    }
    elif(bool = false, callback = () => { }) {
        if (!!(bool)) {
            if (this.#done) {
                return new __if(true)
            } else {
                callback()
                return new __if(true)
            }
        } else {
            if (this.#done) {
                return new __if(true)
            }
            else {
                return new __if(false)
            }
        }
    }
    else_(callback) {
        if (!(this.#done)) {
            return callback()
        }
    }
}

/**
 * @param { number } x
 * @param { number } y
 */
function v2(x, y) {
    if (this == globalThis) {
        return new v2(x, y)
    }
    this.x = x || 0
    this.y = y || 0
}
v2.prototype.set = function (x, y) {
    this.x = x
    this.y = y
}
v2.prototype.add = function (x = 0, y = 0) {
    this.x = this.x + x
    this.y = this.y + y
}
v2.prototype.addX = function (x = 0) {
    this.x = this.x + x
}
v2.prototype.addY = function (y = 0) {
    this.y = this.y + y
}
v2.prototype.push = function (second = v2()) {
    this.x = this.x + second.x
    this.y = this.y + second.y
}
v2.prototype.copy = function (x, y) {
    return { x: this.x * (x || 1), y: this.y * (y || 1) }
}
v2.prototype.clear = function () {
    this.x = this.y = 0
}


/**
 * @param { number } x
 * @param { number } y
 * @param { number } z
 */
function v3(x, y, z) {
    if (this == globalThis) {
        return new v3(x, y, z)
    }
    this.x = x || 0
    this.y = y || 0
    this.z = z || 0
}
v3.prototype.set = function (x, y, z) {
    this.x = x
    this.y = y
    this.z = z
}
v3.prototype.add = function (x = 0, y = 0, z = 0) {
    this.x = this.x + x
    this.y = this.y + y
    this.z = this.z + z
}
v3.prototype.push = function (second = v3()) {
    this.x = this.x + second.x
    this.y = this.y + second.y
    this.z = this.z + second.z
}
v3.prototype.copy = function (x, y, z) {
    return { x: this.x * (x || 1), y: this.y * (y || 1), z: this.z * (z || 1) }
}
v3.prototype.clear = function () {
    this.x = this.y = this.z = 0
}


class Matrix {
    static listY = new Array()
    static length = 0
    constructor(y) {
        this.blocks = new Array()
        this.tiles = new Array()
        this.all = new Array()
        this.y = y
        Matrix.listY.push(this)
        Matrix.length++
    }
    sort() {
        let all = [], blocks = [], tiles = []
        this.all.forEach((value, i) => {
            if (onType(value, Block)) {
                blocks.push(value)
            } else {
                tiles.push(value)
            }
        })
        this.all.sort(sortX)
        this.blocks = blocks.sort(sortX)
        this.tiles = tiles.sort(sortX)
    }
    add(value) {
        this.all.push(value)
    }
    reset(values) {
        if (Array.isArray(values)) {
            this.all = values
        }
    }
    addRow(x, values) {
        let index = 0
        for (let i = x; i < values.length; i++) {
            this.blocks[i] = values[index]
            index++
        }
    }
    forEach(callback) {
        for (let i = 0; i < this.all.length; i++) {
            callback(this.all[i], i)
        }
    }
    forBlock(callback) {
        for (let i = 0; i < this.blocks.length; i++) {
            callback(this.blocks[i], i)
        }
    }
    static forBlock(callback) {
        for (let i = 0; i < Matrix.listY.length; i++) {
            Matrix.listY[i].forBlock(callback)
        }
    }
    static getBlock(x,y){
        return Matrix.listY[y]?.all[x]
    }
}

function onType(target, type) {
    return target instanceof type
}
function sortX(a, b) {
    return a.x - b.x
}


let colors = {
    white: [253, 255, 252],
    black: [28, 28, 28],
    red: [214, 40, 40],
    green: [5, 214, 158],
    blue: [4, 102, 200],
    violet: [122, 0, 122]
}

/**
 * @param { number[] } target
 */
function rgb(target) {
    return `rgb(${target[0]}, ${target[1]}, ${target[2]})`
}
/**
 * @param { number[] } target
 * @param { number[] } add
 */
function rgb_assets(target, add) {
    let result = new Array()
    for (let i = 0; i < 3; i++) {
        result[i] = target[i] + add[i]
        if (target[i] + add[i] > 255) {
            result[i] = 255
        }
        if (target[i] + add[i] < 0) {
            result[i] = 0
        }
    }
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`
}