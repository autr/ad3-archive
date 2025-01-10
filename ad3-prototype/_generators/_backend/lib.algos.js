import { PlanarFaceTree } from './lib.planarfacediscovery.js'
import { analyzeGraph as AnalyzeGraph } from 'graph-cycles'

// #define JAVASCRIPT

const solver = new PlanarFaceTree()

export function DetectFaces( edgeUids, lookup ) {

	const { result, graph } = CycleDetectionDFS(edgeUids, lookup)
	SAY( result, graph )
	// SAY( GraphCycles(edgeUids, lookup) )
}


export function CycleDetectionDFS(edgeUids, lookup) {
    const graph = {}

    const points = []
    const edges = []

    for (const edgeUid of edgeUids) {
        const edge = lookup.get(edgeUid)
        const { pointA, pointB } = edge

        if (pointA && pointB && edge.isPickable && edge.isVisible && edge.isEnabled) {
            if (!points.includes(pointA)) points.push(pointA)
            if (!points.includes(pointB)) points.push(pointB)

            edges.push([ edge.uid, pointA, pointB ])
        }
    }


    points.forEach(uid => graph[uid] = [])

    edges.forEach(([_, pointAUid, pointBUid]) => {
        graph[pointAUid].push(pointBUid)
        graph[pointBUid].push(pointAUid)
    })

	const cycles = []

	function DFS(current, previous, visited = [], stack = []) {

		if (stack[0] === 'FINISH') return

		for (const next of graph[current]) {

			const nextIsPrevious = previous === next
			const nextIsCurrent = current === next
			const isLoop = next === stack[0] && !nextIsPrevious && !nextIsCurrent

			if (nextIsCurrent) continue
			if (nextIsPrevious) continue

			if (isLoop) {
				stack.push(current)
				cycles.push([...stack])
				stack[0] = 'FINISH'
				break
			}

			const isCrossConnection = edges.find( ([uid, a, b]) => {
				const isCrossA = next === a && stack.includes(b)
				const isCrossB = next === b && stack.includes(a)
				return isCrossA && isCrossB
			})

			const isVisited = visited.includes( next )
			const hasVisitedAll = visited.length === points.length

			if (!isCrossConnection && !hasVisitedAll && !nextIsPrevious && !nextIsCurrent && !isVisited) {
				visited.push(current)
				stack.push(current)
				const str = stack.join('')
				const alreadyExists = cycles.find( cycle => str.includes( cycle.join('') ) )
				if (!alreadyExists) DFS(next, current, [ ...visited ], [ ...stack ])
			}

		}
	}


	for (const node of Object.keys(graph)) DFS(node)

	const test = cycles.filter( cycle => cycle.length === 4)
	SAY(test, '????')

    return { graph, result: cycles }
}

export function GraphCycles( edgeUids, lookup ) {

	let graph = {}

    for (const edgeUid of edgeUids) {
        const edge = lookup.get(edgeUid)
        const { pointA, pointB } = edge

        if (pointA && pointB && edge.isPickable && edge.isVisible && edge.isEnabled) {
            if (!graph[pointA]) graph[pointA] = []
            if (!graph[pointB]) graph[pointB] = []

            graph[pointA].push(pointB)
            graph[pointB].push(pointA)

        }
    }

    graph = Object.entries(graph)

    return { graph, result: AnalyzeGraph(graph) }
}



export function PlanarFaceTreeDetection( edgeUids, lookup) {

	let points = []
	const edges = []

	for (const edgeUid of edgeUids) {

		const edge = lookup.get(edgeUid)
		const { pointA, pointB } = edge

		if (pointA && pointB && edge.isPickable && edge.isVisible && edge.isEnabled) {

			if (!points.includes(pointA)) points.push(pointA)
			if (!points.includes(pointB)) points.push(pointB)

			edges.push([ points.indexOf(pointA), points.indexOf(pointB) ])
		}
	}

	if (edges.length === 0 || points.length === 0) return {}

	points = points.map( (uid, idx) => {
		return [ idx, idx ]
	})

	const result = solver.discover( points, edges )

	return { points, edges, result }


}
