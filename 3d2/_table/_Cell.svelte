<script>
	import * as Views from '../_views'
	import Sketch from '$3d'
	import Polyhedron from '$3d2'
	import { _statistics } from './store.js'
	import { CHAR_TO_POLYGON_NAME, CHAR_TO_NUM, NUM_TO_CHAR } from '$3d2'

	export let type 			// [string] 			receives 'thead' or 'tbody'
	export let rowIdx 			// [integer] 			index of row
	export let colIdx 			// [integer]			index of column
	export let key 				// [string]				aka thead_data[colIdx]
	export let entry 			// [object]				aka tbody_data[rowIdx]
	export let value			// [anything]			the value for the cell
	export let data 			// [anything]			misc data passed to ResizeableTable

	let initCanvas = false
	setTimeout( () => {
		initCanvas = true
	}, colIdx * 1000)


	// $: angles = entry?.settings?.angles || []
	$: interpolate = entry?.settings?.interpolate || []


	$: preset = entry

	$: stats = entry?.stats || {}


	const titles = {
		solid: {
			title: 'Shape',
			desc: 'Render'
		},
		names: {
			title: 'Names',
			desc: 'Category'
		},
		formula: {
			title: 'Symbol',
			desc: 'Whythoff Formula & Interpolation (x,y,z)'
		},
		duals: {
			title: 'Duals',
			desc: 'Dual of Polyhedron'
		},
		faces: {
			title: 'Faces',
			desc: 'Number of Polygons'
		},
		points: {
			title: 'Points',
			desc: 'Number of Connections'
		},
		edges: {
			title: 'Edges',
			desc: 'Numbers of Lengths (%)'
		},
		tensegrity: {
			title: 'Rigidity',
			desc: 'Additional Edges by Maxwell Criterion'
		}
	}

	let canvas = null
</script>


{#if type == 'thead'}
	<span class="flex ptb1 plr1 column cmb0-5">
		<span class="bright f2">{titles?.[key]?.title}</span>
		<span class="dark italic">{titles?.[key]?.desc}</span>
	</span>
{:else if type == 'tbody'}

	<!-- ------ POLHEDRON ------  -->

	{#if key == 'solid'}

		<span class="flex row-center-center">
			<span class="flex rel rel">
				<!-- {#if initCanvas} -->
					<Sketch 
						debug={false}
						{canvas}>
						<Polyhedron 
							bind:this={$_statistics[entry.id]}
							gui={false}
							onUpdate={ ({statistics}) => $_statistics[entry.id] = statistics }
							preset={entry}
							cylinderDiameter={0.06}
							sphereDiameter={0.12}
							autoRotateSpeed={2}
							usePhysics={false}
							showCenter={false}
							showMesh={true}
							debug={false} />
					</Sketch>
					<canvas class="w8em h8em" bind:this={canvas} />
				<!-- {/if} -->
			</span>
		</span>
	{:else}

	<span 
		class:sticky={key == 'solid'}
		class="flex column-stretch-center grow ptb1 plr1 l0 ">

		<!-- ------ NAMES ------ -->

		{#if key == 'names'}
			<span class="flex column w100pc">
				<Views.Names class="f2" value={entry.names} />
				<span class="capitalize italic darken mt0-2">{entry.group}</span>
			</span>


		<!-- ------ FORMULA ------ -->

		{:else if key == 'formula'}

			<span class="flex cmr0-5">
				<Views.Formula value={entry} />
			</span>

		<!-- ------ STATISTICS ------ -->

		{:else if key == 'faces'}
			<span class="flex column">
				{#if $_statistics[entry.id]}
					<div class="flex row wrap cml1 cmtb0-5">
						<Views.Statistics data={$_statistics[entry.id].faces} />
					</div>
				{/if}
			</span>
		{:else if key == 'points'}
			<span class="flex column">
				{#if $_statistics[entry.id]}
					<div class="flex row wrap cml1 cmtb0-5 ">
						<Views.Statistics data={$_statistics[entry.id].points} inset={0.2} />
					</div>
				{/if}
			</span>
		{:else if key == 'edges'}
			<span class="flex column">
				{#if $_statistics[entry.id]}
					<div class="flex row wrap cml1 cmtb0-5">
						<Views.Statistics data={$_statistics[entry.id].edges} value={2} showLength={true} />
					</div>
				{/if}
			</span>

		<!-- ------ RIGIDITY ------ -->

		{:else if key == 'tensegrity'}
			<span>
				{#if $_statistics[entry.id]}
					<Views.Rigidity 
						pointsTotal={$_statistics[entry.id].pointsTotal}
						edgesTotal={$_statistics[entry.id].edgesTotal} />
				{/if}
			</span>

		{:else}
			{key}
		{/if}
	</span>

	{/if}
{/if}