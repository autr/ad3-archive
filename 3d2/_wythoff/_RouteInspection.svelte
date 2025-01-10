<script>

	/* ====================================== */
	/*                                        */
	/*             ROUTE INSPECTION           */
	/*                                        */
	/* ====================================== */

	import ChinesePostmanProblem from 'chinese-postman-problem'
	import Sphere from '$3d1_meshes/_Sphere.svelte'
	import CylinderFromPoints from '$3d1_meshes/_CylinderFromPoints.svelte'

	// #define COMPONENT
	// #define AUI

	export let interpolate = 0
	export let points = []
	export let edges = []
	export let gui = false

	const context = getContext('sketch')
	const COLORS = context.getColors()

	export let sphereDiameter = 0.08
	export let cylinderDiameter = 0.01

	let solution = {}
	export async function getChinesePostmanSolution() {

		// SAY('INTERPOLATE')

		if (interpolate <= 0) return


		if (points.length <= 0 || edges <=0) return 
		const pointIds = points.map( item => item.id )
		let pointRef = {}
		const connections = edges.map( ({idA, idB, distance}) => {
			const idxA = pointIds.indexOf(idA)
			const idxB = pointIds.indexOf(idB)
			pointRef[idxA] = true
			pointRef[idxB] = true
			distance = Number(distance)
			return [ idxA, idxB, distance ]
		})
		const pointsLength = Object.keys(pointRef).length
		const { result, totalCost } = await ChinesePostmanProblem( pointsLength, connections.length, connections )
		const resultsLength = result.length 
		const pointsList = result.map( idx => {
			return points.find( item => {
				return item.id === pointIds[idx]
			})
		})
		const position = interpolate * (result.length-1)

		const toIdx = Math.ceil( position )
		const fromIdx = Math.floor( position )
		const modulus = position%1

		const fromPoint = new BB.Vector3( ...Object.values( pointsList[fromIdx ].xyz) )
		let toPoint = new BB.Vector3( ...Object.values( pointsList[toIdx ].xyz) )
		toPoint = BB.Vector3.Lerp(fromPoint, toPoint, modulus)

		solution = {
			pointsLength,
			pointsList,
			fromIdx,
			fromPoint,
			toIdx,
			toPoint,
			connectionsLength: connections.length,
			resultsLength,
			totalCost,
			position,
			modulus
		}
	}


	$: getChinesePostmanSolution( interpolate, points, edges )
	if (browser) window.getChinesePostmanSolution = getChinesePostmanSolution

</script>


<div class="abs l2 t2 minw12em">

	<span>Route Inspection</span>
	<AUI.Slider bind:value={interpolate} set:step={0.0001} />
</div>
{#if gui}

	<h3>Route Inspection</h3>
	<span>Interpolate</span>
	<AUI.Slider bind:value={interpolate} set:step={0.0001} />

{/if}

<!-- SPHERES -->

{#each solution.pointsList || [] as point, idx}

	{#if idx < solution.position - 1}
		<Sphere 
			name={('ChineseSphere' + point.id)}
			diameter={sphereDiameter + 0.02}
			material={COLORS.GREEN}
			data={{...point}}
			position={point.xyz} />

		<CylinderFromPoints 
			diameter={cylinderDiameter + 0.001}
			name={('ChineseEdge' + point.id)}
			material={COLORS.GREEN}
			pointA={point.xyz}
			pointB={solution.pointsList[idx+1].xyz} />
	{/if}
{/each}

{#if solution.position > 0}
	<Sphere 
		name={('ChineseModulusSphere')}
		diameter={sphereDiameter + 0.001}
		material={COLORS.YELLOW}
		position={solution.toPoint} />
	<CylinderFromPoints 
		diameter={cylinderDiameter + 0.001}
		name={('ChineseModulusCylinder')}
		material={COLORS.GREEN}
		pointA={solution.fromPoint}
		pointB={solution.toPoint} />
{/if}
