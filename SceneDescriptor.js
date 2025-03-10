import AttributesContainer from "./AttributesContainer.js";
import * as THREE from './three/three.module.js';

// class NodesManager {
//     #nodes = new AttributesContainer();
//     #names = 
// }

export default class SceneDescriptor {
    // #nodeManager = new NodesManager();
    #nodeMap = new Map();
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
			const node = this.#addNode(nodeData);
		}

        // this.#addNode({
        //     name: "sphere0_parent",
        //     children: [2],
        //     parent: 4
        // })


        // console.log(this.#roots)

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
                this.#nodeData[node],
                this.#nodeMatrix[node],
            );
        });

    }

    #addNode ( nodeData ) {
		console.log("SceneDescriptor - #addNode");
        
        const node = this.#nodes.newElement();
        this.#nodes.ref(node); 
        this.#nodeName[node] = nodeData.name || `node${node}`;
        this.#nodeMap.set(this.#nodeName[node], node);
        
        this.#nodeMatrix[node] = new THREE.Matrix4();
        if( nodeData.matrix )
            this.#nodeMatrix[node].fromArray(nodeData.matrix);

        this.#nodeChildren[node] = new Set();
        if( nodeData.children ) {
            for( const child of nodeData.children )
                this.#nodeChildren[node].add(child);
        }

        this.#nodeParent[node] = -1;
        this.#roots.add(node);

        this.#nodeData[node] = {};
        if( nodeData.extensions?.KHR_lights_punctual ) {
			this.#nodeType[node] = "light";
			this.#nodeData[node]["light"] = nodeData.extensions?.KHR_lights_punctual.light;
		} else if( nodeData.mesh !== undefined ) {
			this.#nodeType[node] = "mesh";
			this.#nodeData[node]["mesh"] = nodeData.mesh;
		} else {
			this.#nodeType[node] = "empty";
        }

        return node;
    }

    #deleteNode ( node ) {
		console.log("SceneDescriptor - #deleteNode");
        
        this.#nodeMatrix[node].identity();

        for( const childNode of this.#nodeChildren[node] ) {
            this.#nodeParent[childNode] = -1;
            this.#roots.add(childNode); 
        }
        this.#nodeChildren[node].clear();

        const parent = this.#nodeParent[node];
        if( parent != -1 )
            this.#nodeChildren[parent].delete(node); 
        else 
            this.#roots.delete(node);
        this.#nodeParent[node] = -1;

        this.#nodeMap.delete(this.#nodeName[node]);
        this.#nodes.unref(node); 

    }

    #setParentage ( node ) {
        for( const childNode of this.#nodeChildren[node] ) {
            this.#nodeParent[childNode] = node;
            this.#roots.delete(childNode); 
        }
    }

    getNode ( name ) {
        return this.#nodeMap.get(name);
    }

    setMatrix ( node, matrix ) {
        this.#nodeMatrix[node].copy(matrix);
    }

    getMatrix ( node ) {
        return this.#nodeMatrix[node].clone();
    }

    getTranslation ( node ) {
        const translation = new THREE.Matrix4();
        return this.#nodeMatrix[node].copyPosition(translation);
    }

    // #removeParent ( node ) {
    
    // }

    // #setParent ( child, parent ) {

    // }
}