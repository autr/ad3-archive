/* ====================================== */
/*                                        */
/*               TUBE PROXY               */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { GetTubeVertexData, GetTubeConfig } from './lib.tubebuilder.js'

import ProxyMeshes from '../_backend/_Proxy.Meshes.js'

export default class Tube extends ProxyMeshes {

	type = 'Tube'
	activeMeshRefs = { tube: null }

	setup( data ) {

		this.uid = data.uid

		const mesh = new BB.Mesh()
		const mat = this.$createColorMaterial( [1,0,0] )

		mesh.material = mat
		this.activeMeshRefs.tube = mesh
	}
	setMidpointCallback( callback ) {
		this.callback = callback
	}

	updateTube( inputConfig ) {

		// COLOR

		const config = Parse( Stringify( inputConfig ) )
		if (config.color) this.color = config.color

		// WORLD POSITIONS

		const newPath = []
		let lastPosition = null
		for (let i = 0; i < config.path.length; i++) {
			const position = new Vec3( this.$getWorldAbsolutePosition( config.path[i] ) || config.path[i] )
			if (config.interpolateLastPoint < 1 && i === config.path.length - 1) {
				const midPosition = BB.Vector3.Lerp(position, lastPosition, 1-config.interpolateLastPoint)
				if (this.callback) {
					this.callback({
						pointA: ( new Vec3(midPosition)).toArray(),
						pointB: ( new Vec3(lastPosition)).toArray(),
						isVisible: true
					})
				}
				newPath.push( midPosition )
			} else {
				newPath.push( position )
			}
			lastPosition = position
		}

		config.path = newPath

		// RM OLD TUBE


		if (this.activeMeshRefs.tube) this.activeMeshRefs.tube.dispose()

		if (config.path.length < 2) {

			if (this.callback) {
				this.callback({
					pointA: null,
					pointB: null,
					isVisible: false
				})
			}
			return
		}


		this.activeMeshRefs.tube = new BB.CreateTube( this.uid + 'Tube', GetTubeConfig(config), this.$getSceneInstance() )

		if (config.isOnTop) {
			this.activeMeshRefs.tube.renderingGroupId = 1
		}
		this.activeMeshRefs.tube.material = this.$createColorMaterial( config.color || this.color )

	}

}