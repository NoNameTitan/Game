import { is } from "./math_.js";

const scaled_cosine = i => 0.5 * (1.0 - Math.cos(i * Math.PI))
const PERLIN_YWRAPB = 4
const PERLIN_YWRAP = 1 << PERLIN_YWRAPB
const PERLIN_ZWRAPB = 8
const PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB
const PERLIN_SIZE = 4095

let perlin_octaves = 4
let perlin_amp_falloff = 0.5

export default class Noise {

    //#region Private
    /** @type { number } */ #m
    /** @type { number } */ #a
    /** @type { number } */ #c
    /** @type { number } */ #seed
    /** @type { number } */ #z
    /** @type { number } */ #zz
    //#endregion

    /**
     * @param { number } seed
     */
    constructor(seed) {
        this.#m = 4294967296
        this.#a = 1664525
        this.#c = 1013904223
        this.#seed = this.#z = this.#zz = (is.empty(seed) ? Math.random() * this.#m : seed) >>> 0
        this.noise = []
    }
    get point() {
        this.#z = (this.#a * this.#z + this.#c) % this.#m
        let r = this.#z / this.#m
        return r
    }
    get Seed() { return this.#seed }
    #point() {
        this.#zz = (this.#a * this.#zz + this.#c) % this.#m
        this.noise.push(this.#zz / this.#m)
    }
    simplex2(x, y = 0, z = 0) {
        for (let i = 0; i < PERLIN_SIZE + 1; i++) {
            this.#point()
        }
        return Noise.#NoiseSimplex2(x, y, z, this.noise)
    }
    /**
     * @param { number } x
     */
    static #NoiseSimplex2(x, y, z, p) {
        if (x < 0) x = -x
        if (y < 0) y = -y
        if (z < 0) z = -z

        let xi = Math.floor(x),
            yi = Math.floor(y),
            zi = Math.floor(z),
            xf = x - xi,
            yf = y - yi,
            zf = z - zi,
            rxf, ryf, n1, n2, n3,
            r = 0, ampl = 0.5

        for (let o = 0; o < perlin_octaves; o++) {
            let of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB)

            rxf = scaled_cosine(xf)
            ryf = scaled_cosine(yf)

            n1 = p[of & PERLIN_SIZE]
            n1 += rxf * (p[(of + 1) & PERLIN_SIZE] - n1)
            n2 = p[(of + PERLIN_YWRAP) & PERLIN_SIZE]
            n2 += rxf * (p[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2)
            n1 += ryf * (n2 - n1)

            of += PERLIN_ZWRAP
            n2 = p[of & PERLIN_SIZE]
            n2 += rxf * (p[(of + 1) & PERLIN_SIZE] - n2)
            n3 = p[(of + PERLIN_YWRAP) & PERLIN_SIZE]
            n3 += rxf * (p[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3)
            n2 += ryf * (n3 - n2)

            n1 += scaled_cosine(zf) * (n2 - n1)

            r += n1 * ampl; ampl *= perlin_amp_falloff;
            xi <<= 1; xf *= 2; yi <<= 1; yf *= 2; zi <<= 1; zf *= 2;

            if (xf >= 1.0) { xi++; xf--; }
            if (yf >= 1.0) { yi++; yf--; }
            if (zf >= 1.0) { zi++; zf--; }
        }
        return r
    }
    /**
     * Returns the HSL color model
     * 
     * 0º | 360º >>> Reds
     * 
     * 120º >>> Greens
     * 
     * 240º >>> Blues
     * 
     * @param { number } hue This parameter takes values in (0...359) degrees
     * @param { number } saturate The default saturate is 100 percent
     * @param { number } brightnes The default brightness is 50 percent
     */
    static to_hsl(hue, saturate, brightness) {
        if ("number" !== typeof hue) { throw new Error("The Hue is not a digit") }
        is.empty(saturate) ? saturate = 100 : void 0
        is.empty(brightness) ? brightness = 50 : void 0
        return `hsl(${hue % 360}, ${saturate}%, ${brightness}%)`
    }
}