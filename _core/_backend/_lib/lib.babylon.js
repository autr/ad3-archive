/* ====================================== */
/*                                        */
/*         	 BABYLON (LAZY-LOAD)          */
/*                                        */
/* ====================================== */

export * from './lib.preload.js'

// ------ ENGINE ------

export { Engine } from '@babylonjs/core/Engines/engine.js'
export { WebGPUEngine } from '@babylonjs/core/Engines/webgpuEngine.js'
// export { ThinEngine } from '@babylonjs/core/Engines/thinEngine.js'
export { NullEngine } from '@babylonjs/core/Engines/nullEngine.js'

/* https://forum.babylonjs.com/t/webgpu-babylonjs-unable-to-compile-effect/27771/3 */
export * as EngineExtensions from '@babylonjs/core/Engines/WebGPU/Extensions' /* DEPENDENCIES */
export * from '@babylonjs/core/Culling/index.js'

// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.dynamicTexture.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.dynamicBuffer.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.uniformBuffer.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.computeShader.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.storageBuffer.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.multiRender.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.readTexture.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.renderTargetCube.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.multiview.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.renderTargetCube.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.externalTexture.js'
// import '@babylonjs/core/Engines/WebGPU/Extensions/engine.videoTexture.js'

// ------ SCENE / RENDERERS ------

export { Scene } from '@babylonjs/core/scene.js'
export { SceneLoader } from '@babylonjs/core/Loading/sceneLoader.js'
export { BoundingBoxRenderer } from '@babylonjs/core/Rendering/boundingBoxRenderer.js'
export * as SceneHelpers from '@babylonjs/core/Helpers/sceneHelpers.js' // BUGFIX
export * as EnvHelpers from '@babylonjs/core/Helpers/environmentHelper.js' // BUGFIX

// ------ LOADERS ------

export { GLTFFileLoader } from '@babylonjs/loaders/glTF/glTFFileLoader.js'
export { OBJFileLoader } from '@babylonjs/loaders/OBJ/objFileLoader.js'
export { SPLATFileLoader } from '@babylonjs/loaders/SPLAT/splatFileLoader.js'
export { STLFileLoader } from '@babylonjs/loaders/STL/stlFileLoader.js'

// ------ LAYERS ------

export { GlowLayer } from '@babylonjs/core/Layers/glowLayer.js'
export { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer.js'
export { EffectLayer } from '@babylonjs/core/Layers/effectLayer.js'
export { Layer } from '@babylonjs/core/Layers/layer.js'

// ------ RENDERERS ------

export { EdgesRenderer } from '@babylonjs/core/Rendering/edgesRenderer.js'
export { OutlineRenderer } from '@babylonjs/core/Rendering/outlineRenderer.js'

// ------ LIGHTS ------

export { DirectionalLight } from '@babylonjs/core/Lights/directionalLight.js'
export { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
export { PointLight } from '@babylonjs/core/Lights/pointLight.js'
export { ShadowLight } from '@babylonjs/core/Lights/shadowLight.js'
export { SpotLight } from '@babylonjs/core/Lights/spotLight.js'

export * from '@babylonjs/core/Lights/Shadows/index.js'

// ------ CAMERAS ------

export { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js'
export { TargetCamera } from '@babylonjs/core/Cameras/targetCamera.js'
export { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js'
export { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera.js'

/* 
	export { TouchCamera } from '@babylonjs/core/Cameras/touchCamera.js'
	export { DeviceOrientationCamera } from '@babylonjs/core/Cameras/deviceOrientationCamera.js'
	export { FlyCamera } from '@babylonjs/core/Cameras/flyCamera.js'
	export { FollowCamera, ArcFollowCamera } from '@babylonjs/core/Cameras/followCamera.js'
	export { GamepadCamera } from '@babylonjs/core/Cameras/gamepadCamera.js'
	export { 
		StereoscopicFreeCamera,
		StereoscopicUniversalCamera,
		StereoscopicGamepadCamera,
		StereoscopicArcRotateCamera,
		StereoscopicScreenUniversalCamera
		} from '@babylonjs/core/Cameras/Stereoscopic/index.js'
	export { VirtualJoysticksCamera } from '@babylonjs/core/Cameras/virtualJoysticksCamera.js'
	export * as RigModes from '@babylonjs/core/Cameras/RigModes/index.js'
	export * as Inputs from '@babylonjs/core/Cameras/Inputs/index.js'
	export { CameraInputsManager } from '@babylonjs/core/Cameras/cameraInputsManager.js'
	export { FreeCameraInputsManager } from '@babylonjs/core/Cameras/freeCameraInputsManager.js'
	export { ArcRotateCameraInputsManager } from '@babylonjs/core/Cameras/arcRotateCameraInputsManager.js'
	export { FlyCameraInputsManager } from '@babylonjs/core/Cameras/flyCameraInputsManager.js'
	export { FollowCameraInputsManager } from '@babylonjs/core/Cameras/followCameraInputsManager.js'
	export * as VR from '@babylonjs/core/Cameras/VR/index.js'
*/

// ------ MATERIALS ------

export { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js'
export { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial.js'
// export { NodeMaterial } from '@babylonjs/core/Materials/Node/nodeMaterial.js'
export * from '@babylonjs/core/Materials/Node'
export { Material } from '@babylonjs/core/Materials/material.js'

export { PBRMaterial } from '@babylonjs/core/Materials/PBR/pbrMaterial.js'
export { PBRMetallicRoughnessMaterial } from '@babylonjs/core/Materials/PBR/pbrMetallicRoughnessMaterial.js'

// ------ TEXTURES ------

import '@babylonjs/core/Materials/Textures/Loaders' /* DEPENDENCIES */

export { Image } from '@babylonjs/gui/2d/controls/image.js'
export { Texture } from '@babylonjs/core/Materials/Textures/texture.js'
export { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture.js'
export { ExternalTexture } from '@babylonjs/core/Materials/Textures/externalTexture.js'
export { HDRCubeTexture } from '@babylonjs/core/Materials/Textures/hdrCubeTexture.js'
export { HtmlElementTexture } from '@babylonjs/core/Materials/Textures/htmlElementTexture.js'
export { MirrorTexture } from '@babylonjs/core/Materials/Textures/mirrorTexture.js'
export { VideoTexture } from '@babylonjs/core/Materials/Textures/videoTexture.js'
export { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture.js'

// ------ ADVANCED MATERIALS ------

export { FurMaterial } from '@babylonjs/materials/fur/index.js'
export { GridMaterial } from '@babylonjs/materials/grid/index.js'

// ------ MESHES / BUILDERS ------

export * from '@babylonjs/core/Buffers/buffer.js'
export { Mesh } from '@babylonjs/core/Meshes/mesh.js'  
export { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData.js'
export { TransformNode } from '@babylonjs/core/Meshes/transformNode.js'
// export { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js'  

export { CreateSphereVertexData, CreateSphere } from '@babylonjs/core/Meshes/Builders/sphereBuilder.js'
export { CreateBoxVertexData, CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder.js'
export { CreateCapsuleVertexData, CreateCapsule } from '@babylonjs/core/Meshes/Builders/capsuleBuilder.js'
export { CreateCylinderVertexData, CreateCylinder } from '@babylonjs/core/Meshes/Builders/cylinderBuilder.js'
export { CreateDiscVertexData, CreateDisc } from '@babylonjs/core/Meshes/Builders/discBuilder.js'
export { CreateGoldbergVertexData, CreateGoldberg } from '@babylonjs/core/Meshes/Builders/goldbergBuilder.js'
export { CreateGroundVertexData, CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder.js'
export { CreateIcoSphereVertexData, CreateIcoSphere } from '@babylonjs/core/Meshes/Builders/icoSphereBuilder.js'
export { CreatePlaneVertexData, CreatePlane } from '@babylonjs/core/Meshes/Builders/planeBuilder.js'
export { CreatePolygonVertexData, CreatePolygon } from '@babylonjs/core/Meshes/Builders/polygonBuilder.js'
export { CreatePolyhedronVertexData, CreatePolyhedron } from '@babylonjs/core/Meshes/Builders/polyhedronBuilder.js'
export { CreateTiledBoxVertexData, CreateTiledBox } from '@babylonjs/core/Meshes/Builders/tiledBoxBuilder.js'
export { CreateTorusVertexData, CreateTorus } from '@babylonjs/core/Meshes/Builders/torusBuilder.js'
export { CreateTorusKnotVertexData, CreateTorusKnot } from '@babylonjs/core/Meshes/Builders/torusKnotBuilder.js'
export { CreateRibbonVertexData, CreateRibbon } from '@babylonjs/core/Meshes/Builders/ribbonBuilder.js'
export { 
	CreateLineSystemVertexData, 
	CreateDashedLinesVertexData, 
	CreateLineSystem, 
	CreateDashedLines, 
	CreateLines } from '@babylonjs/core/Meshes/Builders/linesBuilder.js' // non-standard 


export { 
	CreateGreasedLineMaterial, 
	CreateGreasedLine, 
	GreasedLineMeshColorDistribution,
	CompleteGreasedLineWidthTable,
	CompleteGreasedLineColorTable } from '@babylonjs/core/Meshes/Builders/greasedLineBuilder.js' // non-standard (ribbon)
export { 
	GreasedLineMeshMaterialType,
	GreasedLineMeshColorMode,
	GreasedLineMeshColorDistributionType } from '@babylonjs/core/Materials/GreasedLine/greasedLineMaterialInterfaces.js' // non-standard (ribbon)
export { CreateLathe } from '@babylonjs/core/Meshes/Builders/latheBuilder.js' // non-standard (ribbon)
export { CreateTube } from '@babylonjs/core/Meshes/Builders/tubeBuilder.js' // non-standard (ribbon)
export { CreateGeodesic } from '@babylonjs/core/Meshes/Builders/geodesicBuilder.js' // non-standard (polyhedron)
export { CreateHemisphere } from '@babylonjs/core/Meshes/Builders/hemisphereBuilder.js' // non-standard (sphere / disc)
export { ExtrudeShape, ExtrudeShapeCustom } from '@babylonjs/core/Meshes/Builders/shapeBuilder.js' // non-standard
export { 
	CreateTextShapePaths, 
	CreateText } from '@babylonjs/core/Meshes/Builders/textBuilder.js' // non-standard
export { CreateDecal } from '@babylonjs/core/Meshes/Builders/decalBuilder.js' // non-standard