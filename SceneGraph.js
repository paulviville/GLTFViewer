import * as THREE from './three/three.module.js';
import Node from './Node.js';
import Light from './Light.js';
import Mesh from './Mesh.js';

export default class SceneGraph {
	/// Array of all nodes
	#nodes;
	/// Array of all meshes
	#meshes
	/// Array of all materials
	#materials
	/// Array of all lights
	#lights;
	/// set of roots nodes id
	#roots;

	constructor ( ) {
		console.log("SceneGraph - constructor");
		this.#nodes = [];
		this.#roots = [];
		this.#meshes = [];
		this.#lights = [];
	}

	#newNode ( nodeData ) {
		console.log("SceneGraph - #newNode");
		const id = this.#nodes.length;

		const name = nodeData.name || `node${id}`;
		const node = new Node(id, name);
		
		/// set transform amtrix
		const matrix = new THREE.Matrix4();
		if(nodeData.matrix) {
			matrix.fromArray(nodeData.matrix);
		}
		node.matrix = matrix;

		/// set children
		if(nodeData.children) {
			node.children.push(...nodeData.children);
		}

		/// set type and data
		if(nodeData.extensions?.KHR_lights_punctual) {
			node.type = "light";
			node.data["light"] = nodeData.extensions?.KHR_lights_punctual.light;
		}
		if(nodeData.mesh) {
			node.type = "mesh";
			node.data["mesh"] = nodeData.mesh;
		}

		this.#nodes.push(node);
		return node;
	}

	#newLight ( lightData ) {
		// console.log("SceneGraph - newLight");
		// console.log(lightData);

		const light = new Light(
			lightData.type,
			new THREE.Color(...lightData.color),
			lightData.intensity,
		)

		this.#lights.push(light);
	}

	#newMesh ( meshData ) {
		// console.log("SceneGraph - newMesh");
		// console.log(meshData);
		const mesh = new Mesh();

		for(const primitive of meshData.primitives) {
			const attributes = {};
			for(const key in primitive.attributes) {
				attributes[key] = primitive.attributes[key];
			}

			mesh.addPrimitive(
				attributes,
				primitive.indices,
				primitive.material,
				primitive.mode,
			);
		}

		this.#meshes.push(mesh);
	}

	#newMaterial ( ) {

	}

	/// loads parsed json gltf
	loadGLTF ( gltf ) {
		console.log("SceneGraph - loadGLTF");
		console.log(gltf);

		for(const scene of gltf.scenes) {
			console.log(scene);
			for(const rootId of scene.nodes) {
				this.#roots.push(rootId);
			}
		}

		console.log(`roots: [${this.#roots}]`);

		/// creating the lights
		const lights = gltf.extensions?.KHR_lights_punctual?.lights;
		if(lights) {
			for(const lightData of lights) {
				this.#newLight(lightData);
			}
		}

		/// creating the meshes
		const meshes = gltf.meshes;
		if(meshes) {
			for(const meshData of meshes) {
				this.#newMesh(meshData);
			}
		}

		/// creating the scene graph
		for(const nodeData of gltf.nodes) {
			console.log(nodeData);
			const node = this.#newNode(nodeData);
			console.log(node);
		}



		console.log(this)
	}

	// #deleteNode ( id ) {

	// }
}