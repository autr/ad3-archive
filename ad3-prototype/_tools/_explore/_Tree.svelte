<script>
	import { Icon } from '$icons'
	import { icons } from '$ad3_libs'
	let {
		uid = '',
		children = {},
		filters = null,
		refs = $bindable(),
		chain = [],
		parent = null,
	} = $props()

	const item = $derived( refs.lookup.get(uid) )
	const icon = $derived( open ? icons.chevrondown : icons.chevronright )
	let open = $state( true )
	const hasChildren = $derived(Object.keys(children).length > 0)

	let inited = false
	$effect(() => {
		if (!inited) {
			open = item.object !== 'Point' && item.object !== 'Edge'
			inited = true
		}
	})


	function onSelect( e) {

		if ((item && (e.metaKey || e.shiftKey))) {
			refs.store.selected.push( item.uid )
		} else if (item) {
			refs.store.selected = refs.store.selected[0] === item.uid ? [] : [ item.uid ]
		} else {
			refs.store.selected = []
		}
		e.preventDefault()
		e.stopPropagation()
	}

	const style = $derived( isSelected ? 'filter: invert(1) hue-rotate(180deg)' : '' )
	const isSelected = $derived( refs.store.selected.includes(uid) )
	const renderItem = $derived( !filters || (filters && filters.indexOf(uid) !== -1) )
</script>


{#if item}
	{#if renderItem}
		<div 
			style={style}
			class:bb={!parent}
			class="ptb-2 bg3">
			<header 

				class="row-fs-c gap-1 colorswap">
				<div 
					class="row-fs-c pl-1">

					<div class="row-fs-c">
						{#each [ ...chain ].reverse() as uid}
							<button 
								title={uid}
								on:click={ () => refs.store.selected = [ uid ] }
								class="p-2 pointer nub">
								<div class="size-2 fg4 colorswap radius" />
							</button> 
						{/each}
					</div>
					{#if hasChildren}
						<button
							class="pointer p-2"
							on:click={() => open = !open}>
							<Icon 
								class="fg3 size1"
								svg={icon} />
						</button>
					{:else}
						<div class="size-1" />
					{/if}
				</div>
				<button 
					on:click={onSelect}
					class="grow pointer text-left">
					<span class="fg1">{item.object}</span>
					<span class="italic fg3">{uid}</span>
				</button>
			</header>
		</div>
	{/if}

	{#if hasChildren}
		<div 
			class:none={!open && renderItem}
			class="children">

			{#each Object.entries(children) as [recurUid, recurChildren]}
				<svelte:self 
					uid={recurUid} 
					filters={filters}
					children={recurChildren} 
					chain={[uid,...chain]}
					parent={uid}
					bind:refs={refs} />
			{/each}
		</div>
	{/if}
{/if}

<style lang="sass">

	.nub:hover 
		div
			+bg(var(--fg3))
</style>