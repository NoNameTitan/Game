import Draw from "../draw/draw_.js"
import Engine from "./engine_.js"

class Main extends Engine {
    constructor() {
        super()
        this.use(new Draw(document.getElementById("canvas")))
        this.init()
        this.start()
    }
}
let main = new Main()

export default Main