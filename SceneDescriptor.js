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
    #nodeData = this.#nodes.addAttribute("data");
    #roots = new Set();

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
        console.log(this.#roots)
        this.#nodes.forEach(node => {
            this.#setParentage(node);
        });

        this.#nodes.forEach(node => {
            console.log(
                node,
                this.#nodeName[node],
                this.#nodeChildren[node], 
                this.#nodeParent[node], 
                this.#nodeType[node], 
                this.#nodeData[node]);
        });

    }

    #addNode ( nodeData ) {
		console.log("SceneDescriptor - #addNode");
        
        const node = this.#nodes.newElement();
        this.#nodes.ref(node); 
        this.#nodeName[node] = nodeData.name || `node${node}`;
        
        this.#nodeMatrix[node] = new THREE.Matrix4();
        if( nodeData.matrix )
            this.#nodeMatrix[node].fromArray(nodeData.matrix);

        this.#nodeChildren[node] = [];
        if( nodeData.children ) 
            this.#nodeChildren[node].push(...nodeData.children);

        this.#nodeParent[node] = -1;
        this.#roots.add(node);

        this.#nodeData[node] = {};
        if(nodeData.extensions?.KHR_lights_punctual) {
			this.#nodeType[node] = "light";
			this.#nodeData[node]["light"] = nodeData.extensions?.KHR_lights_punctual.light;
		}
		if(nodeData.mesh) {
			this.#nodeType[node] = "mesh";
			this.#nodeData[node]["mesh"] = nodeData.mesh;
		}

        return node;
    }

    #deleteNode ( node ) {
		console.log("SceneDescriptor - #deleteNode");
        this.#nodeMatrix[node].identity();
        this.#nodeChildren[node].length = 0;
        this.#nodeParent[node] = -1;

    }

    #setParentage ( node ) {
        for( const childNode of this.#nodeChildren[node] ) {
            this.#nodeParent[childNode] = node;
            this.#roots.delete(childNode); 
        }
    }

}