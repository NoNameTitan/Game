import { is } from "./math_.js";
// Types
/**
 * @typedef {(
 *      eventName: string,
 *      self: {} | undefined,
 *      ...args)=> void
 * } callEvent_
 */
/**
 * @typedef {( self: object ) => void } alphaSelf
 */
/**
 * @returns {{
 *      self: Event,
 *      callEvent: callEvent_
 * }}
 */

class Event {
    /** @type { string[] } */
    #eventNames
    /** @type {{ "init": ( self: object ) => void }} */
    #events
    constructor(eventNames = ["init"]) {
        this.#eventNames = []
        this.#events = {}
        this.#eventNames.push(...eventNames)

        return {
            self: this,
            /** @type { callEvent_ } */
            callEvent: (eventName, self, ...args) => {
                if (this.#eventNames.includes(eventName) &&
                    !is.empty(this.#events[eventName])) {
                    this.#events[eventName].call(self, ...args)
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
                let a, b
                if (options?.once) {
                    a = this.once(eventName, callback)
                } else {
                    b = this.on(eventName, callback)
                }
                return (a || b)
            }
        }
    }
    /**
     * @param { string } eventName
     * @param {( self: object ) => void } callback
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
     * @param {( self: object ) => void } callback
     */
    once(eventName, callback) {
        if (this.#eventNames.includes(eventName)) {
            this.#events[eventName] = function (...args) {
                callback(this, ...args)
                this.#events[eventName] = undefined
            }
            return true
        }
        return false
    }
    destroy() {
        delete this
    }
}
export default Event