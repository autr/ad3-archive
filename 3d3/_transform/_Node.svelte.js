/* ====================================== */
/*                                        */
/*         	         NODE                 */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { Vec2, Vec3, Vec4 } from '$3d1_points'
import Entity from '../_Entity.svelte.js'
import { TransformNode } from '@babylonjs/core'

// ------ SCHEMA ------

import NodeString from './_Node.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
const schema = ExtractSchema( NodeString )

export default class Node extends Entity {

	constructor(id, debug, props) {
		super(id, debug, props)

		this.schema = schema

		this.startTimer('ms')
		if (this.instance) this.instance.dispose()

		window.node = this.instance = new TransformNode( this.id(), getContext('scene').getInstance() )
		this.stopTimer('ms')
		SAY(`🍏 NODE`)

	}

	init() {

	}


}


