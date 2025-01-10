
// #define JAVASCRIPT

import Proxy from './_Proxy.js'

export default class ProxyMeshes extends Proxy {

	worldMesh = null
	activeMeshRefs = { point: null }
	internalThinCache = new Map()


	$createColorMaterial( color ) {

		const r = color[0]
		const g = color[1]
		const b = color[2]
		const a = color[3]

		const name = `R${r}G${g}B${b}A${a}`
		let material = this.$getEngineMaterialCache().get(name)

		if (!material) {
			material = new BB.StandardMaterial( name, this.$getSceneInstance() )
			material.emissiveColor = new BB.Color3( r,g,b )
			material.disableLighting = true
			material.backFaceCulling = false
			material.alpha = a
			this.$getEngineMaterialCache().set( name, material )
		}
		return material 
	}

	$createConfigUid( config ) {
		const keys = Object.keys(config).sort()
		return keys.map( key => {
			return `${key}:${JSON.stringify(config[key])}`
		}).join('/')
	}

	$createSphereOrDisc( internalShapeConfig ) {

		const cache = this.$getEngineMeshCache()

		// SAY(this.uid, '---------', internalShapeConfig)
		const cacheUid = this.$createConfigUid( internalShapeConfig )
		let cachedMesh = cache.get(cacheUid)

		if (!cachedMesh) {

			if (internalShapeConfig.useSphere) {

				cachedMesh = new BB.CreateSphere( cacheUid, {
					diameterX: 2,
					diameterY: 2,
					diameterZ: 2,
					segments: internalShapeConfig.resolution || 32,
					sideOrientation: 2
				}, this.$getSceneInstance())

			} else {

				cachedMesh = new BB.CreateDisc( cacheUid, {
					radius: 1,
					tessellation: internalShapeConfig.resolution || 32,
					sideOrientation: 2
				}, this.$getSceneInstance())

			}

			cachedMesh.makeGeometryUnique()
			cachedMesh.thinInstanceEnablePicking = true
			cachedMesh.backFaceCulling = false
			cachedMesh.isPickable = false
			cachedMesh.isVisible = false

			const engine = this.$getEngineInstance()
		    this.$getSceneInstance().registerBeforeRender( group => {
		        if (group === 1) engine.setDepthFunction(519) // ALWAYS
		    })
		    
		    this.$getSceneInstance().registerAfterRender( group => {
		        if (group === 1) engine.setDepthFunction(515) // LEQUAL
		    })
			if (internalShapeConfig.isOnTop) cachedMesh.renderingGroupId = 1

			internalShapeConfig.color = this.$sanitiseColor( internalShapeConfig.color )
			cachedMesh.material = this.$createColorMaterial( internalShapeConfig.color )

			cache.set(cacheUid, cachedMesh)
		}

		return cachedMesh

	}

	$sanitiseColor( color ) {
		if (!Array.isArray(color)) return color
		return color.map( value => {
			return Math.round( value * 255 )/255
		})
	}


	$createSegment( internalShapeConfig ) {

		const cache = this.$getEngineMeshCache()
		const cacheUid = this.$createConfigUid( internalShapeConfig )
		let cachedMesh = cache.get(cacheUid)

		if (!cachedMesh) {

			const count = (internalShapeConfig.rounded || 0) + 2
			const dist = 1 / count
			const points = []
			const widths = []

			for (let i = 0; i <= count; i ++ ) {
				const pos = (dist * i) - 0.5
				points.push( new Vec3(0, pos, 0) )
				const angle = (Math.PI * (i / count))
				let cosWidth = Math.cos(angle + (Math.PI*1.5)) * (internalShapeConfig.width * 10)
				if (!internalShapeConfig.rounded) cosWidth = (internalShapeConfig.width * 10)
				widths.push( cosWidth )
				widths.push( cosWidth )
			}

			const color = this.$sanitiseColor( internalShapeConfig.color )


			cachedMesh = new BB.CreateGreasedLine( cacheUid, {
				points,
				widths,
			}, {
				materialType: BB.GreasedLineMeshMaterialType.MATERIAL_TYPE_STANDARD,
				color: new BB.Color4(...color),
				colorMode: BB.GreasedLineMeshColorMode.COLOR_MODE_SET,
				useColors: false
			}, this.$getSceneInstance())

			cachedMesh.material.disableLighting = true
			cachedMesh.material.alpha = color[3] || 1
			cachedMesh.thinInstanceEnablePicking = true
			cachedMesh.isPickable = false
			cachedMesh.isVisible = false
			if (internalShapeConfig.isOnTop) cachedMesh.renderingGroupId = 1

			cache.set(cacheUid, cachedMesh)
		}
		return cachedMesh
	}

	$syncPosition() {

		if (!this.position) return
		this.$ensureWorldMesh()

		const isString = typeof this.position === 'string'

		if (isString) {
			const externalPosition = this.$getWorldMesh( this.position )?.position
			if (externalPosition) {
				this.worldMesh.position = externalPosition
				this.$syncWorldMesh()
			}
		} else if (Array.isArray(this.position)) {
			this.worldMesh.position.x = this.position[0]
			this.worldMesh.position.y = this.position[1]
			this.worldMesh.position.z = this.position[2]
			this.worldMesh.position.smoothing = this.position[3] || 0
		} else {
			SAY(`🚨 position must be array or string: ${this.uid} `)
		}

	}
	
	$createArrow( config ) {

		const cache = this.$getEngineMeshCache()
		const cacheUid = this.$createConfigUid( config )
		let cachedMesh = cache.get(cacheUid)

		if (!cachedMesh) {

			const points = [ new Vec3(0,0,0), new Vec3(0,1,0) ]
			const widths = [ 0, 0, config.arrowWidth * 10, config.arrowWidth * 10 ]
			const color = this.$sanitiseColor( config.color )

			cachedMesh = new BB.CreateGreasedLine( cacheUid, {
				points,
				widths,
			}, {
				materialType: BB.GreasedLineMeshMaterialType.MATERIAL_TYPE_STANDARD,
				color: new BB.Color4(...color),
				colorMode: BB.GreasedLineMeshColorMode.COLOR_MODE_SET,
				useColors: false
			}, this.$getSceneInstance())

			cachedMesh.material.disableLighting = true
			cachedMesh.material.alpha = color[3] || 1
			cachedMesh.thinInstanceEnablePicking = true
			cachedMesh.isPickable = false
			cachedMesh.isVisible = false
			if (config.isOnTop) cachedMesh.renderingGroupId = 1

			cache.set(cacheUid, cachedMesh)
		}
		return cachedMesh
	}




	$ensureWorldMesh() {
		if (!this.worldMesh) this.worldMesh = new BB.Mesh()
	}


	$syncRotation() {

		if (!this.rotation) return
		this.$ensureWorldMesh()

		const isString = typeof this.rotation === 'string'

		if (isString) {
			const externalRotation = this.$getWorldMesh( this.rotation ).rotation
			if (externalRotation) {
				this.worldMesh.rotation = externalRotation
				this.$syncWorldMesh()
			}
		} else {
			const rotation = (new Vec3( this.rotation )).toArray()
			this.worldMesh.rotation.x = rotation[0]
			this.worldMesh.rotation.y = rotation[1]
			this.worldMesh.rotation.z = rotation[2]
			this.worldMesh.rotation.smoothing = this.rotation?.[3] || 0
		}
	}

	$syncScaling() {

		if (!this.scaling) return
		this.$ensureWorldMesh()

		const isString = typeof this.scaling === 'string'

		if (isString) {
			const externalScaling = this.$getWorldMesh( this.scaling ).scaling
			if (externalScaling) {
				this.worldMesh.scaling = externalScaling
				this.$syncWorldMesh()
			}
		} else {
			const scaling = (new Vec3( this.scaling )).toArray()

			this.worldMesh.scaling.x = scaling[0]
			this.worldMesh.scaling.y = scaling[1]
			this.worldMesh.scaling.z = scaling[2]
			this.worldMesh.scaling.smoothing = this.scaling?.[3] || 0
		}
	}

	$syncWorldMesh() {

		this.$ensureWorldMesh()
		this.$loopThroughMeshes( thinRef => {
			if (thinRef.parent !== this.worldMesh) thinRef.parent = this.worldMesh
		})

	}
	
	$syncTransformParent() {

		const item = this.$getLookupItem(this.transformParent)
		const parent = item?.instance || item?.worldMesh
		this.$ensureWorldMesh()
		this.worldMesh.parent = parent // IMPORTANT: this is what used by interactions 
	}

	$loopThroughMeshes( itemCallback, debug ) {

		if (!this.activeMeshRefs) return
		let i = 0
		for ( const [key,value] of Object.entries(this.activeMeshRefs) ) {
			if (Array.isArray(value)) {
				for ( const item of value ) {
					if (item) {
						itemCallback( item )
					} else {
						if (debug) SAY(`🚨 MISS ${this.uid} -> ${key}`)
					}
				}
			} else {
				if (value) {
					itemCallback( value )
				} else {
					if (debug) SAY(`🚨 MISS ${this.uid} -> ${key} -> ${i}`)
				}
			}
			i += 1
		}
	}

	$syncFlagsToMeshes( originMessage ) {

		if (!this.flags) return SAY(`NO FLAGS`, originMessage || '')

		this.$loopThroughMeshes( item => {
			for (const [ key, value ] of Object.entries(this.flags) ) {
				if (key === 'isEnabled') {
					item.setEnabled( value )
				} else if (key === 'isBillboard') {
					item.billboardMode = value ? BB.Mesh.BILLBOARDMODE_ALL : 0
				} else if (key === 'isHighlighted') {
					item.showBoundingBox = value
				} else if (key === 'isOccluding') {
					// item.material.depthFunction = value ? 0 : 7 // Depth
				} else {

					// if (key === 'isVisible') SAY(`VISIBILITY`, this.uid, value)
					item[key] = value
				}

			}
		})

	}

	$syncAll() {

		this.$syncFlagsToMeshes()
		this.$syncPosition()
		this.$syncScaling()
		this.$syncTransformParent()
		this.$syncWorldMesh() // MUST BE LAST

	}

	// ---------------------------------
	// ----------- SETTERS -------------
	// ---------------------------------

	setFlags( flags ) {

		this.flags = flags
		this.$syncFlagsToMeshes()
	}

	setTransformParent( transformParent ) {
		this.transformParent = transformParent
		this.$syncTransformParent()
	}

	setRotation( newRotation ) {
		this.rotation = newRotation
		this.$syncRotation()
	}
	
	setScaling( newScaling ) {

		this.scaling = newScaling
		this.$syncScaling()
	}

}