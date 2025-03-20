import * as THREE from './three/three.module.js';
import { OrbitControls } from './three/controls/OrbitControls.js';
import { GLTFLoader } from './three/loaders/GLTFLoader.js'

export default class SceneInterface {
    #renderer;
    #scene;
    #camera;
    #orbitControls;

    #nodeList = new Map();


    constructor ( ) {
        this.#scene = new THREE.Scene();
        this.#scene.background = new THREE.Color(0xcccccc);
        this.#camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
        this.#camera.position.set( -2, 3, -3 );
        this.#renderer = new THREE.WebGLRenderer({antialias: true});
        this.#renderer.autoClear = false;
        this.#renderer.setPixelRatio( window.devicePixelRatio );
        this.#renderer.setSize( window.innerWidth, window.innerHeight );
        
        document.body.appendChild( this.#renderer.domElement );
        this.#orbitControls = new OrbitControls( this.#camera, this.#renderer.domElement);
    }

    async loadFile ( filePath ) {
	    const loader = new GLTFLoader();
        let parsedScene;
        const scene = this.#scene;
        const camera = this.#camera;
        const renderer = this.#renderer;
        loader.load(`./files/scene.gltf`, async function ( gltf ) {
            console.log(gltf);
            parsedScene = gltf;
            const root = gltf.scene;
		    await renderer.compileAsync(root, camera, scene);
            
            scene.add(root);
            console.log(root);
        });

        return parsedScene;
    }

    syncScene ( sceneDescriptor ) {

    }

    get scene ( ) {
        return this.#scene;
    }

    get renderer ( ) {
        return this.#renderer;
    }

    get camera ( ) {
        return this.#camera;
    }
}