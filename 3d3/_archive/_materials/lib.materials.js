/* ====================================== */
/*                                        */
/*                MATERIALS               */
/*                                        */
/* ====================================== */


// #define BABYLON
import * as BBMATS from 'babylonjs-materials'

import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)

SAY('🧱', {BBMATS})


export function CreateColor(r = 1, g = 1, b = 1, a = 1) {
	return new BB.Color4(r, g, b, a)
}
export function CreateSolidColorMaterial( scene, color = new BB.Color4(1,1,1,1) ) {
	const mat = new BB.StandardMaterial('SolidColorMaterial', scene)
	mat.emissiveColor = color
	mat.disableLighting = true
	mat.alpha = color?.[3] || 1
	mat.opacity = 0.99999
	mat.alphaMode = BABYLON.Engine.ALPHA_COMBINE
	mat.hasAlpha = true
	mat.alphaCutOff = 0.4
	// mat.wireframe = true
	return AddMaterialDefaults( mat )
}

export function CreateMassMaterial(scene, reflectionColor, albedoColor, emissionColor) {
	const mat = new BABYLON.PBRMaterial('MetallicMaterial', scene);
	mat.reflectionColor = reflectionColor || BABYLON.Color3.FromHexString('#FFCF4D');
	mat.albedoColor = albedoColor || BABYLON.Color3.FromHexString('#FFCF4D');
	mat.roughness = 0.3;
	mat.metallic = 0.8;

	// if (emissionColor) {
	// 	const emissiveTextureSize = 256;
	// 	const emissiveTexture = new BABYLON.DynamicTexture('emissiveTexture', { width: emissiveTextureSize, height: emissiveTextureSize }, scene);
	// 	const context = emissiveTexture.getContext();

	// 	context.fillStyle = emissionColor.toHexString()
	// 	context.fillRect(0, 0, emissiveTextureSize, emissiveTextureSize);

	// 	mat.emissiveTexture = emissiveTexture;
	// 	mat.emissiveIntensity = 1;
	// }

	return AddMaterialDefaults(mat);
}
export function CreateGridMaterial( gridRatio, mainColor, lineColor, scene ) {

	const mat = new BBMATS.GridMaterial( 'gridMat', scene )
	mat.majorUnitFrequency = 0
	mat.minorUnitVisibility = 1
	mat.gridRatio = gridRatio || 0.25
	mat.opacity = 0.99999
	mat.backFaceCulling = false
	mat.alphaMode = BABYLON.Engine.ALPHA_COMBINE
	mat.hasAlpha = true
	mat.mainColor = mainColor || new BB.Color4(20/255, 31/255, 31/255, 1)
	mat.lineColor = lineColor || new BB.Color4(1, 1, 1, 1)
	return mat
}

export function CreateShaderMaterial( scene, name, vShader, fShader ) {

	if (!name) name = 'custom'

	const vertexShader = vShader || `
		precision highp float;
		attribute vec3 position;
		attribute vec3 normal;
		attribute vec2 uv;
		uniform mat4 worldViewProjection;
		void main() {
		    gl_Position = worldViewProjection * vec4(position, 1.0);
		}`
	const fragmentShader = fShader || `
		precision highp float;
		void main() {
		    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // solid red color
		}`


    BB.Effect.ShadersStore[`${name}VertexShader`] = vertexShader
    BB.Effect.ShadersStore[`${name}FragmentShader`] = fragmentShader

	const mat = new BB.ShaderMaterial('shader', scene, {
		vertex: name,
		fragment: name,
	},
	{
		attributes: ['position', 'normal', 'uv'],
		uniforms: ['worldViewProjection']
	})

	return mat
}

export function CreateMetallicMaterial( scene, reflectionColor, albedoColor ) {

	const mat = new BABYLON.PBRMaterial('MetallicMaterial',scene)
	mat.reflectionColor = reflectionColor || BABYLON.Color3.FromHexString('#FFCF4D')
	mat.albedoColor = albedoColor || BABYLON.Color3.FromHexString('#FFCF4D')
	mat.roughness = 0.3
	// mat.backFaceCulling = false
	mat.metallic = 0.8
	return AddMaterialDefaults( mat )
}
export function CreatePBRMaterial( scene ) {

	const mat = new BABYLON.PBRMaterial('PBRMaterial',scene)
	mat.roughness = 0.3
	mat.metallic = 0.8
	mat.subSurface.isTranslucencyEnabled = true
	return AddMaterialDefaults( mat )
}

export function AddMaterialDefaults( mat ) {

	mat.backFaceCulling = true
	mat.alpha = 1
	mat.depthWrite = true
	mat.sideOrientation = BB.Material.FRONTSIDE // BACKSIDE, FRONTSIDE, DOUBLESIDE
	return mat
	
}