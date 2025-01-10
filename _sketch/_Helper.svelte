<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       HELPER                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT


	import * as A from '$ad3_core'
	import * as B from '$ad3_generators'
	import * as C from '$ad3_interactions'

	const Components = { ...A, ...B, ...C }

	let {
		isSketch = false,
		data = $bindable()
	} = $props()

	// ------------------ SET DATA ------------------

	if (!data) data = {}
	setContext('data', data)

	const debug = false 
</script>

<svelte:options runes={true} />

{#snippet RenderChildren()}
	{#each data?.children || [] as item, index}
		{debug ? SAY(`🌚 ${data.object} -> ${index} ->`, item.object) : ''}
		<svelte:self bind:data={data.children[index]}  />
	{/each}
{/snippet}

{#if data}
	{#if Components[data.object]}
		{debug ? SAY(`🔵 ${data.object} ->`, data.inited, data.children?.length) : ''}
		<svelte:component 
			this={Components[data.object]}
			bind:data={data}>
			{#if data.inited}
				{debug ? SAY(`🌚 ${data.object} ->`, data.inited, data.children?.length) : ''}
				{@render RenderChildren()}
			{:else}
				{debug ? SAY(`🟠 ${data.object} ->`, data.inited, data.children?.length) : ''}
			{/if}
		</svelte:component>
	{:else}
		{!isSketch ? SAY(`🔴 No component for ${data.object}`, data) : ''}
		{@render RenderChildren()}
	{/if}

{/if}


<style lang="sass">
</style>
