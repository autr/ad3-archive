/* ====================================== */
/*                                        */
/*                MATERIALS               */
/*                                        */
/* ====================================== */


// #define JAVASCRIPT
import * as BBMATS from 'babylonjs-materials'
import { GridMaterial } from '@babylonjs/materials'
import { 
	Material, 
	Color4, 
	StandardMaterial, 
	DynamicTexture,
	PBRMaterial, 
	Effect, 
	ShaderMaterial, 
	Color3, 
	Engine } from '@babylonjs/core'


export function CreateColor(vec3) {
	return new Color4(vec3.x, vec3.y, vec3.z, vec3.w || 1)
}

export function GetSolidColorMaterialConfig( color = new Color4(1,1,1,1), scene, doStripes = false ) {

	const emissiveColor = new Color3( color.x || color.r, color.y || color.g, color.z || color.b )

	const config = {
		emissiveColor: emissiveColor,
		backFaceCulling: true,
		
		alpha: 1,
		alphaMode: Engine.ALPHA_COMBINE,
		hasAlpha: true,

		depthWrite: true,
		sideOrientation: Material.FRONTSIDE, // BACKSIDE, FRONTSIDE, DOUBLESIDE
		// diffuseColor: color,
		ambientColor: color,
		specularColor: color,
		disableLighting: true,
		alpha: color?.[3] || 1,
		opacity: 0.99999,
		alphaCutOff: 0
	}
	// if (doStripes) {

	// 	const emissiveTexture = new BABYLON.DynamicTexture("DynamicTexture", 512*2, scene, true);
	// 	const emissiveContext = emissiveTexture.getContext()

	// 	const opacityTexture = new BABYLON.DynamicTexture("OpacityTexture", 512*2, scene, true);
	// 	const opacityContext = opacityTexture.getContext();

	// 	const dashSize = 20
	// 	for(let i = 0; i < 512*2; i+=dashSize){
	// 		emissiveContext.fillStyle = (i / dashSize) % 2 == 0 ? 'black' : 'white';
	// 		// opacityContext.fillStyle = (i % dashSize == 0) ? 'rgba(0,0,0,0)' : 'rgba(255,255,255,1)'
	// 		emissiveContext.fillRect(0, i, 512*2, dashSize)
	// 		// opacityContext.fillRect(0, i, 512, dashSize)
	// 	}

	// 	emissiveTexture.update()
	// 	opacityTexture.update()

	// 	delete config.emissiveColor

	// 	config.emissiveTexture = emissiveTexture
	// 	// config.opacityTexture = opacityTexture
	// 	// config.useAlphaFromDiffuseTexture = true

	// }

	return config

}

export function CreateSolidColorMaterial( color = new Color4(1,1,1,1), scene, doStripes = false ) {
	const mat = new StandardMaterial('SolidColorMaterial', scene)
	const config = GetSolidColorMaterialConfig( color, scene, doStripes )
	for (const [key, value] of Object.entries(config)) mat[key] = value
	return mat
}


export function AddMaterialDefaults( mat ) {

	mat.backFaceCulling = true
	mat.alpha = 1
	mat.depthWrite = true
	mat.sideOrientation = Material.FRONTSIDE // BACKSIDE, FRONTSIDE, DOUBLESIDE
	return mat
	
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
	mat.mainColor = mainColor || new Color4(20/255, 31/255, 31/255, 1)
	mat.lineColor = lineColor || new Color4(1, 1, 1, 1)
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


    Effect.ShadersStore[`${name}VertexShader`] = vertexShader
    Effect.ShadersStore[`${name}FragmentShader`] = fragmentShader

	const mat = new ShaderMaterial('shader', scene, {
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
