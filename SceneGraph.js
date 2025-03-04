import * as THREE from './three/three.module.js';
import Node from './Node.js';

const node = new Node
export default class SceneGraph {
	/// Array of all nodes
	#nodes;
	/// set of roots nodes id
	#roots;

	constructor ( ) {
		console.log("SceneGraph - constructor");
		this.#nodes = [];
		this.#roots = [];
	}

	#newNode ( ) {
		// const node = new Node ()
	}

	/// loads parsed json gltf
	loadGLTF ( gltf ) {
		console.log("SceneGraph - loadGLTF");
		console.log(gltf);
	}

	// #deleteNode ( id ) {

	// }
}