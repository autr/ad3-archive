<script>

	import { GUI } from '$gui'

	// #define COMPONENT

	let {
		uid,
		information = {},
		children
	} = $props()

	const store = getContext('store')
	const lookup = getContext('lookup')

	const item = $derived( lookup.get(uid) )
	const allInformation = $derived({
		...information,
		inited: item?.inited,
	})

	$effect( () => store.guiNodes[uid] = GUISnippet )

</script>

<svelte:options runes={true} />


{#snippet GUISnippet()}
	<div class="gap col-s-s">

		{@render children()}

		{#if item}
			<GUI.Input
				label="debug"
				bind:value={item.debug} />
			<footer class="info row wrap">
				{#each Object.entries(allInformation) as [key, value]}
					<div class="row-sb-c cmb-2 w1--2pc pr1">
						<div>
							{key}
						</div>
						<div class="italic fg4">
							{#if typeof value === 'boolean'}
								<div 
									class="colorswap size-1 radius"
									class:fg1={value}
									class:fg6={!value} />
							{:else}
								{value}
							{/if}
						</div>	
					</div>
				{/each}
			</footer>
		{/if}

	</div>
{/snippet}