export class Primitive {
    #attributes;
    #indices;
    #material;
    #mode;

    constructor ( attributes, indices, material, mode ) {
        this.#attributes = attributes;
        this.#indices = indices;
        this.#material = material;
        this.#mode = mode;
    }
}

export default class Mesh {
    #primitives;

    constructor ( ) {
        this.#primitives = [];
    }

    get primitives ( ) {
        return this.#primitives;
    }

    addPrimitive ( attributes, indices, material, mode ) {
        const primitive = new Primitive(attributes, indices, material, mode);
        this.#primitives.push(primitive);
    }
}