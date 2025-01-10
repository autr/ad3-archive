

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
