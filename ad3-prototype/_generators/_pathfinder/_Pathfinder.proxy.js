/* ====================================== */
/*                                        */
/*         	         DUAL                 */
/*                                        */
/* ====================================== */

// #define PROXY3D

import CPP from '$algos_cpp'

export default class Pathfinder extends Proxy {

	instance = null
	type = 'Pathfinder'

	setup( uid, debug ) {
		this.uid = uid
	}
	setPathfinderCallback( callback ) {
		this.callback = callback
	}

	solvePath( inputEdges, noRepeats = false, trigger = null ) {

		if (this.timeout) clearTimeout( this.timeout )
		this.timeout = setTimeout( () => {

			inputEdges = inputEdges.map( edge => this.$getLookupItem(edge.uid))

			const config = {
				points: {},
				edges: []
			}

			for (const edge of inputEdges) {

				if (edge.flags?.isVisible && edge.pointA && edge.pointB) {

					const foundA = this.$getLookupItem(edge.pointA)
					const foundB = this.$getLookupItem(edge.pointB)

					if (foundA.flags?.isVisible && foundB.flags?.isVisible) {

						config.points[edge.pointA] = true
						config.points[edge.pointB] = true

					}
				}
			}

			config.points = Object.keys( config.points )

			for (const edge of inputEdges) {
				if (edge.flags?.isVisible && edge.pointA && edge.pointB) {

					const foundA = this.$getLookupItem(edge.pointA)
					const foundB = this.$getLookupItem(edge.pointB)

					if (foundA.flags?.isVisible && foundB.flags?.isVisible) {

						const pointA = new Vec3( foundA?.position )
						const pointB = new Vec3( foundB?.position )

						const distance = parseInt(Vec3.Distance(pointA, pointB)*1000)/1000

						const indexA = config.points.indexOf(edge.pointA)
						const indexB = config.points.indexOf(edge.pointB)

						const alreadyExists = config.edges.find( edge => {
							const a = edge[0] === indexA && edge[1] === indexB && edge[2] === distance
							const b = edge[1] === indexA && edge[2] === indexB && edge[2] === distance
							return (a || b)
						})

						if (!alreadyExists) config.edges.push([indexA,indexB,distance])
					}
				}
			}


			SAY('🔵 INPUT EDGES', inputEdges.length)
			SAY('🔵 FILTERED', config.edges.length, config.points.length)

			this.solution = CPP( config.points.length, config.edges.length, config.edges, noRepeats ).then( data => {

				if (!data?.result) return SAY(`🚨 NONE ${err}`)


				const distanceMap = []
				const uidPath = []
				let distanceAddition = 0
				let previousIndex = null
				let counter = 0
				const repeats = []

				let i = 0;
				for (const index of data.result) {
					const uid = config.points[index]

					// ------ DISTANCE ------

					if (previousIndex !== undefined) {
						const foundEdge = config.edges.find( edge => {
							return (edge[0] === index && edge[1] === previousIndex) || (edge[1] === index && edge[0] === previousIndex)
						})

						distanceAddition += foundEdge?.[2] || 0
						counter += 1
					}
					distanceMap.push( distanceAddition )

					// ------ REPEATS -------

					const lastLastUid = config.points[i-2]
					const isRepeat = lastLastUid === uid
					repeats.push( isRepeat )

					if ( isRepeat ) {
						repeats[i-1] = true
						repeats[i-2] = true
					}

					previousIndex = index
					i += 1
				}

				const distanceMapNormalised = distanceMap.map( num => {
					return num / data.totalCost
				})

				const result = {
					path: data.result.map( idx => config.points[idx]),
					distance: data.totalCost,
					distanceMap,
					distanceMapNormalised,
					repeats
				}
				
				SAY('✅ ->', result.path.length, result.distance, { distanceMap, distanceMapNormalised })

				if (this.callback) this.callback(result)
			}).catch( err => {
				SAY(`🚨 UNSOLVED ${err}`)
			})

		}, 10)
	}

}