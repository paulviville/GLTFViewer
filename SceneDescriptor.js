import AttributesContainer from "./AttributesContainer.js";
import * as THREE from './three/three.module.js';

// class NodesManager {
//     #nodes = new AttributesContainer();
//     #names = 
// }

export default class SceneDescriptor {
    // #nodeManager = new NodesManager();
    #nodes = new AttributesContainer();
    #nodeName = this.#nodes.addAttribute("name");
    #nodeMatrix = this.#nodes.addAttribute("matrix");
    #nodeChildren = this.#nodes.addAttribute("children");
    #nodeParent = this.#nodes.addAttribute("parent");
    #nodeType = this.#nodes.addAttribute("type");

    constructor ( ) {
		console.log("SceneDescriptor - constructor");

    }

    loadGLTF ( gltf ) {
		console.log("SceneDescriptor - loadGLTF");

        for( const nodeData of gltf.nodes ) {
			// console.log(nodeData);
			const node = this.#addNode(nodeData);
			// console.log(node);
		}

    }

    #addNode ( nodeData ) {
		console.log("SceneDescriptor - #addNode");
        
        const node = this.#nodes.newElement();
        this.#nodeName[node] = nodeData.name || `node${node}`;
        
        this.#nodeMatrix[node] = new THREE.Matrix4();
        if( nodeData.matrix )
            this.#nodeMatrix[node].fromArray(nodeData.matrix);

        this.#nodeChildren[node] = [];
        if( nodeData.children ) 
            this.#nodeChildren[node].push(...nodeData.children);



        return node;
    }
}