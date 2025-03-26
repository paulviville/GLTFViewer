import * as THREE from './three/three.module.js';

export default class SceneSynchronizer {
    #sceneDescriptor;
    #sceneInterface;

    constructor ( sceneInterface, sceneDescriptor ) {
		console.log("SceneSynchronizer - constructor");
        this.#sceneDescriptor = sceneDescriptor;
        this.#sceneInterface = sceneInterface;
    }

    getObjectsList ( ) {
        return this.#sceneInterface.objectsMap.keys();
    }

    getMatrix ( name ) {
        return this.#sceneDescriptor.getMatrix(this.#sceneDescriptor.getNode(name));
    }

    setMatrix ( name, matrix, emit = false ) {
        this.#sceneDescriptor.setMatrix(this.#sceneDescriptor.getNode(name), matrix);

        const object = this.getObject(name);
        matrix.decompose(object.position, object.quaternion, object.scale);

        if( emit ) {
            /// messaging logic
        }
    }

    getWorldMatrix ( name ) {
        return this.#sceneDescriptor.getWorldMatrix(this.#sceneDescriptor.getNode(name));
    }
    
    getObject ( name ) {
        return this.#sceneInterface.getObject(name);
    }

    requestControl ( name ) {
        const accepted = this.#sceneDescriptor.selectNode(this.#sceneDescriptor.getNode(name));
        
        /// messaging logic

        return accepted;
    }

    releaseControl ( name ) {
        this.#sceneDescriptor.deselectNode(this.#sceneDescriptor.getNode(name));
 
        /// messaging logic
    }

    receiveMessage ( message ) {
        /// message handling logic
    }

    emitMessage ( data ) {
        /// message emitting logic
    }
}