import * as THREE from './three/three.module.js';
import Stats from './three/libs/stats.module.js';
import { OrbitControls } from './three/controls/OrbitControls.js';

import { GLTFExporter } from './three/exporters/GLTFExporter.js';
import { GLTFLoader } from './three/loaders/GLTFLoader.js'
import { MeshoptDecoder } from './three/libs/meshopt_decoder.module.js';
import * as TextureUtils from './three/utils/WebGLTextureUtils.js';

import SceneGraph from './SceneGraph.js';
import AttributesContainer from './AttributesContainer.js';
import SceneDescriptor from './SceneDescriptor.js';
import SceneInterface from './SceneInterface.js';
import SceneController from './SceneController.js';

const sceneDescriptor = new SceneDescriptor();









const stats = new Stats()
document.body.appendChild( stats.dom );

const sceneInterface = new SceneInterface();







function addHelpers ( scene ) {
	const axesHelper = new THREE.AxesHelper(10);
	scene.add(axesHelper);


	const gridHelperX = new THREE.GridHelper(10, 10);
	// gridHelperX.lookAt(0, 1, 0);
	const gridHelperY = new THREE.GridHelper(10, 10);
	// gridHelperY.lookAt(0, 0, 1);
	// gridHelperY.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI/2)
	const gridHelperZ = new THREE.GridHelper(10, 10);
	// gridHelperZ.lookAt(1, 0, 0);
	scene.add(gridHelperX, gridHelperY, gridHelperZ);

}

function createSampleScene ( scene ) {
	// const ambientLight = new THREE.AmbientLight( 0xcccccc );
	// ambientLight.name = 'AmbientLight';
	// scene.add( ambientLight );
	console.log(scene.children);
	const dirLight = new THREE.DirectionalLight( 0xffffff, 3 );
		dirLight.target.position.set( 0, 0, - 1 );
		dirLight.add( dirLight.target );
		dirLight.lookAt( - 1, - 1, 0 );
		dirLight.name = 'DirectionalLight';
		scene.add( dirLight );

	const pointLight = new THREE.PointLight(0xff00ff)
	pointLight.position.set(-3, 0, -2)
	pointLight.name = "pointLight";
	scene.add(pointLight);

	const group = new THREE.Group();
	group.name = "group";
	
	const sphere0 = new THREE.Mesh(
		new THREE.SphereGeometry(1, 10, 10),
		new THREE.MeshStandardMaterial({color: 0xFF0000})
	);
	sphere0.name = "sphere0";
	sphere0.position.set(3, 0, 3)

	const sphere1 = new THREE.Mesh(
		new THREE.SphereGeometry(0.5, 10, 10),
		new THREE.MeshStandardMaterial({color: 0x00FF00})
	);
	sphere1.name = "sphere1";
	
	const sphere2 = new THREE.Mesh(
		new THREE.SphereGeometry(0.25, 10, 10),
		new THREE.MeshStandardMaterial({color: 0x0000FF})
	);
	sphere2.position.set(-1, 0, 2);
	sphere2.name = "sphere2";

	group.add(sphere1);
	group.add(sphere2);

console.log(sphere0)
	scene.add(sphere0);
	
	scene.add(group);
}

// createSampleScene(scene);
// exportGLTF(scene.children);

const objectList = new Map();
const nodeList = new Map();

function loadSampleScene ( scene ) {
	const loader = new GLTFLoader()
	// loader.setPath("./files/")
	loader.load(`./files/scene.gltf`, async function ( gltf ) {
		console.log(gltf);
		
		const root = gltf.scene;
		await sceneInterface.renderer.compileAsync(root, sceneInterface.camera, scene);

		scene.add(root);
		console.log(root);
		// scenegraph.loadGLTF(gltf.parser.json);
		sceneDescriptor.loadGLTF(gltf.parser.json)
		// traverseScene(root, (object) => {
		// 	const objectData = {
		// 		object: object,
		// 		node: sceneDescriptor.getNode(object.name),
		// 	}
		// 	object.userData.node = sceneDescriptor.getNode(object.name);
		// 	objectList.set(object.name, objectData);
		// 	nodeList.set(sceneDescriptor.getNode(object.name), object);
		// });
		// console.log(objectList)
		// console.log(nodeList)
		// root

		// const matTest = new THREE.Matrix4().makeTranslation(1, -3, 2);
		// const nodeTest = 5;
		// sceneDescriptor.setMatrix(nodeTest, matTest);
		// const objectTest = nodeList.get(nodeTest);
		// objectTest.matrixAutoUpdate = false;
		// objectTest.matrix.copy(sceneDescriptor.getMatrix(nodeTest));
	});
}

// loadSampleScene(sceneInterface.scene)

const gltf = await sceneInterface.loadFile(`./files/scene.gltf`);
console.log(gltf)
sceneDescriptor.loadGLTF(gltf.parser.json);

const sceneController = new SceneController(sceneInterface, sceneDescriptor);
console.log(sceneController);





const keyHeld = {};
const defaultKeyDown = function(event){
	keyHeld[event.code] = true;
};

const defaultKeyUp = function(event){
	console.log(event.which, event.code, event.charCode);
	switch(event.code) {
		case "Escape": 
			break;
		case "Space":
			break;
		case "Delete":
			break;
		case "KeyR":
			sceneController.setTransformToolMode('rotate')
			break;
		case "KeyL":
			sceneController.setTransformToolSpace('local')
			break;
		case "KeyT":
			sceneController.setTransformToolMode('translate')
			break;
		case "KeyZ":
			sceneController.setTransformToolSpace('world')
			break;
		case "Numpad0":
			break;
		case "ArrowRight":
			break;
	};

	keyHeld[event.code] = false;

}

window.addEventListener("keydown", defaultKeyDown);
window.addEventListener("keyup", defaultKeyUp);


function exportGLTF( group ) {
	const gltfExporter = new GLTFExporter().setTextureUtils(TextureUtils);

	const options = {
		trs: false,
		onlyVisible: false,
		binary: false,
		maxTextureSize: 4096,
	}

	gltfExporter.parse( group,
		function ( result ) {
			if(result instanceof ArrayBuffer) {
				saveArrayBuffer(result, `scene.glb`);
			} else {
				console.log(result);
				const output = JSON.stringify(result, null, 2);
				// console.log(output);
				saveString(output, `scene.gltf`);
			}
		},
		function ( error ) {
			console.log("failed to parse", error);
		},
		options
	);
}

const link = document.createElement("a");
link.style.display = 'none';
document.body.appendChild(link);

function save ( blob, filename ) {
	link.href = URL.createObjectURL(blob);
	link.download = filename;
	link.click();
}

function saveString ( text, filename ) {
	save(new Blob([text], {type: 'text/plain'}), filename);
}

function saveArrayBuffer ( buffer, filename ) {
	save(new Blob([buffer], {type: 'application/octet-stream'}), filename);
}



// window.addEventListener('resize', function() {
// 	const width = window.innerWidth;
// 	const height = window.innerHeight;
// 	camera.aspect = width / height;
// 	camera.updateProjectionMatrix();
// });



function animate() {
    sceneInterface.renderer.render( sceneInterface.scene, sceneInterface.camera );
    stats.update()
}

sceneInterface.renderer.setAnimationLoop( animate );