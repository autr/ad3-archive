<script>
	/* ====================================== */
	/*                                        */
	/*         	     LISTICLE                 */
	/*                                        */
	/* ====================================== */

	import { GUI } from '$gui'

	let {
		items = [],
		refs = $bindable()
	} = $props()

	// #define COMPONENT

	const config = $derived( !refs ? [] : items.map( uid => {
		const data = refs.lookup.get(uid)
		const snippet = refs.store.guiNodes[uid]
		return { uid, data, snippet }
	}))
	
</script>


{#each config as {uid,data,snippet}}

	{#snippet ItemActions()}
		HELLO
	{/snippet}

	<GUI.Group
		show={config.length < 8}
		actions={ItemActions}
		label={uid}>

		{#if snippet}
			{@render snippet()}
		{:else}
			NO GUI
		{/if}
	</GUI.Group>
{/each}