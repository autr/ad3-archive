/* ====================================== */
/*                                        */
/*         	      MESH BASE               */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { VertexData, VertexBuffer, StandardMaterial } from '@babylonjs/core'
import { Vec3 } from '$3d1_points'
import Entity from './_Entity.svelte.js'

export default class Mesh extends Entity {


	// Mesh.FRONTSIDE (default), Mesh.BACKSIDE or Mesh.DOUBLESIDE

	// ========== INTERNAL ==========

	constructor( id, collection ) {
		super( id, collection )

		// ------ MATERIAL ------

		$effect( this.syncMaterial.bind(this) )

		// ------ COMMON ------

		$effect( this.syncPosition.bind(this) )
		$effect( this.syncRotation.bind(this) )
		$effect( this.syncScaling.bind(this) )
		$effect( this.syncUpdatable.bind(this) )
		$effect( this.syncFlatShaded.bind(this) )
		$effect( this.syncMaterial.bind(this) )
	}

	syncUpdatable() {
		if (this.instance) this.instance.updatable = this.state.updatable 
	}

	syncPosition() {

		const instance = this.getInstance()
		if (instance) {
			const target = this.getInstanceTargetOrVec3( this.state.position, 'syncPosition' )
			instance.position.x = target.x
			instance.position.y = target.y
			instance.position.z = target.z 
		}
	}
	syncScaling() {

		const instance = this.getInstance()
		if (instance) {
			const target = this.getInstanceTargetOrVec3( this.state.scaling, 'syncScaling', 1 )
			instance.scaling.x = target.x
			instance.scaling.y = target.y
			instance.scaling.z = target.z 
		}
	}
	syncRotation() {
		if (this.instance) this.instance.rotation = this.getInstanceTargetOrVec3( this.state.rotation, 'syncRotation' )
	}

	syncFlatShaded() {
		if (this.state.flat && this.instance?.convertToFlatShadedMesh) {
			this.instance.convertToFlatShadedMesh()
		}
	}
	syncMaterial() {
		if (!this.instance) return
		// this.instance.material = new StandardMaterial( 'mat' )
	}

	finish() {

		super.finish()

		untrack( () => {
			
			this.syncPosition()
			this.syncRotation()
			this.syncUpdatable()
			this.syncFlatShaded()
			this.syncMaterial()
		})

	}


	updateVertices( vertices, indices, normals ) {
		if (!this.instance) return
		const vertexCount = this.instance.geometry ? this.instance.geometry.getVerticesData(VertexBuffer.PositionKind).length : null
		if (vertexCount !== vertices.length) {
			const scene = context.getScene()
			const vertexData = new VertexData()
			vertexData.positions = vertices || []
			vertexData.indices = this.invertOrder( indices || this.fill( vertices.length ) )
			vertexData.normals = normals || []
			if (vertexData.normals.length <= 0) BB.VertexData.ComputeNormals(vertexData.positions, vertexData.indices, vertexData.normals)
			vertexData.uvs = uvs || this.getSphericalCoords( vertexData.positions )
			vertexData.applyToMesh(this.instance, true)
			this.instance.computeWorldMatrix(true)
			if (this.debug) SAY('🩻 UPDATE')
		}
	}



	createSphericalUvs() {
		const coords = []
		
		for (let i = 0; i < this.vertices.length/3; i++) {
			const x = this.vertices[i * 3]
			const y = this.vertices[i * 3 + 1]
			const z = this.vertices[i * 3 + 2]
			
			const vertex = new Vec3(x, y, z)
			const r = Math.sqrt(x*x + y*y + z*z)

			const theta = Math.atan2(z, x)
			const phi = Math.acos(y / r)

			const u = 0.5 + theta / (2 * Math.PI)
			const v = 1 - phi / Math.PI

			coords.push(u, v)
		}

		return coords
	}


	createBasicUvs() {
		const texcoords = []
		for (let i = 0; i < this.indices.length; i += 3) {
			const idx1 = this.indices[i]
			const idx2 = this.indices[i + 1]
			const idx3 = this.indices[i + 2]

			const p1 = new Vec3(this.vertices[idx1 * 3], this.vertices[idx1 * 3 + 1], this.vertices[idx1 * 3 + 2])
			const p2 = new Vec3(this.vertices[idx2 * 3], this.vertices[idx2 * 3 + 1], this.vertices[idx2 * 3 + 2])
			const p3 = new Vec3(this.vertices[idx3 * 3], this.vertices[idx3 * 3 + 1], this.vertices[idx3 * 3 + 2])

			const u = p2.subtract(p1)
			const v = p3.subtract(p1)
			const normal = Vec3.Cross(u, v).normalize()

			const textureScale = 1 / (2 * Math.PI)

			const uAngle = Math.atan2(u.z, u.x)
			const vAngle = Math.asin(normal.y)

			const uNormalized = uAngle / (2 * Math.PI)
			const vNormalized = (vAngle + Math.PI / 2) / Math.PI

			const faceTextureCoordinates = [
				uNormalized, vNormalized,
				uNormalized + 1, vNormalized,
				uNormalized, vNormalized + 1
			]
			texcoords.push(...faceTextureCoordinates)
		}

		return texcoords
	}



}