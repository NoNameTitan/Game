import { is, forEach } from "./math_.js"

//#region Types
/**
 * @typedef {( self: object | {} ) => void } alphaSelf
 */
//#endregion

class Event {
    /** @type { string[] } */ #eventNames
    /** @type {{ "init": ( self: object ) => void }} */ #events
    /**
     * @param { string[] } eventNames
     */
    constructor(eventNames) {
        if (!(is.array(eventNames) && "string" == typeof eventNames[0])) throw new TypeError("Bad EventNames")
        this.#eventNames = [...eventNames]
        this.#events = {}

        forEach(["on", "once", "destroy"], fn => {
            this[fn] = this[fn].bind(this)
        })
    }
    static init(eventNames = ["init"]) {
        let self = new Event(eventNames)
        return {
            self: self,
            /**
             * @param { string } eventName
             * @param { {} | undefined } self
             * @param { ...any } args
             */
            callEvent: (eventName, ...args) => {
                if (self.#eventNames.includes(eventName) &&
                    !is.empty(self.#events[eventName])) {
                    self.#events[eventName](...args)
                    return true
                }
                return false
            },
            /**
             * @param { string } eventName
             * @param { alphaSelf } callback
             * @param {{ once: boolean }} options
             */
            addEvent: (eventName, callback, options = {}) => {
                if (options?.once) return self.once(eventName, callback)
                else return self.on(eventName, callback)
            }
        }
    }
    /**
     * @param { string } eventName
     * @param { alphaSelf } callback
     */
    on(eventName, callback) {
        if (this.#eventNames.includes(eventName)) {
            this.#events[eventName] = callback
            return true
        }
        return false
    }
    /**
     * @param { string } eventName
     * @param { alphaSelf } callback
     */
    once(eventName, callback) {
        if (this.#eventNames.includes(eventName)) {
            let fn = (...args) => {
                callback(...args)
                this.#events[eventName] = undefined
            }
            this.#events[eventName] = fn.bind(this)
            return true
        }
        return false
    }
    destroy() { delete this }
}
export default Event