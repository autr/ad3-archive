
/* ====================================== */
/*                                        */
/*         	      PROXIES                 */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { Vec2, Vec3, Vec4 } from '$ad3'
import { LoopThroughMeshes } from './lib.core.js'

export default class Proxy {
	
	uid = undefined
	engine = undefined
	type = 'Proxy'
	category = 'Category'

	// ========== INTERNAL ==========

	$getEngineMeshCache() {
		return this.engine.meshCache
	}
	
	$getEngineMaterialCache() {
		return this.engine.materialCache
	}
	$getMeshCache() {
		return this.engine.meshes
	}

	alerted = {
		scene: false,
		camera: false
	}

	$getCamera() {
		const cam = this.$getCameraInstance()
		return this.$getLookup().get( cam.name )
	}
	$getCameraInstance() {
		return this.$getSceneInstance()?.activeCamera
	}

	$getWorldMesh( uid ) {
		const obj = this.$getLookup().get( uid )
		const mesh = obj?.worldMesh
		return mesh
	}
	$getWorldAbsolutePosition( uid ) {
		const mesh = this.$getWorldMesh( uid )
		if (!mesh) return // SAY(`🚨 ${uid} has no worldMesh`, mesh)
		if (!mesh.getAbsolutePosition) return SAY(`🚨 ${uid} worldMesh has no getAbsolutePosition`, mesh.getAbsolutePosition)
		return mesh.getAbsolutePosition()
	}

	$findInstance( something, backup = null ) {
		if (typeof something === 'string') {
			const ref = this.$getLookup().get( something )
			if (ref?.instance) {
				if (this.debug) SAY(`${this.uid} 🟢 instance: ${something}`)
				return ref.instance
			} else {
				if (this.debug) SAY(`${this.uid} 🔴 instance: ${something}`)
			}
		}
		return backup || something
	}

	$removeSceneCacheCallback( name, object ) {

		const engine = this.$getEngine()
		const cache = engine.sceneCaches.get(name)
		if (cache) {
			cache.delete( object.uid )
		}
	}

	$addSceneCacheCallback( name, object, beforeRenderCallback, registerFunction = 'registerBeforeRender' ) {
		const engine = this.$getEngine()
		if (!engine.sceneCaches.get(name)) {
			const store = new Map()
			const scene = this.$getSceneInstance()
			engine.sceneCaches.set( name, store )
			scene[registerFunction]( () => beforeRenderCallback( store ) )
		}
		
		engine.sceneCaches.get( name ).set( object.uid, object )
	}

	$getEngine() {
		return this.engine
	}
	$getEngineInstance() {
		return this.engine.instance
	}
	$getLookup() {
		return this.engine.lookup
	}
	$getLookupItem( uid ) {
		const lookup = this.$getLookup()
		if (!lookup) return SAY(`🚨 no lookup`)
		return lookup.get(uid)
	}

	$getPointJunctions() {
		return this.engine.pointJunctions
	}
	$getFaceDetector() {
		return this.engine.faceDetector
	}
	
	$getSceneInstance() {
		const engine = this.$getEngine()
		if (!engine) SAY(`❌ NO ENGINE: ${this.type} ${this.uid}` )
		const scene = engine.$getSceneInstance()
		if (!scene) SAY(`❌ NO SCENE: ${this.type} ${this.uid}`)
		return scene
	}
	$getCanvas() {
		const canvas = this.engine.instance.getRenderingCanvas()
		if (!canvas) SAY(`❌ NO CANVAS: ${this.type} ${this.uid}`)
		return canvas
	}

	// ========== EXTERNAL ==========

	setSysParent( domSysParent, dataSysParent ) {
		if (this.debug) SAY(`🏛️ SYSPARENT: dom ${domSysParent||''} / data ${dataSysParent||''}`)
		this.domSysParent = domSysParent
		this.dataSysParent = dataSysParent
		this.sysParent = dataSysParent || domSysParent
	}

	initialiseWithEngine( uid, engineProxy, debug ) {

		if (debug) SAY(`⚪️ INITIALISED WITH ENGINE [${this.type}:${uid}}]`)

		// SAY('🚨 INIT PROXY', uid)

		this.uid = uid
		this.debug = debug

		if (!engineProxy) {
			SAY(`❌ ${uid} NO ENGINE PROXY`)
		} else {
			this.engine = engineProxy
		}
	}

	setDebug( debug ) {
		this.debug = debug
	}






}