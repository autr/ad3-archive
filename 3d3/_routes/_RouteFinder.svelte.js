/* ====================================== */
/*                                        */
/*         	   ROUTE-FINDER               */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { Vec2, Vec3, Vec4 } from '$3d1_points'
import Entity from '../_Entity.svelte.js'

// ------ SCHEMA ------

import RouteFinderString from './_RouteFinder.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
const schema = ExtractSchema( RouteFinderString )

export default class RouteFinder extends Entity {

	constructor(id, debug) {
		super(id, debug)
		this.schema = schema

		// $effect( this.updateRoute.bind(this) )
	}

	init() {

	}

	updateRoute() {

		// const env = getContext('environment')
		// console.log(env.library.edges, '???')

		// for (const [id, edge] of Object.entries(env.library.edges)) {
		// 	const point = env.library.points[id]
		// 	console.log(id, edge)
		// }
	}


}


