<script>
	/* ====================================== */
	/*                                        */
	/*         	      POLYHEDRA               */
	/*                                        */
	/* ====================================== */

	import PolyhedraWorker from './worker.polyhedra.js?worker'
	import { polyhedraFactory } from './_PolyhedraFactory.js'
	import { XYZ } from '$ad3_tools_guis/index.js'
	import { Shape } from '$ad3_core'

	import { PRESETS } from '$ad3_generators_polyhedra_presets'

	// #define COMP3D

	const proxy = { type: 'Polyhedra' }
	const polyhedraWorker = new PolyhedraWorker()
	polyhedraWorker.onmessage = OnReceivedWorkerData
	polyhedraWorker.onerror = err => {
		SAY(`❌ ERROR`, err.message, err)
	}

	InitialiseUID()
	EnableRefs()

	// const SIZINGS = ['circumsphere', 'midsphere', 'insphere', 'longestEdge', 'shortestEdge']

	SetDefaults({

		// sizeMode: 'circumsphere', // enum: circumsphere, midsphere, insphere
		// size: 1,

		formula: PRESETS[1].formulas[0], // [2,3,4,0,1,0], // new Vec3( 2, 3, 4).toObject(),
		explode: 0,
		smoothing: 0,
		smoothingResolution: 1000,
		stellate: 0,
		isMidpoints: false,
		isSnub: false,
		initialDelay: 0,
		isCentroid: false,
		onUpdate: () => {}

	})

	const geometryPoints = $state([])
	const geometryEdges = $state([])
	const geometryFaces = $state([])
	let geometryAngles = $state([])
	let geometryRadiuses = $state([])

	setContext('points', geometryPoints)
	setContext('edges', geometryEdges)
	setContext('angles', geometryAngles)
	setContext('radiuses', geometryRadiuses)
	setContext('faces', geometryFaces)
	setContext('node', data.uid )

	let pointsListeners = []
	setContext('addPointsListener', callback => {
		pointsListeners.push( callback )
	})
	let edgesListeners = []
	setContext('addEdgesListener', callback => {
		edgesListeners.push( callback )
	})

	// const MINIMUM = {
	// 	POINTS: 0,
	// 	EDGES: 0
	// }

	function GetSnappedDistance( vecA, vecB = [0,0,0], snapping = 10000 ) {
		return Math.round(Vec3.Distance( new Vec3(vecA), new Vec3(vecB) )*snapping)/snapping
	}

	function GetResolutionValue( value ) {
		const res = untrack( () => data.smoothingResolution )
		return (value*res)/res
	}

	let timestamp = new Date()

	$effect( RequestPolyhedra )

	function RequestPolyhedra() {

		timestamp = new Date()

		const message = {
			formula: Parse( Stringify( data.formula )),
			explode: data.explode,
			stellate: data.stellate,
			isSnub: data.isSnub,
			isCentroid: data.isCentroid
		}

		polyhedraFactory.requestPolyhedra( data.uid, message ).then( OnReceivedWorkerData )
	}

	let isInitialComplete = false

	function SyncEnabledVisiblePickable( item, isEnabled ) {

		if (untrack(() => item.isEnabled ) !== isEnabled) item.isEnabled = isEnabled
		if (untrack(() => item.isVisible ) !== isEnabled) item.isVisible = isEnabled
		if (untrack(() => item.isPickable ) !== isEnabled) item.isPickable = isEnabled
	}

	function ProcessPoints( e ) {

		const pointLength = e.data.points.length
		const maxPointIndex = e.data.points.sort((a,b) => b-a)[0] + 1
		const pointCacheLength = geometryPoints.length 
		const totalLength = Math.max( pointLength, pointCacheLength, maxPointIndex )


		for (let i = 0; i < totalLength; i++) {

			const pointIdx = e.data.points[i]
			const vertex = e.data.vertices[pointIdx]
			const isEnabled = (e.data.points.includes(pointIdx) && vertex ? true : false)
			const uid = data.uid + 'Point' + i

			if (!untrack(() => geometryPoints[i])) {
				geometryPoints[i] = { position: [0,0,0], tags: ['polyhedra'] }
				geometryPoints[i].id = uid
				geometryPoints[i].debug = false
			}
			SyncEnabledVisiblePickable( geometryPoints[i], false )
		}


		// SAY(`🔵 POINTS TALLIES`, geometryPoints.length, geometryPoints)

		let initNodeSpheres = {}

		let pointIterate = 0
		for (const pointIdx of e.data.points) {

			const vertex = e.data.vertices[pointIdx]
			const isEnabled = (e.data.points.includes(pointIdx) && vertex ? true : false)

			if (isEnabled) {
				geometryPoints[pointIdx].position[0] = vertex.x
				geometryPoints[pointIdx].position[1] = vertex.y
				geometryPoints[pointIdx].position[2] = vertex.z
				geometryPoints[pointIdx].name = 'Node ' + pointIterate + '/' + e.data.points.length

				const distance = GetSnappedDistance( vertex )

				if (!initNodeSpheres[distance]) initNodeSpheres[distance] = []
				initNodeSpheres[distance].push(geometryPoints[pointIdx].id)
				pointIterate += 1
			}
			SyncEnabledVisiblePickable( geometryPoints[pointIdx], isEnabled )
		}

		if (initNodeSpheres[0]) delete initNodeSpheres[0]

		const nodeSpheres = Object.keys( initNodeSpheres ).map( (radius,index) => {
			const points = initNodeSpheres[radius]
			return {
				radius,
				points,
				type: 'Circumsphere',
				id: data.uid + 'Circumsphere' + index
			}
		})


		return nodeSpheres

	}


	function ProcessFaces( e ) {




		const faceLength = e.data.faces.length
		const faceCacheLength = geometryFaces.length 
		const totalLength = Math.max( faceLength, faceCacheLength )

		const initFaceSpheres = {}

		for (let i = 0; i < totalLength; i++) {

			const face = e.data.faces[i]


			if (!untrack(()=>geometryFaces[i])) geometryFaces[i] = { 
				id: data.uid + 'Face' + i, 
				tags: []
			}

			let isEnabled = face ? true : false
			if (face) {

				const pointUids = []
				const pointPositions = []

				for (let i = 0; i < face.points.length; i++) {
					const gp = geometryPoints[face.points[i]]
					if (gp) {
						const pos = new Vec3( ...gp.position )
						pointPositions.push(pos)
						pointUids.push( String(gp.id) )
					}
				}

				const centroid = pointPositions.reduce((acc, point) => {
					return acc.add(point)
				}, new BB.Vector3(0, 0, 0)).scale(1 / pointPositions.length)

				const distance = GetSnappedDistance( centroid )
				if (!initFaceSpheres[distance]) initFaceSpheres[distance] = []
				initFaceSpheres[distance].push(centroid)

				// if (data.isMidpoints) {
				// 	geometryPoints.push({
				// 		id: data.uid + 'FaceCenter' + i, 
				// 		position: [ centroid.x, centroid.y, centroid.z ],
				// 		isVisible: true,
				// 		tags: ['face', 'polyhedra']
				// 	})
				// }

				geometryFaces[i].points = [ ...pointUids ]
				geometryFaces[i].isVisible = true
			} else {
				geometryFaces[i].isVisible = false
			}


			// SyncEnabledVisiblePickable( geometryFaces[i], isEnabled )

		}

		// SAY(geometryFaces)

		const faceSpheres = Object.keys( initFaceSpheres ).map( (radius,index) => {
			const points = initFaceSpheres[radius]
			return {
				radius,
				points,
				type: 'Insphere',
				id: data.uid + 'Insphere' + index
			}
		})

		return faceSpheres

	}

	function ProcessEdges( e ) {

		const edgeLength = e.data.edges.length
		const edgeCacheLength = geometryEdges.length 
		const totalLength = Math.max( edgeLength, edgeCacheLength )

		const tally = { enabled: 0, hidden: 0 }

		let initEdgeSpheres = {}

		for (let i = 0; i < totalLength; i++) {

			const edge = e.data.edges[i]

			if (!untrack(()=>geometryEdges[i])) geometryEdges[i] = { 
				id: data.uid + 'Edge' + i, 
				tags: []
			}

			const idxA = edge?.points?.[0]
			const idxB = edge?.points?.[1]

			const pointA = untrack( () => geometryPoints[idxA] )
			const pointB = untrack( () => geometryPoints[idxB] )

			const uidA = pointA?.id
			const uidB = pointB?.id

			const isEnabled = (idxA !== undefined && idxB !== undefined && uidA && uidB && edge) ? true : false

			if (isEnabled) tally.enabled += 1
			if (!isEnabled) tally.hidden += 1

			if (isEnabled) {

				// POSITION

				const pointAPos = new Vec3(...pointA.position)
				const pointBPos = new Vec3(...pointB.position)
				const midPoint = pointAPos.add( pointBPos ).scale(0.5)

				// DISTANCE 

				let distance = BB.Vector3.Distance( pointAPos, pointBPos )
				distance *= 1000
				distance = Math.round( distance ) / 1000

				// POINTS & TAGS

				if (untrack(()=>geometryEdges[i].pointA) !== uidA) geometryEdges[i].pointA = uidA
				if (untrack(()=>geometryEdges[i].pointB) !== uidB) geometryEdges[i].pointB = uidB
				if (untrack(()=>Stringify(geometryEdges[i].tags)) !== Stringify(edge.tags)) {
					geometryEdges[i].tags = ['polyhedra', ...(edge.tags || [])] 
				}

				// DISTANCE & MIDPOINT

				// untrack( () => {
					geometryEdges[i].distance = distance
					const radius = GetSnappedDistance( midPoint )
					if (!initEdgeSpheres[radius]) initEdgeSpheres[radius] = []
					initEdgeSpheres[radius].push( untrack(() => geometryEdges[i].id ) )

				// })
			}

			SyncEnabledVisiblePickable( geometryEdges[i], isEnabled )

			for (const callback of edgesListeners) callback( i, geometryEdges[i] )
		}

		const edgeSpheres = Object.keys( initEdgeSpheres ).map( (radius,index) => {
			const points = initEdgeSpheres[radius]
			return {
				radius,
				points,
				type: 'Intersphere',
				id: data.uid + 'Intersphere' + index
			}
		})

		return edgeSpheres

		// SAY(`🔵 EDGES TALLIES`, tally, geometryEdges.length)
	}

	function OnReceivedWorkerData( e ) {

		const DO_SCALING = true
		const DO_EDGES = true

		// if (data.isCentroid) {
		// 	e.data.vertices.push({ x: 0, y: 0, z: 0 })
		// 	e.data.points.push(e.data.vertices.length-1)
		// 	let i = 0
		// 	for (const point of e.data.points) {
		// 		const newEdge = [ point, e.data.vertices.length-1 ]
		// 		e.data.edges.push( { points: newEdge, tags: ['centroid'] } )
		// 	}
		// 	i += 1
		// }

		const nodeSpheres = ProcessPoints( e ) // aka CIRCUMSPHERE
		const edgeSpheres = ProcessEdges( e ) // aka INTERSPHERES
		const faceSpheres = ProcessFaces( e ) // aka INSPHERE

		geometryRadiuses = [ ...nodeSpheres, ...edgeSpheres, ...faceSpheres ]
		// geometryRadiuses = faceSpheres

		// SAY('------------ RADIUSES', geometryRadiuses)

		if (!isInitialComplete) isInitialComplete = true

		// if (data.debug) SAY( `⏳ ELAPSED`, new Date() - timestamp, 'ms elapsed') 

		if (data.onUpdate) data.onUpdate({
			angles: geometryAngles,
			points: geometryPoints,
			radiuses: geometryRadiuses,
			edges: geometryEdges,
			faces: geometryFaces,
		})
	}


</script>

<svelte:options runes={true} />


{#if children && data.inited}
	{@render children()}
{/if}