/* ====================================== */
/*                                        */
/*         	       POINTS                 */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { Vec3 } from '$3d1_points'
import Entity from './_Entity.svelte.js'
import Mesh from './_Mesh.svelte.js'

export default class Points extends Mesh {

	points = $state([])

	// ========== INTERNAL ==========

	constructor( id, debug ) {

		super( id, debug )
		$effect( this.syncPoints.bind(this) )
	}

	syncPoints() {

		const points = []
		for (const value of this.state.points) {
			const target = this.getInstanceTargetOrVec3( value )
			points.push( new Vec3( target.x, target.y, target.z ) )
		}
		// for (const id of Object.keys(this.children)) {

		// 	const child = this.children[id]
		// 	if (child.constructor.name === 'Point') {
		// 		points.push( new Vec3( child.instance.x, child.instance.y, child.instance.z )) 
		// 	} else if (child.constructor.name === 'Mesh') {
		// 		points.push( new Vec3( child.instance.position.x, child.instance.position.y, child.instance.position.z ))
		// 	}
		// }
		if (this.debug) SAY(`💠 ${this.id()} SYNC POINTS`)
		this.points = [ ...points ]
	}

	getTotalLength() {
		let totalLength = 0
		let prev = null
		for (const point of this.points) {
			if (prev) totalLength += prev.distance( point )
			prev = point
		}
		return totalLength
	}


}