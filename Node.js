import * as THREE from './three/three.module.js';

export default class Node {
	#id;
	#matrix;
	#children;
	#data;
	#name;

	constructor ( id, name ) {
		this.#id = id;
		this.#name = name;
		this.#children = [];
	}

	get id ( ) {
		return this.#id;
	}

	get children ( ) {
		return this.#children;
	}

	get matrix ( ) {
		return this.#matrix;	
	}

	get name ( ) {
		return this.#name;
	}
}