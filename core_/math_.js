//#region Types
/** @typedef {( ) => void } alpha */
/** @typedef { number } n */
/** @typedef {( value: any, index: number ) => (void|boolean) } iterable */
//#endregion




function logger(name, ...args) {
    let style = "color: DodgerBlue;"
    console.log("%c[log]: " + name, style)
    if (!is.empty(args[0])) {
        console.log("%c──┬──", style)
    }
    forEach(args, (x, i) => {
        if (i == args.length - 1) {
            console.log("%c  └  ", style, x)
        } else {
            console.log("%c  ├  ", style, x)
        }
    })
}

/**
 * @param { new { }} target
 * @param {{ }} proto
 */
function EXTENDS(target, proto) {
    for (let key in proto) {
        if (Object.hasOwnProperty.call(proto, key)) {
            target.prototype[key] = proto[key]
        }
    }
}
/**
 * @param { new { }} tardet
 * @param {{}[]} extend
 */
let getOwn__ = Object.getOwnPropertyNames
function Mixin(target, extend) {
    extend.forEach(p => {
        getOwn__(p.prototype).forEach(n => {
            if (!getOwn__(target.prototype).includes(n) && n.slice(0, 2) !== "__") target.prototype[n] = p.prototype[n]
        })
    })
}

class Mono {
    static #classes = {}
    constructor() {
        if (!is.empty(Mono.#classes[this.constructor.name])) {
            delete this
            throw new Error("is object a life")
        }
        Mono.#classes[this.constructor.name] = this
    }
}

const is = {
    empty: (value) => { return (value == undefined || value == null) },
    func: (value) => { return (typeof value == "function") },
    notClass: (value) => { return (value == globalThis || is.empty(value)) },
    /**
     * @type {( value: any ) => boolean }
     * @param { any }
     * @returns { boolean }
     */
    array: Array.isArray.bind(null),
    /**
     * @param { string } value
     */
    WASD: (value) => { return !!(value == "KeyW" | value == "KeyA" | value == "KeyS" | value == "KeyD") }
}

/**
 * @type {new (x:n,y:n)=>v2}
 * @param { number } x
 * @param { number } y
 * @property {v2} copy
 * @returns {{
 * x: n,
 * y: n,
 * copy: (x: n, y: n) => v2
 * }}
 */
function v2(x, y) {
    if (is.notClass(this)) return new v2(x, y)
    this.x = (x || 0)
    this.y = (y || 0)
}
/** 
 * @typedef {{
 * x: n,
 * y: n,
 * copy: (x: n, y: n) => v2
 * }} v2 
 */

EXTENDS(v2, {
    set: function (x = 1, y = 1) {
        this.x = x
        this.y = y
    },
    add: function (x = 0, y = 0) {
        this.x = this.x + x
        this.y = this.y + y
    },
    addX: function (x = 0) { this.x = this.x + x },
    addY: function (y = 0) { this.y = this.y + y },
    push: function (second = v2()) {
        this.x = this.x + second.x
        this.y = this.y + second.y
    },
    copy: function (x, y) { return new v2(this.x * (x || 1), this.y * (y || 1)) },
    clear: function () { this.x = this.y = 0 }
})

/**
 * @param { number } x
 * @param { number } y
 * @param { number } z
 */
function v3(x, y, z) {
    if (is.notClass(this)) {
        return new v3(x, y, z)
    }
    this.x = (x || 0)
    this.y = (y || 0)
    this.z = (z || 0)
}

EXTENDS(v3, {
    set: function (x, y, z) {
        this.x = x
        this.y = y
        this.z = z
    },
    add: function (x = 0, y = 0, z = 0) {
        this.x = this.x + x
        this.y = this.y + y
        this.z = this.z + z
    },
    push: function (second = v3()) {
        this.x = this.x + second.x
        this.y = this.y + second.y
        this.z = this.z + second.z
    },
    copy: function (x, y, z) {
        return new v3(this.x * (x || 1), this.y * (y || 1), this.z * (z || 1))
        // return { x: this.x * (x || 1), y: this.y * (y || 1), z: this.z * (z || 1) }
    },
    clear: function () {
        this.x = this.y = this.z = 0
    }

})
/**
 * @param { any[] } arr
 * @param { iterable } callback
 */
function forEach(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i) == true) {
            return
        }
    }
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
 * @param { number[] | v3 } value
 */
function rgb(value) {
    if (value instanceof v3) return `rgb(${value.x},${value.y},${value.z})`
    return `rgb(${value[0]},${value[1]},${value[2]})`
}
/**
 * @param { number[] | v3 } value
 * @param { number[] | v3 } add
 */
function rgb_assets_(value, add) {
    if (value instanceof v3) {
        value = [value.x, value.y, value.z]
    }
    if (add instanceof v3) {
        add = [add.x, add.y, add.z]
    }
    let result = []
    for (let i = 0; i < 3; i++) {
        result[i] = value[i] + add[i]
        if (value[i] + add[i] > 255) {
            result[i] = 255
        }
        if (value[i] + add[i] < 0) {
            result[i] = 0
        }
    }
    return `rgb(${result[0]},${result[1]},${result[2]})`
}
/**
 * @param { number[] } value
 * @param { number[] } add
 */
function rgb_assets(value, add) {
    let r = []
    for (let i = 0; i < 3; i++) {
        r[i] = value[i] + add[i]
        if (value[i] + add[i] > 255) r[i] = 255
        if (value[i] + add[i] < 0) r[i] = 0
    }
    return `rgb(${r[0]},${r[1]},${r[2]})`
}
export {
    v2,
    v3,
    is,
    EXTENDS,
    Mono,
    Mixin,
    forEach,
    logger,
    rgb,
    rgb_assets
}