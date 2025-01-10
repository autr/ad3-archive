<script>
	/* ====================================== */
	/*                                        */
	/*         	        TOOLS                 */
	/*                                        */
	/* ====================================== */

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { MapRange } from '$root/lib.utils.js'

	import RenderMode from './_RenderMode.svelte'
	import PerspectiveMode from './_PerspectiveMode.svelte'
	import SVGExport from './_SVGExport.svelte'
	import ToolPicker from './_ToolPicker.svelte'
	import SelectorTools from './_SelectorTools.svelte'
	import SnappingMode from './_SnappingMode.svelte'
	import CreateTools from './_CreateTools.svelte'
	import DefaultMaterial from './_DefaultMaterial.svelte'

	import { Overlay } from '$global_app'

	import { ALLTOOLS } from './defs.js'

	// #define COMPONENT

	let { 
		debug = false,
		refs = $bindable()
	} = $props()


</script>

{#snippet tl()}
	<ToolPicker {debug} bind:refs={refs} />
{/snippet}
{#snippet tr()}
	<div class="col-fe-fs gap1">
		<div class="row-fe-c gap1">
			<RenderMode {debug} bind:refs={refs} />
		</div>
		<div class="col gap1">
			<SVGExport {debug} bind:refs={refs} />
		</div>
	</div>
{/snippet}
{#snippet bl()}
	<SnappingMode {debug} bind:refs={refs} />
{/snippet}
{#snippet br()}
	<div class="col-fe-fe gap1">
		<div class="row gap1">
			<DefaultMaterial {debug} bind:refs={refs} />
		</div>
		<div class="row gap1">
			<PerspectiveMode {debug} bind:refs={refs} />
		</div>
	</div>
{/snippet}

{#if refs}

	<svg 
		bind:this={refs.elements.svgOverlay}
		class="svg-overlay">
		<SelectorTools {debug} bind:refs={refs} />
	</svg>

	<CreateTools {debug} bind:refs={refs} />
	<Overlay class="p1 tools" {tl} {tr} {bl} {br} />

{/if}

<style lang="sass" global>


	.tools
		+row(center,center)
		button
			+pointer
			color: var(--fg5)
			svg *
				stroke: var(--fg5)
			&:hover 
				color: var(--fg3)
				svg *
					stroke: var(--fg3)

			&.-active, &.-selected, &.-highlight
				color: var(--fg1)
				svg *
					stroke: var(--fg1)
			&.-active, &.-selected
				+bb
	.svg-overlay
		+fill
		z-index: 1
		.selector
			stroke-dasharray: calc( var(--border) * 4 )
			fill: transparent
			stroke-width: var(--border)
</style>