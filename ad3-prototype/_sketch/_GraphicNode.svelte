<script>

	// #define COMPONENT

	let {
		uid,
		children
	} = $props()

	const store = getContext('store')
	store.svgNodes[uid] = SVGSnippet

</script>

<svelte:options runes={true} />
{#snippet SVGSnippet()}
	{@render children()}
{/snippet}