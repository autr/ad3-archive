/* ====================================== */
/*                                        */
/*         	     ENGINE PROXY             */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { CreateEngine } from '$ad3_core_backend_lib'
import { CycleDetectionDFS } from './lib.core.js'

class PointJunctions {


	constructor( lookup, debug ) {
		this.lookup = lookup
		this.debug = debug
	}

	junctions = new Map()

	removeJunction( object, targetUid, note, debug ) {

		const junction = this.junctions.get(targetUid)
		const filter = junction.filter( ([_uid,_note]) => {
			const rm = object.uid ===_uid && note === _note 
			if (this.debug) SAY(`🟥 RM ${rm}`, {_uid, _note, uid: object.uid, note})
			return !rm
		})

		if (junction) this.junctions.set( targetUid, filter )
		if (this.debug || debug) SAY(`🟥 ${targetUid} -> ${object.uid} ${note}`, filter)
	}
	setJunction( object, targetUid, note, debug ) {

		if (!this.junctions.get(targetUid)) this.junctions.set( targetUid, [] )
		const junction = this.junctions.get(targetUid)
		if (object.uid) {
			junction.push( [object.uid,note] )
			this.sendJunctionUpdate( targetUid, debug )
		}
		if (this.debug || debug) SAY(`🟩 ${targetUid} -> ${object.uid} ${note}`, Stringify(junction))

	}

	sendJunctionUpdate( uid, debug ) {

		if (!this.lookup.get) return SAY(`🚨 no lookup in Junctions`)
		const junctions = this.junctions.get( uid )

		// SAY(uid)
		if (junctions) {
			for (const [u,n] of junctions) {
				const o = this.lookup.get(u)
				if (o.$triggerFromJunction) {
					if (this.debug || debug) SAY(`🟪 ${uid} ${uid} ->`, u)
					o.$triggerFromJunction( uid, n )
				}
			}
		}
	}
}



class FaceDetector {

	points = [] // [ uid, ... ]
	edges = [] // [[ uid, uidA, uidB ], ... ]
	debug = false
	faces = new Map()
	callback = null
	data = { set: [], delete: [] }

	$calculateFaces() {

		if (this.calculateRequest) {
			cancelAnimationFrame( this.calculateRequest )
			this.calculateRequest = null
		}

		this.calculateRequest = requestAnimationFrame( () => {

			const cycles = CycleDetectionDFS( this.points, this.edges )
			const uids = []

			for ( const cycle of cycles ) {
				const uid = 'FaceGen' + cycle.join('')
				if (!this.faces.get(uid)) {
					this.faces.set( uid, cycle )
					this.data.set.push( { uid, cycle } )
				}
				uids.push( uid )
			}

			const keys = this.faces.keys()
			for (const key of keys) {
				if (!uids.includes(key)) {
					this.faces.delete( key )
					this.data.delete.push( key )
				}
			}

			if (this.callback && (this.data.set.length || this.data.delete.length) ) this.callback( this.data )
			this.data = { set: [], delete: [] }
		})

	}

	dispose() {
		SAY('DISPOSE ENGINE')
	}

	setCallback( callback ) {
		this.callback = callback
	}

	setPoint( uid ) {
		if (!this.points.includes(uid)) this.points.push( uid )
		if (this.debug) SAY(`📀 setPoint`, this.points.length, uid)
		this.$calculateFaces()
	}

	deletePoint( uid ) {
		this.points = this.points.filter( u => u !== uid )
		if (this.debug) SAY(`📀 deletePoint`, this.points.length, uid)
		this.$calculateFaces()
	}

	setEdge( uid, uidA, uidB ) {
		const exists = this.edges.find( ([u,a,b]) => {
			return (( a === uidA && b === uidB ) || ( b === uidA && a === uidB )) && u === uid
		})
		if (!exists) this.edges.push([uid,uidA,uidB])
		if (this.debug) SAY(`💽 setEdge`, this.edges.length, uid, uidA, uidB)
		this.$calculateFaces()
	}

	deleteEdge( uid, uidA, uidB ) {
		this.edges = this.edges.filter( ([u,a,b]) => {
			return !( a === uidA && b === uidB ) && !( b === uidA && a === uidB ) && u !== uid
		})
		if (this.debug) SAY(`💽 deleteEdge`, this.edges.length, uid, uidA, uidB)
		this.$calculateFaces()
	}
}


export default class Engine extends Proxy {

	instance = null
	lookup = 'nothing'
	type = 'Engine'

	// DATA

	sceneIndex = 0
	fps = 0
	isCurrentlyNoScene = false
	shouldRender = true
	renderDate = 0

	// TOOLS

	pointJunctions = null
	faceDetector = new FaceDetector()

	// CACHES

	meshCache = new Map()
	materialCache = new Map()
	highlightLayers = new Map()
	sceneCaches = new Map()

	initialiseEngine( uid, lookup, debug ) {

		this.uid = uid
		this.debug = debug
		this.lookup = lookup
		if (debug) SAY(`🟣 INITIALISED ${uid}`)

	}


	setupEngineAndCanvas( uid, canvas, downscale, useNullEngine, useWebGPU, useWorker, debug ) {


		return new Promise((resolve,reject) => {

			this.uid = uid
			this.pointJunctions = new PointJunctions( this.lookup, debug )
			if (!globalThis?.navigator || useNullEngine ) {
				this.instance = new BB.NullEngine({
					renderWidth: canvas.width,
					renderHeight: canvas.height
				})
				this.instance.runRenderLoop( this.$render.bind(this) )
				this.instance.getRenderingCanvas = () => canvas
				SAY(`🏭 ${this.uid} null engine`)
				resolve()
			} else {
				SAY(`🖼️ CANVAS ${this.uid}`)
				CreateEngine( canvas, useWebGPU, useWorker, debug ).then( result => {
					this.instance = result
					this.instance.runRenderLoop(this.$render.bind(this))
					resolve()
				}).catch( err => {
					SAY(`❌ ${this.uid} GLSLANG / TWGSL`, err.message, err)
					reject()
				})
			}

			globalThis.engineProxy = this
		})
	}
	
	enableRendering( shouldRender ) {
		this.shouldRender = shouldRender
	}

	setEngineCallback( callback ) {
		SAY('📮 ENGINE CALLBACK SET', callback)
		this.callback = callback
	}

	configureHighlightLayer( config, scene ) {

		const str = Stringify( config )

		// if (this.highlightLayers[str]) return this.highlightLayers[str]

		if (!scene) scene = this.$getSceneInstance()

		// const layer = new BB.HighlightLayer( str, scene, {
		// 	blurHorizontalSize: config.size,
		// 	blurVerticalSize: config.size,
		// 	isStroke: config.stroke,
		// })

		// layer.innerGlow = false
		// layer.outerGlow = true

		// this.highlightLayers[str] = layer
		return layer
	}

	resize( left, top, width, height, downscale ) {
		SAY(`📐 RESIZE`)

		if (this.resizeRequest) clearTimeout( this.resizeRequest )

		this.resizeRequest = setTimeout( () => {

			const canvas = this.instance.getRenderingCanvas()
			canvas.width = width / downscale
			canvas.height = height / downscale
			this.instance.resize( true )
			SAY(`🟢 📐 ${ canvas?.width} / ${canvas?.height}`)
		}, 100)
	}

	setHoveredSelected( hovered, selected ) {

		const scene = this.$getSceneInstance()
		if (!scene) return 

		return

		scene.getBoundingBoxRenderer().frontColor.set(1, 0, 0)
		scene.getBoundingBoxRenderer().backColor.set(0, 1, 0)


		const hoveredLayer = this.configureHighlightLayer({
			size: 0.5,
			stroke: true 
		}, scene )
		const selectedLayer = this.configureHighlightLayer({
			size: 0.5,
			stroke: true 
		}, scene )

		for (const mesh of scene.meshes || []) {

			const isSelected = selected.includes(mesh.info.uid)
			const isHovered = hovered.includes(mesh.info.uid)


			if (isSelected) {


				// selectedLayer.addMesh( mesh, new BB.Color4( 1, 1, 0, 1))

				mesh.renderOutline = true
				mesh.outlineColor = new BABYLON.Color3(255, 0, 0)
				mesh.outlineWidth = 0.01

				// mesh.showBoundingBox = true
			} else if (isHovered) {

				// mesh.enableEdgesRendering()
				// mesh.edgesColor = new BB.Color4(1,0,0,1)

				// selectedLayer.addMesh( mesh, new BB.Color4( 1, 0, 0, 1))

				// mesh.renderOutline = true
				// mesh.outlineColor = new BABYLON.Color3(0, 255, 255)
				// mesh.outlineWidth = 0.01

				// mesh.renderOverlay = true
				// mesh.overlayColor = new BABYLON.Color3(0, 255, 255)
				// mesh.overlayAlpha = 0.8


				// mesh.showBoundingBox = true
			} else {
				// selectedLayer.removeMesh( mesh )
				// hoveredLayer.removeMesh( mesh )

				mesh.renderOutline = false
				
				// mesh.showBoundingBox = false
			}
		}
	}

	findIntersectingMeshMeta( x, y ) {
		return new Promise((resolve,reject) => {

			if (!this.instance) return resolve({})
				
			const matrix = new BB.Matrix()
			const width = this.instance.getRenderWidth()
			const height = this.instance.getRenderHeight()
			const scene = this.$getSceneInstance()

			if (!scene) return resolve(null)

			const picked = scene.pick(
				x, 
				y,
				null, // predicate: function to determine eligible meshes 
				false, // fast check (first intersection, not the closest)
				null, // scene.camera is used by default
				null // optional matrix
			)

			if (picked.hit) {
				resolve(picked.pickedMesh.meta || {})
			} else {
				resolve({})
			}
		})
	}


	setSceneIndex( index ) {

		SAY(`🎇 ${this.uid} setSceneIndex`)
		this.sceneIndex = index
	}

	$getSceneInstance() {
		return this.instance.scenes[this.sceneIndex]
	}

	$render() {


		// SAY(`ENGINE FPS ${this.instance.getFps()}`)

		const scene = this.$getSceneInstance()
		const width = this.instance.getRenderWidth()
		const height = this.instance.getRenderHeight()

		if (scene && scene?.cameras?.length > 0) {
			if (this.shouldRender) scene.render()
			this.isCurrentlyNoScene = false
		} else if (!this.notifiedNoScene) {
			if (!this.isCurrentlyNoScene) SAY(`🚨 NO SCENE AT INDEX (${this.sceneIndex})`)
			this.isCurrentlyNoScene = true
		}

		if (this.callback) this.callback( this.instance.getFps() )

	}

}