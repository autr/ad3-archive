<script>
	/* ====================================== */
	/*                                        */
	/*         	       MATERIAL               */
	/*                                        */
	/* ====================================== */

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { PROJECTIONMODE, ICONS, MATERIALS } from './defs.js'

	let {
		refs = $bindable()
	} = $props()


	const defaultMaterialType = $derived( refs.store.defaultMaterialType )
	$effect(() => {

	})

	function iterate() {

	}
</script>

{#if refs}
	<button class="-highlight" on:click={iterate}>
		<Icon svg={ICONS.MATERIAL} />
	</button>

	{#each Object.entries(MATERIALS) as [id,value]}
		<button
			on:click={() => refs.store.defaultMaterialType = value}
			class:-selected={defaultMaterialType === value}>
			{id}
		</button>
	{/each}

{/if}