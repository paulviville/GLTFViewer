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


// const attributeContainer = new AttributesContainer();
// attributeContainer.addAttribute("test");
// attributeContainer.addAttribute("test");
// attributeContainer.addAttribute("test");
// attributeContainer.removeAttribute(attributeContainer.getOrAddAttribute("test"))
// let i = attributeContainer.newElement();
// let i2 = attributeContainer.newElement();
// let i3 = attributeContainer.newElement();
// attributeContainer.deleteElement(i);
// attributeContainer.deleteElement(i2);
// attributeContainer.deleteElement(i3);

// // attributeContainer.ref(i)
// // attributeContainer.unref(i)
// console.log(attributeContainer.nbAttributes)



const sceneDescriptor = new SceneDescriptor();








const scenegraph = new SceneGraph();

const stats = new Stats()
document.body.appendChild( stats.dom );

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 100 );
camera.position.set( -2, 3, -3 );

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.autoClear = false;
renderer.setPixelRatio( window.devicePixelRatio );
console.log(window.devicePixelRatio)
renderer.setSize( window.innerWidth, window.innerHeight );
console.log( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const orbitControls = new OrbitControls(camera, renderer.domElement);

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

// addHelpers(scene);
// createSampleScene(scene);
// exportGLTF(scene.children);

function loadSampleScene ( scene ) {
	const loader = new GLTFLoader()
	// loader.setPath("./files/")
	loader.load(`./files/scene.gltf`, async function ( gltf ) {
		console.log(gltf);
		
		const model = gltf.scene;
		await renderer.compileAsync(model, camera, scene);

		scene.add(model);
		// scenegraph.loadGLTF(gltf.parser.json);
		sceneDescriptor.loadGLTF(gltf.parser.json)
	});
}

loadSampleScene(scene)


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



window.addEventListener('resize', function() {
	const width = window.innerWidth;
	const height = window.innerHeight;
	camera.aspect = width / height;
	camera.updateProjectionMatrix();
});



function animate() {
    renderer.render( scene, camera );
    stats.update()
}

renderer.setAnimationLoop( animate );