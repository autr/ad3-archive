<script>

	import { GUI } from '$gui'

	let {} = $props()


	let refresh = $state(false)

	$effect( () => {
		refresh = state.selected
		requestAnimationFrame(() => {
			refresh = false
		})
	})


</script>

<style lang="sass">
</style>

<svelte:options runes={true} />

{#if !refresh}

	{#each state.selected as uid, idx}

		{#if store.guiNodes[uid]}
			{@render store.guiNodes[uid]()}
		{/if}

		<!-- {#if lookup[uid]?.data}
		
			{#snippet label()}
				<span class="row-sb-c grow">
					<span>{lookup[uid].data.object}</span>
					<span>{uid}</span>
				</span>
			{/snippet}
			<GUI.Group
				show={lookup[uid].data.show}
				label={label}>


				{#if lookup[uid]?.data?.inited}
					{#each Object.keys(lookup[uid].data) as key, i}
						{#if lookup[uid].data[key]}
							<GUI.Input
								label={key}
								id={key}
								bind:value={lookup[uid].data[key]} />
						{/if}
					{/each}

				{/if}
			</GUI.Group>

		{/if} -->

	{/each}

{/if}