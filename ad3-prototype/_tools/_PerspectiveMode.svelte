<script>
	/* ====================================== */
	/*                                        */
	/*         	    PERSPECTIVE               */
	/*                                        */
	/* ====================================== */

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { PROJECTIONMODE, ICONS } from './defs.js'

	let {
		refs = $bindable()
	} = $props()



	$effect(() => {
		if (!refs.store.cameraData?.inited || !refs) return
		refs.store.cameraData.orthographic = refs.store.projectionMode === PROJECTIONMODE.ORTHOGRAPHIC
	})

	$effect(() => {
		if (!refs.store.cameraData || !refs) return

		keys.addShortcut('projectionMode', ['o'], e => {
			e.preventDefault()
			e.stopPropagation()
			const values = Object.values(PROJECTIONMODE)
			const idx = values.indexOf(refs.store.projectionMode)
			const index = (idx + 1)%values.length
			refs.store.projectionMode = values[index]
		})

	})

	function toggle() {
		refs.store.projectionMode = refs.store.projectionMode === PROJECTIONMODE.ORTHOGRAPHIC ? PROJECTIONMODE.PERSPECTIVE : PROJECTIONMODE.ORTHOGRAPHIC
	}

</script>

{#if refs && refs.store.cameraData}
	<button class="-highlight" on:click={toggle}>
		<Icon svg={ICONS.PERSPECTIVE} />
	</button>
	<button 
		on:click={() => refs.store.projectionMode = PROJECTIONMODE.ORTHOGRAPHIC }
		class:-active={refs.store.projectionMode===PROJECTIONMODE.ORTHOGRAPHIC}>
		ORTHOGRAPHIC
	</button>
	<button 
		on:click={() => refs.store.projectionMode = PROJECTIONMODE.PERSPECTIVE }
		class:-active={refs.store.projectionMode===PROJECTIONMODE.PERSPECTIVE}>
		PERSPECTIVE
	</button>

{/if}