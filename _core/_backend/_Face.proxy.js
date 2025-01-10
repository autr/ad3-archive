/* ====================================== */
/*                                        */
/*         	      FACE PROXY              */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { GeneratePlainColorMaterial, SyncEnabledPickableVisible } from './lib.core.js'
import ProxyMeshes from './_Proxy.Meshes.js'

export default class Face extends ProxyMeshes {

	type = 'Face'
	activeMeshRefs = { face: null }

	setup( uid, faceConfig, flags ) {
		return new Promise((resolve,reject) => {
			this.uid = uid
			this.faceConfig = faceConfig
			this.flags = flags

			this.$addSceneCacheCallback( 'syncFaceTransforms', this, faces => {
				for (const face of faces.values()) {
					face.$syncPointsMesh()
				}
			}, 'registerAfterRender' )

			resolve(uid)
		})
	}

	setFaceConfig( faceConfig ) {
		this.faceConfig = faceConfig

	}

	setCentroidCallback( callback ) {
		this.callback = callback
	}

	$syncPointsMesh() {


		if (this.flags.isVisible && this.flags.isEnabled) {
			let mesh = this.activeMeshRefs.face

			if (!this.faceConfig.points || this.faceConfig.points?.length < 3) {
				if (mesh) {
					mesh.isPickable = false
					mesh.isVisible = false
				}
			} else if (mesh) {
				mesh.isPickable = this.isPickable
				mesh.isVisible = this.isVisible
			}

			let flagNotReady = false

			const vectors = this.faceConfig.points.map( uid => {
				const vertex = this.$getWorldAbsolutePosition( uid )
				if (!vertex) flagNotReady = true
				return vertex.clone ? vertex.clone() : vertex
			})

			if (flagNotReady) return

			const positions = []
			const indices = []
			const name = 'FaceMesh' + this.faceConfig.points.join('')

			const centroid = vectors.reduce((acc, point) => {
				return acc.add(point)
			}, new BB.Vector3(0, 0, 0)).scale(1 / vectors.length)

			positions.push(centroid.x, centroid.y, centroid.z)
			vectors.forEach((vertex, index) => {
				positions.push(vertex.x, vertex.y, vertex.z)
				indices.push(0, index, index + 1)
			})
			indices.push(0, vectors.length, 1)

			// if (!mesh) {
				if (mesh) mesh.dispose()
				mesh = new BB.Mesh(name, this.$getSceneInstance())
				mesh.updateable = true
				mesh.sideOrientation = 2
				mesh.setVerticesData(BB.VertexBuffer.PositionKind, positions)
				mesh.markVerticesDataAsUpdatable(BB.VertexBuffer.PositionKind, true)
				mesh.setIndices(indices)
				this.activeMeshRefs.face = mesh
			// } else {
			// 	mesh.updateVerticesData(BB.VertexBuffer.PositionKind, positions)
			// 	mesh.setIndices(indices)
			// }

			const color = (new Vec4(this.faceConfig.color)).toArray()
			const r = color[0]
			const g = color[1]
			const b = color[2]
			const a = color[3]

			if (this.activeMeshRefs.face) {
				this.activeMeshRefs.face.material = GeneratePlainColorMaterial( this, r, g, b )
				this.activeMeshRefs.face.visibility = a
			}

			this.$syncFlagsToMeshes( 'Face:syncPointsMesh' )
		}


	}

	immediateDispose() {
		if (this.activeMeshRefs.face) this.activeMeshRefs.face.dispose()
		this.activeMeshRefs = { face: null }
		this.$getLookup().delete(this.uid)
		this.$removeSceneCacheCallback( 'syncFaceTransforms', this )
	}


}