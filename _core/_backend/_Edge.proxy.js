/* ====================================== */
/*                                        */
/*         	      EDGE PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D


import ProxyMeshes from './_Proxy.Meshes.js'

const DEBUG = false

export default class Edge extends ProxyMeshes {

	type = 'Edge'
	activeMeshRefs = { segment: null, segments: [], arrowA: null, arrowB: null }
	segmentsCache = [] 
	segmentRef = null

	arrowRefs = {}

	setup( data, shapeConfig, dashConfig ) {

		if (DEBUG) SAY('SETUP')
		if (this.isDisposing) return
			
		return new Promise((resolve,reject) => {
			this.uid = data.uid

			const scene = this.$getSceneInstance()

			this.shapeConfig = shapeConfig
			this.dashConfig = dashConfig

			this.$addSceneCacheCallback( 'syncEdgesTransforms', this, edges => {

				for (const edge of edges.values()) {

					const isVisible = (edge.pointA && edge.pointB) && edge.flags.isVisible

					if (isVisible !== edge.flags.isVisible) {
						edge.flags.isVisible = isVisible
						edge.$syncFlagsToMeshes()
					} 

					const { pointA, pointB } = edge.$getPointABPositions()

					const hasChangedA = !pointA.equals(edge.worldPointA)
					const hasChangedB = !pointB.equals(edge.worldPointB)

					if (((hasChangedA || hasChangedB) && pointA && pointB && edge.flags.isVisible)) {
						edge.$syncTransformFromAB( pointA, pointB )
						edge.$syncAll()
					}
						
				}
			}, 'registerAfterRender' )

			resolve(this.uid)
		})
	}

	dispose() {
		this.isDisposing = true

		this.$loopThroughMeshes( thin => thin.dispose ? thin.dispose() : null )
		this.activeMeshRefs = { segment: null, segments: [], arrowA: null, arrowB: null }
		for (const seg of this.segmentsCache) seg.dispose()
		this.segmentsCache = []
		if (this.segmentRef) {
			this.segmentRef.dispose()
			this.segmentRef = null
		}

		this.$getLookup().delete(this.uid)
	}

	setAllShapes( externalShapeConfig, shapeConfig, dashConfig, arrowConfig, flags ) {

		this.externalShapeConfig = externalShapeConfig
		this.shapeConfig = shapeConfig
		this.dashConfig = dashConfig
		this.arrowConfig = arrowConfig

		this.flags = flags

		this.needsUpdate = true

		this.$syncEdgeShape()
		this.$syncArrowShapes()

		const { pointA, pointB } = this.$getPointABPositions()
		this.$syncTransformFromAB( pointA, pointB )
		this.$syncAll()
	}


	$syncEdgeShape() {

		if (!this.shapeConfig || !this.flags) return

		this.internalThinCache.values().forEach( thinRef => {
			thinRef.isPickable = false
			thinRef.isVisible = false
		})

		const cachedMesh = this.$createSegment( this.shapeConfig )
		let thinRef = this.internalThinCache.get(cachedMesh.name)

		if (!thinRef) {
			thinRef = cachedMesh.createInstance( cachedMesh.name )
			thinRef.meta = { uid: this.uid, object: this.type }
			thinRef.data = this.data
			thinRef.isPickable = this.flags.isPickable
			thinRef.isVisible = this.flags.isVisible
			this.internalThinCache.set( cachedMesh.name, thinRef )
			if (this.debug) SAY('🌞 THIN', cachedMesh.name)
			for (const segment of this.activeMeshRefs.segments) segment.dispose()
			for (const segment of this.segmentsCache) segment.dispose()
			this.activeMeshRefs.segments = []
			this.segmentsCache = []
		}

		if (this.segmentRef !== thinRef) {
			this.segmentRef = thinRef
			if (this.debug) SAY('🌞 NEW', cachedMesh.name)
		}

		// const scene = this.$getSceneInstance()

		// for (const shadow of scene.shadows) {
		// 	shadow.getShadowMap().renderList.push( cachedMesh )
		// }

	}


	$syncArrowShapes() {

		if (!this.arrowConfig || !this.shapeConfig) return

		const { arrowSize, arrowWidth } = this.arrowConfig
		const { color } = this.shapeConfig
		const cachedMesh = this.$createArrow( { arrowWidth, color, isOnTop: this.shapeConfig.isOnTop } )

		const pointEnds = [ 'A', 'B' ]

		for (const end of pointEnds ) {

			this.activeMeshRefs['arrow' + end] = null

			if (this.arrowConfig[ 'isArrow' + end ]) {

				let thinRef = this.internalThinCache.get(cachedMesh.name + end )
				if (!thinRef) {
					thinRef = cachedMesh.createInstance( cachedMesh.name + end )
					thinRef.meta = { uid: this.uid, object: this.type }
					thinRef.data = this.data
					this.internalThinCache.set( cachedMesh.name + end, thinRef )
				}

				if ( this.arrowRefs[ 'arrow' + end ] !== thinRef ) this.arrowRefs[ 'arrow' + end ] = thinRef

				thinRef.isPickable = false
				thinRef.scaling = new Vec3(1,arrowSize,1)

				this.activeMeshRefs['arrow' + end] = thinRef
			}
		}

	}

	$getPointABPositions() {

		const pointA = new Vec3( typeof this.pointA === 'string' ? this.$getWorldAbsolutePosition( this.pointA ) : this.pointA)
		const pointB = new Vec3( typeof this.pointB === 'string' ? this.$getWorldAbsolutePosition( this.pointB ) : this.pointB)
		return { pointA, pointB }

	}

	setAB( pointA, pointB ) {
		this.pointA = pointA
		this.pointB = pointB
	}

	$syncTransformFromAB( pointA, pointB ) {

		if (!this.dashConfig || !this.shapeConfig || !this.flags || !this.arrowConfig) return

		this.worldPointA = pointA.clone()
		this.worldPointB = pointB.clone()

		// if (this.activeMeshRefs.segment) {
		// 	this.activeMeshRefs.segment.dispose()
		// 	this.activeMeshRefs.segment = null
		// }
		// if (this.activeMeshRefs.segments?.length > 0) {
		// 	this.activeMeshRefs.segments.forEach( thin => thin.dispose() )
		// 	this.activeMeshRefs.segments = []
		// }

		let { segmentsCache, segmentRef } = this
		let { segment, segments } = this.activeMeshRefs
		const { arrowA, arrowB } = this.arrowRefs

		const lookup = this.$getLookup()

		const direction = pointB.subtract(pointA).normalize()
		const rotationAxis = Vec3.Cross(BB.Axis.Y, direction)
		const angle = Math.acos(Vec3.Dot(BB.Axis.Y, direction))

		const edgeDistance = Vec3.Distance(pointA, pointB)
		const arrowDistance = edgeDistance - this.dashConfig.retraction
		let linesDistance = arrowDistance
		if (arrowA || arrowB) linesDistance -= (this.arrowConfig.arrowSize * 1.9 )

		const quaternion = BB.Quaternion.RotationAxis(rotationAxis, angle)
		const euler = quaternion.toEulerAngles()

		if (arrowA) {
			arrowA.position = pointA.add(direction.scale(this.dashConfig.retraction/2))
			arrowA.rotationQuaternion = quaternion
			arrowA.isVisible = this.flags.isVisible
		}
		if (arrowB) {
		    const flipped = BB.Quaternion.RotationAxis(BB.Axis.X, Math.PI)
			arrowB.position = pointB.subtract(direction.scale(this.dashConfig.retraction/2))
			arrowB.rotationQuaternion = quaternion.multiply(flipped)
			arrowB.isVisible = this.flags.isVisible
		}

		if (segmentRef) {

			if (!this.dashConfig.isDashed) {

				segmentRef.isVisible = this.flags.isVisible
				segmentRef.rotationQuaternion = quaternion
				segmentRef.scaling.y = linesDistance / 1
				segmentRef.position = pointA.add(pointB).scale(0.5)
				this.activeMeshRefs.segment = segmentRef

			} else {

				if (this.internalAuto === undefined) this.internalAuto = 0

				this.activeMeshRefs.segment = null
				segmentRef.isVisible = false

				// DASHES

				const count = (linesDistance / this.dashConfig.dashSize)
				const countIndex = Math.round(count) + 0
				const totalDashLength = (count) * this.dashConfig.dashSize
				const offset = (edgeDistance - totalDashLength) / 2

				const newSegments = []

				for (let i = 0; i < countIndex; i++ ) {

					if (!segmentsCache[i]) {
						const name = segmentRef.name + 'Dash' + i
						let thin = this.internalThinCache.get(name)
						if (!thin) {
							thin = segmentRef.createInstance( name )
							this.internalThinCache.set( name, thin )
						}
						segmentsCache.push(thin)
					}

					const thin = segmentsCache[i]

					thin.isVisible = this.flags.isVisible

					let autoOffset = this.internalAuto * (this.dashConfig.dashSize / Math.PI)
					let scaleSize = this.dashConfig.dashSize * this.dashConfig.dashGap
					let dashSize = (i-0.5) * this.dashConfig.dashSize
					let dashGap = this.dashConfig.dashSize * this.dashConfig.dashGap
					let scalePosition = dashSize + dashGap + offset + autoOffset

					thin.scaling = new Vec3(1, scaleSize, 1)

					thin.position = pointA.add(direction.scale(scalePosition))
					thin.rotationQuaternion = quaternion

					const distA = Vec3.Distance( pointA, thin.position ) / this.dashConfig.dashSize
					const distB = Vec3.Distance( pointB, thin.position ) / this.dashConfig.dashSize
					let dist = undefined
					if (distA < 1) dist = distA
					if (distB < 1) dist = distB

					const thinDirection = thin.position.subtract(pointA).normalize()
					const dotProduct = Vec3.Dot(direction, thinDirection)
					if (dotProduct < 0 || Vec3.Distance(pointA, thin.position) > Vec3.Distance(pointA, pointB)) dist = 0

					if (dist !== undefined) {
						thin.scaling.x *= dist
						thin.scaling.y *= dist
						thin.scaling.z *= dist
					}

					newSegments.push(thin)

				}

				for (let i = countIndex; i < segmentsCache.length; i++) {
					const thin = segmentsCache[i]
					if (thin) thin.isVisible = false
				}
				this.activeMeshRefs.segments = newSegments

			}

		}

		this.$syncAll()

	}  


}


	// $syncOffset() {

	// 	LoopThroughMeshes( this, item => {
	// 		// item.material.color = new BB.Color4(1,0,0,1)
	// 		// item.material.visibility = this.offset
	// 		// item.material.alpha = 0.5
	// 	})
	// }

	// setOffset( offset ) {
	// 	this.offset = offset
	// 	this.$syncOffset()
	// }

	// setRetraction( retraction ) {
	// 	this.retraction = retraction 
	// }

	// setAutoSpeed( autoSpeed ) {
	// 	this.autoSpeed = autoSpeed 
	// 	if (this.autoOffset === undefined) this.autoOffset = 0
	// 	if (this.autoSpeed > 0) this.$tickAutoSpeed()
	// }

	// $tickAutoSpeed() {
	// 	this.autoOffset += this.autoSpeed
	// 	if (this.autoOffset > Math.PI) this.autoOffset = 0
	// 	if (this.autoSpeed > 0) globalThis.requestAnimationFrame( () => this.$tickAutoSpeed() )
	// }

	// setInternalDashes( isDashed, dash ) {

	// 	// INTERNAL DASHES

	// 	dash = (new Vec2( dash )).toArray()
	// 	this.dashSize = dash?.[0] || dash || 0.1
	// 	this.dashGap = dash?.[1] || 0.5
	// 	this.isDashed = isDashed

	// }
