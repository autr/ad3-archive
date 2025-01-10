
import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)

import { Vec3 } from '$3d1_points'

Number.prototype.roundTo = function(places) {
    let factor = Math.pow(10, places);
    return Math.round(this * factor) / factor;
}


export default function( pre, debug = false ) {

	const post = {}

	// ------ VERTICES ------

	post.vertices = [ 
		...pre.vertices, 
		{ x: 0, y: 0, z: 0, center: true }
	]

	post.statistics = {
		edges: {},
		points: {},
		faces: {}
	}

	// ------ EDGES ------

	post.edges = []
	const initEdges =  ([ ...pre.edges ]) // TODO CONNECTIONS! ([ ...data.edges, ...connections ])
	
	let initPoints = {}
	let initConnections = {}

	initEdges.forEach( ([idA,idB],idx) => {

		const ogidA = idA
		const ogidB = idB

		const pointA = typeof idA == 'string' ? JSON.parse(idA) : pre.vertices[idA]
		const pointB = typeof idB == 'string' ? JSON.parse(idB) : pre.vertices[idB]

		// convert XYZ to key

		idA = typeof idA == 'string' ? idA : JSON.stringify(pointA)
		idB = typeof idB == 'string' ? idB : JSON.stringify(pointB)

		if (idA == idB) SAY(`❌ same idA and idB`)

		// set init points to XYZ key and XYZ value

		initPoints[idA] = pointA
		initPoints[idB] = pointB

		// due diligence

		const id = `${idA}<->${idB}`
		const distance = CalculateDistanceBetweenPoints( pointA, pointB ).toFixed(2)

		if (!post.statistics.edges[distance]) post.statistics.edges[distance] = 0
		post.statistics.edges[distance] += 1

		const item = {
			id,
			name: id,
			idA,
			idB,
			ogidA,
			ogidB,
			distance,
			type: 'edge'
		}

		const connectionKey = `${idA}+${id}`
		initConnections[connectionKey] = {
			sphere: idA,
			cylinder: id
		}
		post.edges.push( item )
	})

	const uniqueEdges = []
	post.edges = post.edges.filter( edge => {
		const exists = uniqueEdges.find( ({idA, idB}) => {
			return (edge.idA == idA && edge.idB == idB) || (edge.idA == idB && edge.idB == idA)
		})
		if (!exists) uniqueEdges.push( edge )
		return !exists 
	})

	// ------ POINTS ------

	post.points = []
	post.totalCylinders = 0

	for (const [id,xyz] of Object.entries(initPoints)) {
		const item = {
			id,
			name: id,
			edges: post.edges.filter( edge => {
				return edge.idA === id || edge.idB === id
			}),
			xyz,
			type: 'point'
		}
		const plug = post.edges.filter( edge => {
			return edge.idA === id || edge.idB === id
		}).length
		if (!post.statistics.points[plug]) post.statistics.points[plug] = 0
		post.statistics.points[plug] += 1
		post.points.push(item)
		post.totalCylinders += item.edges.length
	}

	// ------ FACES ------

	post.faces = []

	for (const face of pre.faces) {
		const item = face.map( id => {
			const point = pre.vertices[id]
			return JSON.stringify(point)
		})
		post.faces.push(item)
		const polygon = item.length 
		if (!post.statistics.faces[polygon]) post.statistics.faces[polygon] = 0
		post.statistics.faces[polygon] += 1
	}

	for (const [name, group] of Object.entries(post.statistics)) {
		for (const [key, num] of Object.entries( group )) {
			const id = `${name}Total`
			if (!post.statistics[id]) post.statistics[id] = 0
			post.statistics[id] += num
		}
	}

	// ------ ANGLES ------

	const angles = CalculateAnglesBetweenEdges( post.points, post.edges )
	let anglesRef = {}
	for (const angle of angles ) {
		if (!anglesRef[angle.degree]) anglesRef[angle.degree] = 0
		anglesRef[angle.degree] += 1
	}
	post.angles = { ...anglesRef }


	// ------ FINISH ------

	if (debug) SAY('🏺 ---> update!')

	// TODO !!! if (onUpdate) onUpdate( data )

	// TODO previousSettings = settingsStr

	return post

}



export function CalculateDistanceBetweenPoints(point1, point2) {
	const dx = point2.x - point1.x
	const dy = point2.y - point1.y
	const dz = point2.z - point1.z
	return Math.sqrt(dx * dx + dy * dy + dz * dz)
}

export function CalculateAnglesBetweenEdges(points, edges) {
	let angles = []

	function expandPoint(id) {
		return new Vec3( ...Object.values( JSON.parse(id) ) )
	}

	// avoid redundant comparisons

	for (let i = 0; i < edges.length; i++) {
		for (let j = i + 1; j < edges.length; j++) {


			let commonPointId = edges[i].idA === edges[j].idA || edges[i].idA === edges[j].idB ? edges[i].idA :
								edges[i].idB === edges[j].idA || edges[i].idB === edges[j].idB ? edges[i].idB : 
								null

			if (commonPointId !== null) {

				let pointA = expandPoint(edges[i].idA === commonPointId ? edges[i].idB : edges[i].idA)
				let pointB = expandPoint(commonPointId)
				let pointC = expandPoint(edges[j].idA === commonPointId ? edges[j].idB : edges[j].idA)

				let vectorBA = pointA.subtract(pointB)
				let vectorBC = pointC.subtract(pointB)

				vectorBA.normalize()
				vectorBC.normalize()

				let degree = Math.acos(Vec3.Dot(vectorBA, vectorBC))

				degree = (degree * (180 / Math.PI)).roundTo(2)

				angles.push({ degree, points: [pointA, pointB, pointC] })
			}
		}
	}

	return angles
}


export function MaxwellsRigidityCriterion( numConnectors ) {
	return 3 * numConnectors - 6
}
