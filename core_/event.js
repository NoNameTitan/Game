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
                }
            },
            /**
             * @param { string } eventName
             * @param { alphaSelf } callback
             * @param {{ once: boolean }} options
             */
            addEvent: (eventName, callback, options = {})=>{
                if (options?.once) {
                    this.once(eventName, callback)
                }else{
                    this.on(eventName, callback)
                }
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
        }
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
        }
    }
    destroy() {
        delete this
    }
}
export default Event