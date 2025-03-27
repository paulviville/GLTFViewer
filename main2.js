import Stats from './three/libs/stats.module.js';
import SceneInterface from './SceneInterface.js';
import SceneDescriptor from './SceneDescriptor.js';
import SceneSynchronizer from './SceneSynchronizer.js';
import SceneController from './SceneController.js';
import MessageHandler from './MessageHandler.js';

const stats = new Stats()
document.body.appendChild( stats.dom );

const sceneInterface = new SceneInterface();
const sceneDescriptor = new SceneDescriptor();

const gltf = await sceneInterface.loadFile(`./files/scene.gltf`);
console.log(gltf)
sceneDescriptor.loadGLTF(gltf.parser.json);
const sceneSynchronizer = new SceneSynchronizer(sceneInterface, sceneDescriptor);
const sceneController = new SceneController(sceneInterface, sceneSynchronizer);
console.log(sceneController);

function animate() {
    sceneInterface.renderer.render( sceneInterface.scene, sceneInterface.camera );
    stats.update()
}

sceneInterface.renderer.setAnimationLoop( animate );


const messageHandler = new MessageHandler(window.opener);
messageHandler.setSynchronizer(sceneSynchronizer);
