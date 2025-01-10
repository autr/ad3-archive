<script>

	import { GUI } from '$gui'
	let {
		proxy,
		data,
		children
	} = $props()


</script>

<style lang="sass">
	.inspector
		+gap
		+col( stretch, flex-start )
		+bb
		+ptb($r-1)
</style>

{#if data.inited && data.gui}

	{#snippet label()}
		<span class="row-sb-c grow">
			<span>{proxy.type}</span>
			<span>{proxy.uid}</span>
		</span>
	{/snippet}

	<GUI.Group label={label} show={data.show}>
		{#if children}
			{@render children()}
		{/if}
	</GUI.Group>

{/if}