/* ====================================== */
/*                                        */
/*         	        TUBE                  */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

import MeshEntityComponent from '../_Mesh.svelte.js'
import { Mesh as MeshBabylon, VertexBuffer, StandardMaterial, VertexData, Color4, Material } from '@babylonjs/core'
import MeshTool from './_MeshTool.svelte.js'

// ------ SCHEMA ------

import FreeString from './_Free.svelte?raw'
import { ExtractSchema } from '$gui_auto/lib.parser.js'
const schema = ExtractSchema( FreeString )

export default class Mesh extends MeshEntityComponent {

	vertices = $state([])
	indices = $state([])
	normals = $state([])
	uvs = $state([])

	constructor(id) {
		super(id)
		this.schema = schema
		this.instance = new MeshBabylon( this.id(), getContext('scene').getInstance() )

		$effect( this.syncVertices.bind(this) )
		$effect( this.syncIndices.bind(this) )
		$effect( this.syncNormals.bind(this) )
		$effect( this.syncUvs.bind(this) )

		$effect( this.setData.bind(this) )
		this.finish()

	}

	setData() {

		this.startTimer('ms')

		const data = new VertexData()
		data.positions = this.vertices
		data.indices = this.indices
		data.normals = this.normals
		data.uvs = this.uvs
		data.applyToMesh(this.instance, true)
		this.instance.computeWorldMatrix(true)

		if (this.debug) SAY(`🥭 DATA`)

		this.stopTimer('ms')
	}


	syncVertices() {
		this.vertices = [ ...this.state.vertices ]
		if (this.debug) SAY('👥 SYNC VERTICES', untrack(() => this.vertices.length))
	}
	syncIndices() {
		const indices = this.state.indices.length > 0 ? this.state.indices : this.createIndices()
		if (this.state.invert) {
		    const neu = []
		    for (let i = 0; i < indices.length; i += 3) {
		        neu.push(indices[i])     // first index remains the same
		        neu.push(indices[i + 2]) // swap second and third indices
		        neu.push(indices[i + 1])
		    }
		    if (this.debug) SAY(`🔗 INDICES: INVERTED`)
		    this.indices = neu
		} else {
		    if (this.debug) SAY(`🔗 INDICES: NORM`)
			this.indices = indices
		}

		if (this.debug) SAY('👥 SYNC INDICES', untrack(() => this.indices.length))
	}
	syncNormals() {
		if (this.state.normals.length > 0) {
			this.normals = this.state.normals
			if (this.debug) SAY('👥 SYNC NORMALS {normals}')
		} else {
			const vertices = this.vertices
			const indices = this.indices
			let normals = []
			VertexData.ComputeNormals(vertices, indices, normals, { useRightHandedSystem: true })
			this.normals = normals
			if (this.debug) SAY('👥 SYNC NORMALS {computed}', untrack(() => this.normals.length))
		}
	}
	syncUvs() {
		if (this.state.uvs.length > 0) {
			this.uvs = this.state.uvs
			if (this.debug) SAY('👥 SYNC UVS {uvs}')
		} else if (this.state.uvs === 'basic' ) {
			this.uvs = this.createBasicUvs()
			if (this.debug) SAY('👥 SYNC UVS {basic}')
		} else if (this.state.uvs === 'spherical' ) {
			this.uvs = this.createSphericalUvs()
			if (this.debug) SAY('👥 SYNC UVS {spherical}')
		} else {
			this.uvs = []
			if (this.debug) SAY('👥 SYNC UVS {none}')
		}
	}

	createIndices() {
		const indices = [] 
		for (let i = 0; i < this.vertices.length/3; i++) indices.push(i)
		return indices
	}

	init() {

		
		SAY(`🟢 FREE`)
	}


}


