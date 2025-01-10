<script>

	/* ====================================== */
	/*                                        */
	/*         	     POLYSELECT               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Point, Line } from '$ad3_core'

	let {
		data = $bindable({})
	} = $props()

	SetDefaults({
		isSVG: true,
		enabled: true,
		onUpdate: () => {}
	})

	const store = getContext('store')

	store.polySelectData = data

	const camData = getContext('camera')
	const camProxy = getContext('cameraProxy')
	const controlsData = getContext('controls')
	const eventState = getContext('eventState')

	const selector = $state({
		isDown: false,
		previousControlsState: controlsData.enabled
	})
	
	eventState.onDown( (state, camera, controls, modifiers) => {

		if (!data.enabled || !state.isAirPressed) return

		selectorPoints = []
		selectorPolygon = []
		svgPolyline = []

		selector.isDown = true
		selector.previousControlsState = controlsData.enabled
		controlsData.enabled = false

	})

	eventState.onMove( (state, camera, controls, modifiers) => {

		if (!selector.isDown || !data.enabled) return 

		const pointUid = 'SelectorPoint' + (selectorPoints.length + 1)

		selectorPoints.push( {
			id: pointUid,
			radius: 0.01,
			color: [0.2,0.6,0.2,1],
			position: camData.interact.worldPosition 
		})

		const pos = ([
			camData.interact.canvasPosition[0],
			camData.interact.canvasPosition[1] 
		])

		selectorPolygon.push( pos )
		svgPolyline.push( pos.join(',') )

		selectorLine.points.push( pointUid )

	})

	eventState.onUp( (state, camera, controls, modifiers) => {

		if (!data.enabled) return

		if (selector.isDown) {
			camProxy.immediateFindWithinPolygon( selectorPolygon ).then( found => {
				SAY('🟢 PICKED', found.length)
				if (data.onUpdate) data.onUpdate( found )
			})
		}

		selector.isDown = false
		controlsData.enabled = selector.previousControlsState
		selectorPoints = []
		selectorLine.points = []
		selectorPolygon = []
		svgPolyline = []

	})

	const selectorLine = $state({ points: [] })
	let selectorPoints = $state([])
	let selectorPolygon = $state([])
	let svgPolyline = $state([])

</script>


{#if controlsData?.inited}

	{#if !data.isSVG}

		{#each selectorPoints as point,idx}
			<Point data={point} />
		{/each}

		<Line data={selectorLine} />

	{:else}

		{#if selectorPolygon.length > 1 }

			<svg class="selector-svg">
				<polyline
					class="selector-polyline"
					points={svgPolyline.join(' ')} />
			</svg>

		{/if}

	{/if}
{/if}

<style lang="sass">
	.selector-svg
		pointer-events: none
		+fill
		stroke-dasharray: calc( var(--border) * 4 )
		fill: transparent
		stroke-width: var(--border)
		stroke: var(--fg)
</style>




