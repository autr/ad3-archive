<script>
	/* ====================================== */
	/*                                        */
	/*         	    SELECTABLE                */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { GUI } from '$gui'

	let {
		item,
		items = [],
		active = false,
		class: classes = '',
		index
	} = $props()


	const isArray = $derived( Array.isArray(assignTo) )
	const isString = $derived( typeof assignTo === 'string' )
	const snippets = [ Camera, Point, Shape, Edge ]
	const snippet = $derived( snippets.find( snip => snip.name === item.object))
	
</script>




{#snippet Camera()}
	<span class="italic">
		{item.object}
	</span>
{/snippet}
{#snippet Point()}
	<span class="italic">
		{item.creator.uid}
	</span>
{/snippet}
{#snippet Edge()}
	<span class="italic">
		{item.creator.uid}
	</span>
{/snippet}
{#snippet Shape()}
	<span class="italic">
		{item.object}
	</span>
{/snippet}

{#if item.inited}

	<div 
		on:click
		class="{classes} selectable-item row-sb-s cptb-1 bb cplr1 pointer">
		<span 
			class:colorswap={active}
			class="fg3 bg3">
		</span>
		<span 
			class="row-fs-c gap-1 name grow bl">
			{#if item.object}
				<span class="fg1">{item.object}</span>
			{:else}
				<span class="red3">None</span>
			{/if}
			{#if item.uid}
				<span class="italic">{item.uid}</span>
			{:else}
				<span class="red3 italic">None</span>
			{/if}
		</span>
		<span class="actions">
			{#if snippet}
				{@render snippet()}
			{/if}
			<!-- {item??.hidden} ? -->
			<!-- {#if value === 'false' || value === false}
				<span class="flex dot-1 red3 colorswap" />
			{:else if value === 'true' || value === true}
				<span class="flex dot-1 green3 colorswap" />
			{:else if value === ''}
				<span class="fg5">N/A</span>
			{:else}
				{value}
			{/if} -->
		</span>
	</div>

{/if}

<style lang="sass">
	.selectable-item 
		user-select: none
		&.none 
			+none
</style>