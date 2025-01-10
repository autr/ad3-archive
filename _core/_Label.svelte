<script>
	/* ====================================== */
	/*                                        */
	/*         	        LABEL                 */
	/*                                        */
	/* ====================================== */

	import LabelProxy from './_backend/_Label.proxy.js'

	import { MapRange } from '$root/lib.utils.js'
	import { elementToSVG, inlineResources } from 'dom-to-svg'

	// #define COMP3D

	const proxy = Proxification( new LabelProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )

	SetDefaults({
		enabled: false,
		position: [0,0,0],
		direction: [0,1,0],
		offsetTarget: null,
		offsetAmount: 0.5,
		isVisible: true
	})

	let domElement = $state(null)
	const externalPoint = getContext('point')?.uid

	const actualPosition = $derived(externalPoint || Q(data.position))
	$effect( WhenReady.bind(() => proxy.setTransformParent( actualPosition ) ))
	$effect( WhenReady.bind(() => proxy.setOffset( Q(data.offsetTarget), Q(data.offsetAmount) ) ))
	$effect( WhenReady.bind(() => proxy.setFlags({
		isVisible: Q(data.isVisible)
	})))

	let isIniting = false
	let canvasEl = $state(null)
	let svgString = $state(null)

	$effect( () => {

		if (data.inited || isIniting || !canvasEl) return

		isIniting = true

		domElement = document.getElementById( data.uid )

		if (domElement) {

			// SVG

			const svgAST = elementToSVG( domElement )

			const svgRoot = svgAST.querySelector('svg')

			const width = svgRoot.width.baseVal.value
			const height = svgRoot.height.baseVal.value

			svgString = new XMLSerializer().serializeToString(svgAST)

			const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
			const svgUrl = URL.createObjectURL(svgBlob)

			// IMG

			const img = new Image()
			img.width = width 
			img.src = svgUrl

			img.onload = e => {

				const frameSize = 100

				canvasEl.width = img.width + ( frameSize * 2 )
				canvasEl.height = img.height + ( frameSize * 2 )

				const ctx = canvasEl.getContext('2d')
				ctx.drawImage(img, frameSize, frameSize)

				canvasEl.toBlob( blob => {

					const pngUrl = URL.createObjectURL(blob)

					proxy.setup( data.uid, pngUrl, canvasEl.width, canvasEl.height ).then( () => {
						EnableRefs()
						isIniting = false
					})

				})
			}

		}
	})

</script>

<svelte:options runes={true} />


{#if data.inited && children}
	{@render children()}
{/if}

<canvas bind:this={canvasEl} class:none={!data.debug} />

{#if data.debug}
	{@html data.svgString}
{/if}

<!-- {#if enabled}
	<div
		bind:this={domElement}
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
 -->
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

