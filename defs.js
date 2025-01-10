// #define JAVASCRIPT

// import { MeshConstants, Color3, Color4 } from '$ad3_core_backend_lib'
import { Vec2, Vec3, Vec4 } from '$ad3/_Vec.js'

export const DEFAULT_LINE_HEIGHT = 1.6

export const PATTERNS = {
	// none: MeshConstants.NO_FLIP,
	// flip: MeshConstants.FLIP_TILE,
	// rotate: MeshConstants.ROTATE_TILE,
	// row: MeshConstants.FLIP_ROW,
	// rotaterow: MeshConstants.ROTATE_ROW,
	// fliprotate: MeshConstants.FLIP_N_ROTATE_TILE,
	// fliprotaterow: MeshConstants.FLIP_N_ROTATE_ROW,
}

export const ORIENTATION = {
	// front: MeshConstants.FRONTSIDE,
	// back: MeshConstants.BACKSIDE,
	// double: MeshConstants.DOUBLESIDE
}

export const CAMERA_TYPES = [ 
	'arcrotate', 
	'free', 
	'universal', 
	'arcfollow', 
	'fly', 
	'follow', 
	'touch', 
	'target', 
	'touch', 
	'webxr', 
	'anaglypharcrotate', 
	'anaglyphfree', 
	'anaglyphuniversal', 
	'stereoscopicarcrotate', 
	'stereoscopicfree', 
	'stereoscopicuniversal' 
]

export const DEFAULTS = {
	ALL: {
		gui: true,
		debug: false,
		creator: {}
	},
	STYLES: {
		opacity: 1,
		fill: [],
		fillOpacity: 1,
		stroke: [], 
		strokeWidth: 0.1,
		strokeDasharray: '0 4',
		strokeDashoffset: 1,
		strokeLinecap: 'round',
		strokeLinejoin: 'miter',
		strokeOpacity: 1
	},
	MESH: {
		hidden: false,
		flat: true,
		updatable: true,
		face: 'double',
		opacity: 1,
		radius: 0.3,
		position: (new Vec3(0,0,0,0)).toObject(),
		rotation: (new Vec3(0,0,0)).toObject(),
		scaling: (new Vec3(1,1,1)).toObject(),
		renderOutline: false,
		outlineColor: [1,0,0],
		outlineWidth: 0.1
	},
	MATERIAL: {

		type: 'standard', // standard / basic, pbr, shader, grid, fur

		ambientColor: [0,0,0], // color of the material lit by the environmental background lighting
		diffuseColor: [0,0,0], // basic color of the material as viewed under a light
		specularColor: [0,0,0], // how the color and intensity of the highlight given by the light in the material
		emissiveColor: [0,0,0], // color of the material as if self lit

		reflectionColor: [1,1,0],
		albedoColor: [0,0,1],

		roughness: 0.3,
		metallic: 0.8,

		backFaceCulling: true,

		alpha: 1,
		alphaMode: 2, // ALPHA_COMBINE / ALPHA_ADD / ALPHA_SUBTRACT / ALPHA_MULTIPLY / ALPHA_MAXIMISED / ALPHA_ONEONE
		hasAlpha: true,

		disableLighting: true,
		depthWrite: true
	}

}

