export default class Light {
    #type;
    #color;
    #intensity;
    
    constructor ( type, color, intensity ) {
        this.#type = type;
        this.#color = color;
        this.#intensity = intensity;
    }

    get type ( ) {
        return this.#type;
    }

    get color ( ) {
        return this.#color;
    }

    get intensity ( ) {
        return this.#intensity;
    }
}