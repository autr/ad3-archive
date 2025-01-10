/* ====================================== */
/*                                        */
/*         	      POINT PROXY             */
/*                                        */
/* ====================================== */

// #define PROXY3D

import ProxyMeshes from './_Proxy.Meshes.js'

export default class Point extends ProxyMeshes {

	type = 'Point'

	setup( data ) {
		return new Promise((resolve,reject) => {

			this.uid = data.uid
			this.data = data
			if (data.debug) SAY(`⚫️ new point ${data.uid}`)
			if (this.debug) this.$getSceneInstance().registerBeforeRender( this.$debugLoop.bind(this) )

			this.$addSceneCacheCallback( 'syncPointTransforms', this, points => {

				for (const point of points.values()) {
					if (point.needsUpdate) {
						point.$syncShape()
						point.$syncRadius()
						point.$syncAll()
						point.needsUpdate = false
					}
				}
			}, 'registerBeforeRender' )
			return resolve(this.uid)
		})
	}

	setPosition( newPosition ) {
		this.position = newPosition
		this.$syncPosition()
	}


	$disposeMeshes() {
		this.$loopThroughMeshes( mesh => mesh.dispose() )
	}

	dispose() {
		this.$disposeMeshes()
	}


	$debugLoop() {
		SAY(`🪲 ${this.uid}`, this.worldMesh.position, this.worldMesh.getAbsolutePosition())
	}

	setRadius( radius ) {

		this.radius = radius 
		this.needsUpdate = true
	}

	$syncRadius() {

		this.$loopThroughMeshes( thinRef => {
			thinRef.scaling = new Vec3(this.radius)
		})
	}

	setShape( externalShape, internalShapeConfig ) {

		this.externalShape = externalShape
		this.internalShapeConfig = internalShapeConfig
		this.needsUpdate = true
	}

	$syncShape() {

		if (!this.internalShapeConfig) return

		this.internalThinCache.values().forEach( thinRef => {
			thinRef.isPickable = false
			thinRef.isVisible = false
		})

		const cachedMesh = this.$createSphereOrDisc( this.internalShapeConfig )


		const scene = this.$getSceneInstance()


		let thinRef = this.internalThinCache.get(cachedMesh.name)
		
		if (!thinRef) {
			thinRef = cachedMesh.createInstance( cachedMesh.name )
			thinRef.meta = { uid: this.uid, object: this.type }
			thinRef.data = this.data
			thinRef.isPickable = this.isPickable
			thinRef.isVisible = this.isVisible
			this.internalThinCache.set( cachedMesh.name, thinRef )
			if (this.debug) SAY('🌞 THIN', cachedMesh.name)
		}

		if (this.activeMeshRefs.point !== thinRef) {
			this.activeMeshRefs.point = thinRef
			if (this.debug) SAY('🌞 NEW', cachedMesh.name)
		}

		// for (const shadow of scene.shadows) {
		// 	shadow.getShadowMap().renderList.push( cachedMesh )
		// 	shadow.getShadowMap().renderList.push( thinRef )
		// }


	}


}