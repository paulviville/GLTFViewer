import { GUI } from './three/libs/lil-gui.module.min.js'; 
import * as THREE from './three/three.module.js';
import { TransformControls } from './three/controls/TransformControls.js';

export default class SceneController {
    #gui = new GUI();
    #sceneDescriptor;
    #sceneInterface;
    #guiParams = {
        previouslySelected: undefined,
        selected: "none",
    }
    #boxHelper;
    #transformDummy = new THREE.Object3D();
    #transformControls;
    #target;

    constructor ( sceneInterface, sceneDescriptor ) {
		console.log("SceneController - constructor");

        this.#sceneDescriptor = sceneDescriptor;
        this.#sceneInterface = sceneInterface;

        const objectsMap = this.#sceneInterface.objectsMap;
        const nodeMap = this.#sceneDescriptor.nodeMap;

        console.log(objectsMap);
        console.log(nodeMap);

        console.log(...objectsMap.keys());
        this.#initiateGui();


        this.#transformControls = new TransformControls(this.#sceneInterface.camera, this.#sceneInterface.renderer.domElement);
        this.#transformControls.attach(this.#transformDummy);
        this.#transformControls.addEventListener('dragging-changed', (event) => {
            this.#sceneInterface.controls.enabled = !event.value;
        });
        this.#transformControls.addEventListener('change', (event) => {
            this.#onTransformChange()
        });

        this.#sceneInterface.scene.add(this.#transformDummy);
    }   

    #initiateGui ( ) {
        this.#gui.add(this.#guiParams,
            "selected",
            ["none", ...this.#sceneInterface.objectsMap.keys()]
        ).onChange( label => {
            this.selectObject(label);
        });
    }

    selectObject ( name ) {
        this.deselectObject(this.#guiParams.previouslySelected);
        this.#guiParams.previouslySelected  = name;

        if( name === undefined || name == "none") {

            return;
        }




        console.log(name)
        const object = this.#sceneInterface.getObject(name);
        const node = this.#sceneDescriptor.getNode(name);
        this.#boxHelper = new THREE.BoxHelper(object);
        this.#sceneInterface.scene.add(this.#boxHelper);
        console.log(object, node);

        // this.#transformDummy
        const matrix = this.#sceneDescriptor.getMatrix(node)
        const worldMatrix = this.#sceneDescriptor.getWorldMatrix(node)
        const translation = new THREE.Vector3();
        const rotation = new THREE.Quaternion();
        const scale = new THREE.Vector3();
        worldMatrix.decompose(translation, rotation, scale);

        const translation0 = new THREE.Vector3();
        const rotation0 = new THREE.Quaternion();
        const scale0 = new THREE.Vector3();
        matrix.decompose(translation0, rotation0, scale0);

        this.#transformDummy.position.copy(translation)
        this.#transformDummy.rotation.copy(rotation)
        this.#transformDummy.scale.copy(scale)
        this.#sceneInterface.scene.add(this.#transformControls.getHelper());

        const parentMatrix = matrix.clone().invert().premultiply(worldMatrix);
        const invParentMatrix = parentMatrix.clone().invert();

        console.log(parentMatrix, invParentMatrix, worldMatrix, matrix)
        this.#target = {
            object,
            node,
            translation,
            rotation,
            scale,
            matrix,
            worldMatrix,
            parentMatrix,
            invParentMatrix,
        }
    }

    deselectObject ( name ) {
        this.#sceneInterface.scene.remove(this.#transformControls.getHelper());
        if( name === undefined || name == "none") {

            return;
        }
        this.#sceneInterface.scene.remove(this.#boxHelper);
        
    }

    setTransformToolMode ( mode ) {
        this.#transformControls.setMode(mode);
    }

    setTransformToolSpace ( space ) {
        this.#transformControls.setSpace(space);
    }

    #onTransformChange ( ) {
        if(this.#transformControls.dragging) {
            // console.log(this.#transformDummy.quaternion)

            // this.#target.translation.copy(this.#transformDummy.position);
            // this.#target.rotation.copy(this.#transformDummy.quaternion);
            // this.#target.scale.copy(this.#transformDummy.scale);
            // this.#target.matrix.compose(this.#target.translation, this.#target.rotation, this.#target.scale);
            
            const dummyWorldMatrix = new THREE.Matrix4();
            dummyWorldMatrix.compose(this.#transformDummy.position,this.#transformDummy.quaternion, this.#transformDummy.scale)
            const localMatrix = this.#target.invParentMatrix.clone().multiply(dummyWorldMatrix);
            localMatrix.decompose(this.#target.translation, this.#target.rotation, this.#target.scale)
            this.#target.object.position.copy(this.#target.translation);
            this.#target.object.quaternion.copy(this.#target.rotation);
            this.#boxHelper.update();

            // this.#sceneDescriptor.setMatrix(this.#target.node, this.#target.matrix);
            this.#sceneDescriptor.setMatrix(this.#target.node, localMatrix);
        }
    }

    #synchronizeMatrixToDescriptor ( node, matrix ) {

    }

    #synchronizeMatrixFromDescriptor ( ) {

    }
}