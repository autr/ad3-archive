/* ====================================== */
/*                                        */
/*         	     SHAPE PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { ORIENTATION, PATTERNS } from '$ad3'

import { DEFAULTS } from '$ad3/defs.js'
import { LoopThroughMeshes } from './lib.core.js'
import ProxyMeshes from './_Proxy.Meshes.js'

import { 
	SyncEnabledPickableVisible,

} from "./lib.core.js"

export default class Shape extends ProxyMeshes {

	fur = null
	type = 'Shape'

	activeMeshRefs = { shape: null }

	setup( uid, shapeConfig, flags ) {

		this.uid = uid
		this.isDisposing = false
		this.shapeConfig = Parse(Stringify(shapeConfig))
		this.flags = flags


		return uid 
	}

	$syncShapeMesh() {

		if (!this.shapeConfig) return

		this.$disposeMeshes()

		const parsedShapeConfig = GenerateShapeConfig( this.shapeConfig )

		const scene = this.$getSceneInstance()
		const mesh = new BB[`Create${this.shapeConfig.type}`]( this.uid, parsedShapeConfig, scene )

		mesh.alwaysSelectAsActiveMesh = true
		mesh.thinInstanceEnablePicking = true
		mesh.renderEdges = false
		if (this.flags.isOnTop) mesh.renderingGroupId = 1

		const alphaRadians = this.shapeConfig.rotation[0] * Math.PI / 180
		const betaRadians = this.shapeConfig.rotation[1] * Math.PI / 180
		const gammaRadians = this.shapeConfig.rotation[2] * Math.PI / 180

		mesh.rotation.x = alphaRadians
		mesh.rotation.y = betaRadians
		mesh.rotation.z = gammaRadians

		mesh.material = new BB.StandardMaterial( this.uid + 'Material', scene )
		mesh.material.emissiveColor = new BB.Color3( ...this.shapeConfig.color )
		mesh.material.disableLighting = true
		mesh.material.backFaceCulling = false
		mesh.visibility = this.shapeConfig.color[3] !== undefined ? this.shapeConfig.color[3] : 1
  
		this.worldMesh = this.activeMeshRefs.shape = mesh

		this.$syncFlagsToMeshes()
	}

	setShapeConfig( shapeConfig ) {
		// SAY('SHAPE UPDATE')
		this.shapeConfig = Parse(Stringify(shapeConfig))
		this.$syncShapeMesh()
	}

	$disposeMeshes() {

		this.$loopThroughMeshes( thin => thin.dispose ? thin.dispose() : null )
		this.activeMeshRefs.shape = null
	}

	setShapePosition( position ) {
		position = this.$getWorldAbsolutePosition( position )
		if (position) this.worldMesh.position = position
	}

	dispose() {

		// SAY('DISPOSE!!!!! SHAPE 🔴')

		this.isDisposing = true
		this.$disposeMeshes()
		this.$getLookup().delete(this.uid)
	}



}



export function GenerateShapeConfig( data ) {
	
	// ------ PROPS ------

	data.tile = new Vec2( data.tile )
	data.arc = data.arc
	data.slice = data.slice
	data.type = data.type

	// ------ CONFIG ------

	const common = {
		updatable: data.updatable,
		sideOrientation: ORIENTATION[ data.face ]
	}
	let config = {}

	// ------ SHAPE ------

	if (data.type == 'Box' || data.type == 'TiledBox' ) {

		config = {
			...common,
			width: data.size[0],
			height: data.size[1],
			depth: data.size[2],
			wrap: data.wrap,
			tileWidth: data.tile.x,
			tileHeight: data.tile.y,
		}
	} else if ( data.type === 'Sphere' ) {

		config = {
			...common,
			segments: data.sides,
			diameterX: data.size[0],
			diameterY: data.size[1],
			diameterZ: data.size[2],
			arc: data.arc,
			slice: data.slice
		}
	} else if ( data.type === 'Cylinder' ) {

		config = {
			...common,
			diameterTop: data.size[0],
			height: data.size[1],
			diameterBottom: data.size[2],
			tessellation: data.sides,
			arc: data.arc,
			enclose: false, //data.enclose
		}
	} else if ( data.type === 'Polygon' ) {
		config = {
			...common,
			radius: data.size[0],
			tessellation: data.sides,
			arc: data.arc
		}
	} else if ( data.type === 'Knot' ) {
		config = {
			...common,
			p: data.size[0],
			q: data.size[1],
			radius: data.size[2],
			tube: data.size.w,
			radialSegments: data.sides,
			tubularSegments: data.sides
		}
	} else if ( data.type === 'Ground' ) {
		config = {
			...common,
			xmin: data.size[0] / -2,
			xmax: data.size[0] / 2,
			zmin: data.size[1] / -2,
			zmax: data.size[1] / 2,
			subdivision: { w: data.tile.x, h: data.tile.y }
		}
	} else if ( data.type === 'Torus' ) {

		config = {
			...common,
			diameter: data.size[0],
			thickness: data.size[1],
			tessellation: 64,
		}
	}

	return config
}



	// setHighlight( highlight ) {

	// 	if (!this.mesh) return

	// 	const r = highlight[0] * 255 
	// 	const g = highlight[1] * 255 
	// 	const b = highlight[2] * 255 
	// 	const innerAmount = highlight[3]
	// 	const outerAmount = highlight[4]

	// 	if (this.highlight) this.highlight.removeMesh( this.mesh )
	// 	if (innerAmount || outerAmount) {
	// 		if (!this.highlight) this.highlight = new BB.HighlightLayer( this.mesh.name + 'Highlight', this.$getSceneInstance())
	// 		this.highlight.addMesh( this.mesh, new BB.Color3(r,g,b) )
	// 		this.highlight.innerGlow = innerAmount > 0
	// 		this.highlight.outerGlow = outerAmount > 0
	// 		this.highlight.blurHorizontalSize = Math.max( innerAmount, outerAmount )
	// 		this.highlight.blurVerticalSize = Math.max( innerAmount, outerAmount )
	// 	}
	// }

	// setOutline( outline ) {


	// 	const r = outline[0] * 255 
	// 	const g = outline[1] * 255 
	// 	const b = outline[2] * 255 
	// 	const alpha = outline[3]
	// 	const width = outline[4]

	// 	this.mesh.outlineColor = new BB.Color3(r,g,b)
	// 	this.mesh.edgesAlpha = width > 0 ? alpha : 0
	// 	this.mesh.outlineAlpha = width > 0 ? alpha : 0
	// 	this.mesh.renderOutline = width > 0
	// 	this.mesh.outlineWidth = width
	// 	if (!this.outlineRenderer && width > 0) {
	// 		this.outlineRenderer = new BB.OutlineRenderer(this.$getSceneInstance())
	// 		this.mesh.enableEdgesRendering()
	// 	}

	// }

	// setOverlay( overlay ) {

	// 	const r = overlay[0] * 255 
	// 	const g = overlay[1] * 255 
	// 	const b = overlay[2] * 255 
	// 	const alpha = overlay[3]

	// 	if (alpha <= 0) return this.mesh.renderOverlay = false

	// 	this.mesh.overlayColor = new BB.Color3(r,g,b)
	// 	this.mesh.overlayAlpha = alpha
	// 	this.mesh.renderOverlay = alpha > 0

	// }

	// showBoundingBox( show ) {

	// 	const scene = this.$getSceneInstance()
	// 	if (!scene) return 
			
	//     scene.getBoundingBoxRenderer().frontColor.set(1, 0, 1, 1)
	//     scene.getBoundingBoxRenderer().backColor.set(0, 1, 1, 0)

	//     this.mesh.showBoundingBox = show

	// }
