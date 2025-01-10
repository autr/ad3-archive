/* ====================================== */
/*                                        */
/*         	        TUBE                  */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import Points from '../_Points.svelte.js'
import { PATTERNS, ORIENTATION } from './defs.js'
import { GenerateStrokePoints } from './lib.tubular.js'
import { Mesh as MeshBabylon, MeshBuilder, VertexBuffer, VertexData } from '@babylonjs/core'
import MeshTool from './_MeshTool.svelte.js'
import { Vec3 } from '$3d1_points'
import { ConvertOptions, CreateTubeVertexData } from './lib.tubular.js'


// ------ SCHEMA ------

import TubeString from './_Tube.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
const schema = ExtractSchema( TubeString )

export default class Mesh extends Points {

	constructor(id, debug) {
		super(id, debug)
		this.schema = schema


		this.worker = new Worker()
		this.worker.onmessage = this.onMessage.bind(this)

		$effect( this.generateMesh.bind(this) )

		this.instance = new MeshBabylon( this.id(), getContext('scene').getInstance() )
	}

	onMessage(e) {

		const data = new VertexData()
		data.positions = e.data.vertices
		data.indices = e.data.indices
		data.normals = e.data.normals
		data.uvs = e.data.uvs
		// data.applyToMesh(this.instance, this.state.updatable)


		this.instance.updateVerticesData( VertexBuffer.PositionKind, data.positions )
		// this.instance.computeWorldMatrix(true)
	}

	generateMesh() {


		const options = this.getOptions()
		const converted = ConvertOptions(options)

		if (this.state.threaded) {

			this.worker.postMessage({
				id: this.id(),
				debug: this.debug,
				options: options
			})
		} else {

			this.startTimer('ms')
			if (typeof this.state.radius === 'function') {
				converted.radiusFunction = this.state.radius
				converted.radius = 1
				console.log(converted.radiusFunction, '???')
			}
			const data = CreateTubeVertexData( converted )
		    data.applyToMesh(this.instance, this.state.updatable)
		    this.stopTimer('ms')
		}


		if (close) {
			// const vertices = new MeshTool( this.instance, sides )
			// const total = vertices.getTotalPolygons()
			// const points = vertices.getPolygon( 0 )
			// vertices.setPolygon(total - 1, points)
			// vertices.writeToMesh()
		}

		this.finish()
		
		if (this.debug) SAY(`🫛 CREATED TUBE ${this.id()}` )
	}


	getOptions() {

		const radius = this.state.radius / 2
		const corners = this.state.corners
		const sides = this.state.sides
		const cap = this.state.cap

		const roundedEnds = cap.includes('round')
		const closeEnds = cap.includes('close')
		const capEnds = cap.includes('cap')

		const path = GenerateStrokePoints( this.points, radius, corners, closeEnds, roundedEnds, sides ).map( vec => {
			return vec.toObject()
		})

		return {
			path,
			radius,
			tessellation: sides,
			cap: capEnds ? 3 : 0,
			sideOrientation: ORIENTATION[ this.state.faces ],
			radiusFunction: roundedEnds ? 'rounded' : 'none',
			updatable: this.state.updatable
		}
	}

	init() {

	}


}


