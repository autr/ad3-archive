<script>
	/* ====================================== */
	/*                                        */
	/*         	      SVGEXPORT               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { ICONS } from './defs.js'
	import { DownloadSVGElement } from '$ad3_libs/index.js'


	let {
		refs = $bindable()
	} = $props()

	const store = $derived( refs.store )
	const lookup = $derived( refs.lookup )

	function GetDepth( uid ) {
		const item = lookup.get(uid)
		if (store.coordinates[uid]) {
			const z = store.coordinates[uid].z
			return z !== undefined ? z : -99999
		} else if (item?.pointA || item?.pointB) {
			const a = lookup.get(item?.pointA)
			const b = lookup.get(item?.pointB)
			const pointA = a?.position?.z || a?.z
			const pointB = b?.position?.z || b?.z
			if (pointA !== undefined && pointB !== undefined) return Math.min(pointA,pointB)
			if (pointA !== undefined) return pointA - 0.1
			if (pointB !== undefined) return pointB - 0.1
			return -999999
		} else {
			return -999999
		}
	}

	function SortNodes() {
		const updated = {}
		const sorted = Object.entries(store.svgNodes).sort( (a,b) => {
			const az = GetDepth(a[0])
			const bz = GetDepth(b[0])
			return az - bz
		})
		refs.store.svgNodes = { ...Object.fromEntries(sorted) }
	}

	function SortAndDownload() {
		SortNodes()
		requestAnimationFrame(() => {
			DownloadSVGElement(refs.svg)
		})
	}

</script>


{#if refs && refs.store.renderMode === 'svg'}
	<button class="-highligh row-c-c gap" on:click={SortNodes}>
		<Icon svg={ICONS.SORT_SVG} />
		SORT
	</button>
	<button class="-highligh row-c-c gap" on:click={SortAndDownload}>
		<Icon svg={ICONS.EXPORT_SVG} />
		SAVE
	</button>
{/if}