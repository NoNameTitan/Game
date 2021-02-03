// Types
/**
 * @typedef {( ) => void } alpha
 */
/**
 * @typedef {( value: any, index: number ) => (void|boolean) } iterable
 */



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
let classes = {}
function Mono_() {
    if (this instanceof Mono_) {
        delete this
        return new Error("is object for extends")
    }
    if (!is.empty(classes[this.constructor.name])) {
        delete this
        return new Error("is object a life")
    }
    this.self = Mono_
}


class Mono {
    static #classes = {}
    constructor() {
        // if (this instanceof Mono) {
        //     delete this
        //     return new Error("is object for extends")
        // }
        if (!is.empty(Mono.#classes[this.constructor.name])) {
            delete this
            throw new Error("is object a life")
        }
        Mono.#classes[this.constructor.name] = this
    }
}

const is = {
    empty: (value) => {
        return (value == undefined || value == null)
    },
    func: (value) => {
        return (typeof value == "function")
    },
    class_: (value) => {
        return (value == globalThis || is.empty(value))
    },
    /**
     * @type {( value: any ) => boolean }
     * @param { any }
     * @returns { boolean }
     */
    arr: Array.isArray.bind(null)
}

/**
 * @param { number } x
 * @param { number } y
 */
function v2(x, y) {
    if (is.class_(this)) {
        return new v2(x, y)
    }
    this.x = (x || 0)
    this.y = (y || 0)
}

EXTENDS(v2, {
    set: function (x, y) {
        this.x = (x || 1)
        this.y = (y || 1)
    },
    add: function (x = 0, y = 0) {
        this.x = this.x + x
        this.y = this.y + y
    },
    addX: function (x = 0) {
        this.x = this.x + x
    },
    addY: function (y = 0) {
        this.y = this.y + y
    },
    push: function (second = v2()) {
        this.x = this.x + second.x
        this.y = this.y + second.y
    },
    copy: function (x, y) {
        return v2(this.x * (x || 1), this.y * (y || 1))
    },
    clear: function () {
        this.x = this.y = 0
    }
})

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
        return v3(this.x * (x || 1), this.y * (y || 1), this.z * (z || 1))
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

export {
    v2,
    v3,
    is,
    EXTENDS,
    Mono,
    // Mono_,
    forEach,
    logger
}