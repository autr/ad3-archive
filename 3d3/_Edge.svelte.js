/* ====================================== */
/*                                        */
/*         	        EDGE                  */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import Points from '../_Points.svelte.js'
// import { CreateGreasedLine } from 'babylonjs'
import { Vec3 } from '$3d1_points'

// ------ SCHEMA ------

import EdgeString from './_Edge.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
const schema = ExtractSchema( EdgeString )

export default class Edge extends Points {

	constructor(id, debug) {
		super(id, debug)
		this.schema = schema
	}

	init() {

	}

}


