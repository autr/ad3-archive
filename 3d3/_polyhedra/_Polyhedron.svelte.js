/* ====================================== */
/*                                        */
/*         	     POLYHEDRON               */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import { Vec2, Vec3, Vec4 } from '$3d1_points'
import Entity from '../_Entity.svelte.js'

// ------ SCHEMA ------

import PolyhedronString from './_Polyhedron.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
import PostprocessWythoff from './_generator/lib.postprocess.js'
import Wythoff from './_generator/lib.wythoff.js'

const schema = ExtractSchema( PolyhedronString )

import presets from '$3d1_polyhedra_presets'

export default class Polyhedron extends Entity {


	points = $state.raw([])
	mesh = $state.raw({})
	edges = $state.raw([])

	presets = presets

	constructor(id, debug) {

		super(id, debug)
		if (debug) SAY(`🥦 INIT`)
			
		this.schema = schema


		this.instance = new Worker()
		this.instance.onmessage = this.onMessage.bind(this)

		$effect( () => this.syncPolyhedron() )

		const env = getContext('env')
		if (!env.libs.has('polypresets')) env.libs.set('polypresets', presets)
		if (debug) SAY(`🦚 POLYHEDRON`)

	}

	onMessage( {data} ) {

		const { 
			vertexarray,
			uvarray,
			indicesarray,
			vertices,
			edges } = data

		this.edges = [ ...edges ]
		this.points = [ ...vertices ] // HACK
		this.mesh = {
			vertices: [...vertexarray],
			uvs: [...uvarray],
			indices: [...indicesarray]
		}
		this.timer.stop()
		// this.timer.say()

	}

	syncPolyhedron() {
		this.timer.start()


		if (this.state.worker) {

			this.instance.postMessage({
				state: {
					frequency: ( this.state.frequency ),
					explode: ( this.state.explode ),
					debug: ( this.state.debug ),
					schwarz: Vec3.Create(this.state.schwarz).toObject(),
					snub: ( this.state.snub ),
					stellate: ( this.state.stellate )
				},
				id: this.id(),
				debug: this.debug.polyhedron
			})
		} else {
			if (!this.wythoff) this.wythoff = new Wythoff()
			this.wythoff.syncSettings( this.state )
			this.onMessage({data: this.wythoff.generatePolyhedron(this.id(), this.state.debug )})
		}

	}

	init() {

	}


}


