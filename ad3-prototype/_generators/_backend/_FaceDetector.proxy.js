/* ====================================== */
/*                                        */
/*         	   FACE DETECTOR              */
/*                                        */
/* ====================================== */

// #define PROXY3D

import { DetectFaces } from './lib.algos.js'

class FaceDetectorThing {

	points = [] // [ uid, ... ]
	edges = [] // [[ uid, uidA, uidB ], ... ]
	debug = false
	faces = new Map()
	callback = null
	data = { set: [], delete: [] }

	$calculateFaces() {

		if (this.calculateRequest) {
			cancelAnimationFrame( this.calculateRequest )
			this.calculateRequest = null
		}

		this.calculateRequest = requestAnimationFrame( () => {

			// const cycles = DetectFaces( points, edges )
			// const uids = []

			// for ( const cycle of cycles ) {
			// 	const uid = 'FaceGen' + cycle.join('')
			// 	if (!this.faces.get(uid)) {
			// 		this.faces.set( uid, cycle )
			// 		this.data.set.push( { uid, cycle } )
			// 	}
			// 	uids.push( uid )
			// }

			// const keys = this.faces.keys()
			// for (const key of keys) {
			// 	if (!uids.includes(key)) {
			// 		this.faces.delete( key )
			// 		this.data.delete.push( key )
			// 	}
			// }

			// if (this.callback && (this.data.set.length || this.data.delete.length) ) this.callback( this.data )
			// this.data = { set: [], delete: [] }
		})

	}

	dispose() {
		SAY('DISPOSE ENGINE')
	}

	setCallback( callback ) {
		this.callback = callback
	}

	setPoint( uid ) {
		if (!this.points.includes(uid)) this.points.push( uid )
		if (this.debug) SAY(`📀 setPoint`, this.points.length, uid)
		this.$calculateFaces()
	}

	deletePoint( uid ) {
		this.points = this.points.filter( u => u !== uid )
		if (this.debug) SAY(`📀 deletePoint`, this.points.length, uid)
		this.$calculateFaces()
	}

	setEdge( uid, uidA, uidB ) {
		const exists = this.edges.find( ([u,a,b]) => {
			return (( a === uidA && b === uidB ) || ( b === uidA && a === uidB )) && u === uid
		})
		if (!exists) this.edges.push([uid,uidA,uidB])
		if (this.debug) SAY(`💽 setEdge`, this.edges.length, uid, uidA, uidB)
		this.$calculateFaces()
	}

	deleteEdge( uid, uidA, uidB ) {
		this.edges = this.edges.filter( ([u,a,b]) => {
			return !( a === uidA && b === uidB ) && !( b === uidA && a === uidB ) && u !== uid
		})
		if (this.debug) SAY(`💽 deleteEdge`, this.edges.length, uid, uidA, uidB)
		this.$calculateFaces()
	}
}


export default class FaceDetector extends Proxy {

	type = 'FaceDetector'

	points = [] // [ uid, ... ]
	edges = [] // [[ uid, uidA, uidB ], ... ]
	debug = false
	faces = new Map()
	callback = null
	data = { set: [], delete: [] }

	setup( data ) {
		return new Promise((resolve,reject) => {
			this.uid = data.uid
			this.debug = data.debug
			// SAY('HAHAHAHAHAH')
		})
	}

	immediateUpdatePoints( edges ) {
		if (this.requestUpdate) cancelAnimationFrame( this.requestUpdate )

		this.edges = edges

		// this.requestUpdate = setTimeout(() => {

			// const cycles = DetectFaces( this.edges, this.$getLookup() )

			// const uids = []

			// SAY(edges.length, points.length, cycles)

			// for ( const cycle of cycles ) {
			// 	const uid = 'FaceGen' + cycle.join('')
			// 	if (!this.faces.get(uid)) {
			// 		this.faces.set( uid, cycle )
			// 		this.data.set.push( { uid, cycle } )
			// 	}
			// 	uids.push( uid )
			// }

			// const keys = this.faces.keys()
			// for (const key of keys) {
			// 	if (!uids.includes(key)) {
			// 		this.faces.delete( key )
			// 		this.data.delete.push( key )
			// 	}
			// }


		// }, 10)
	}

	setFaceDetectorCallback( callback ) {
		this.callback = callback
		// SAY('WOOOOOO')
	}



}