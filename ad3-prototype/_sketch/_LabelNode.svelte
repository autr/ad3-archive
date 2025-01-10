<script>
	/* ====================================== */
	/*                                        */
	/*         	       LABEL                  */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { MapRange } from '$root/lib.utils.js'

	let {
		class: classes,
		style: styles,
		uid,
		lineHeight,
		title = '',
		text = '',
		enabled = false,
		coordinate,
		zIndex = 1
	} = $props()

	const store = getContext('store')
	const canvas = getContext('canvas')

	const EDGE_DIVISOR = 4
	const LIMIT = {
		HORZ: 1.2,
		VERT: 1.2
	}

	// ------ DOM ------

	const canvasSize = $derived({
		width: canvas?.offsetWidth,
		height: canvas?.offsetHeight
	})

	let labelElement = $state(null)

	const labelSize = $derived({
		width: labelElement?.offsetWidth || 0,
		height: labelElement?.offsetHeight || 0
	})

	// ------ LINES ------

	const derivedLines = $derived( [ title, ...text.split('\n') ] )

	// ------ TOTAL HEIGHT ------


	const derivedOffsetY = $derived( derivedLines.length + (lineHeight || store.lineHeight) )

	// ------ EDGES ------

	const edges = $derived({
		x: canvasSize.width/EDGE_DIVISOR,
		y: canvasSize.height/EDGE_DIVISOR,
	})


	const offset = $derived({
		x: MapRange( coordinate.x, 0 + edges.x, canvasSize.width - edges.x, labelSize.width*LIMIT.HORZ, labelSize.width*-LIMIT.HORZ, true ),
		y: MapRange( coordinate.y, 0 + edges.y, canvasSize.height - edges.y, labelSize.height*LIMIT.VERT, labelSize.height*-LIMIT.VERT, true )
	})

	// ------ COORDINATE ------

	const derivedCoord = $derived({
		x: (coordinate.x ? coordinate.x : canvas.offsetWidth/2) - (offset.x * zIndex),
		y: (coordinate.y ? coordinate.y : canvas.offsetHeight/2) - (offset.y * zIndex)
		// x: coordinate.x,
		// y: coordinate.y
	})

	store.markers[uid] = { SVG, DOM }

</script>

<svelte:options runes={true} />


{#if enabled}
	<div
		bind:this={labelElement}
		class="marker {classes}"
		style={styles}
		style:transform="translate({derivedCoord.x}px, {derivedCoord.y}px)">
		<span class="offset">
			<span class="" style:transform="scale({zIndex})">
				{#each derivedLines as line}
					<span 
						style:line-height="{lineHeight || store.lineHeight}em">
						{line}
					</span>
				{/each}
			</span>
		</span>
	</div>
{/if}


<!-- {#snippet SVG()}

	{#if show}
			<g
				class="marker {classes}"
				style={styles}
				transform="translate({derivedCoord.x} {derivedCoord.y}) ">
				<g>
					<text 
						dominant-baseline="middle" 
						text-anchor="middle"
						y="{derivedOffsetY/-2}em">
						{#each derivedLines as line}<tspan
							x="0"
							dy="{lineHeight || store.lineHeight}em">{line}</tspan>{/each}
					</text>
				</g>
			</g>
	{/if}
{/snippet} -->

<style lang="sass">
	.marker
		z-index: 99
		+abs
		left: 0px
		top: 0px
		border: none
		pointer-events: none
		+col
		// opacity: 0
		span 
			+col(center,flex-start)
			text-align: center
		> span
			transform: translate(-50%, -50%)
			+col(center,center)
			+radius
</style>

