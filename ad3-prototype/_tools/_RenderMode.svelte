<script>
	/* ====================================== */
	/*                                        */
	/*         	     RENDERMODE               */
	/*                                        */
	/* ====================================== */

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { RENDERMODE, ICONS } from './defs.js'

	let {
		refs = $bindable()
	} = $props()	

	$effect(() => {
		if (!refs) return

		keys.addShortcut('mode', ['r'], e => {
			if (e.metaKey || e.shiftKey || e.ctrlKey) return
			e.preventDefault()
			e.stopPropagation()
			const values = Object.values(RENDERMODE)
			const idx = values.indexOf(refs.store.renderMode)
			const index = (idx + 1)%values.length
			refs.store.renderMode = values[index]
		})

	})

	function toggle() {
		refs.store.renderMode = refs.store.renderMode === RENDERMODE.GPU ? RENDERMODE.SVG : RENDERMODE.GPU
	}
</script>

{#if refs}
	<button class="-highlight" on:click={toggle}>
		{#if refs.store.renderMode === RENDERMODE.GPU}
			<Icon svg={ICONS.GPU} />
		{:else}
			<Icon svg={ICONS.SVG} />
		{/if}
	</button>
	<button 
		on:click={() => refs.store.renderMode = RENDERMODE.GPU }
		class:-active={refs.store.renderMode===RENDERMODE.GPU}>
		GPU
	</button>
	<button 
		on:click={() => refs.store.renderMode = RENDERMODE.SVG }
		class:-active={refs.store.renderMode===RENDERMODE.SVG}>
		SVG
	</button>
{/if}