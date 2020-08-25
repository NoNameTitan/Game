class BigMap {
    #block
    #size
    constructor(size = v2(50, 50), block = v3(32, 32, 24)) {
        this.#size = size
        this.#block = block
        /** @type { Block[] } */
        this.layers = new Array()
    }
    init(){
        for (let y = 0; y < this.#size.y; y++) {
            this.layers[y] = new Matrix(y)
            if (y == 0 || y == this.#size.y-1){
                for (let x = 0; x < this.#size.x; x++) {
                    this.layers[y].add(new Block(x, y, colors.red))
                }
            }else{
                this.layers[y].add(new Block(0,y,colors.red))
                for (let x = 1; x < this.#size.x - 1; x++) {
                    this.layers[y].add(new Tile(x, y, colors.green))
                }
                this.layers[y].add(new Block(this.#size.x - 1, y, colors.blue))
            }
            this.layers[y].sort()
        }
    }
}