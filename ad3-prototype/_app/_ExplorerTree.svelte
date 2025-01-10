<script>

	import { GUI } from '$gui'
	import { keys } from '$keys'
	import { Icon } from '$icons'

	let {
		lookup,
		groups,
		state,
		data
	} = $props()


	const ICONS = {
		Engine: 'settings',
		Scene: 'photo', // 
		Camera: 'camera',
		Point: 'point',
		Edge: 'line',
		Face: 'pentagon',
	}

	const LETTERS = {
		M: 'letterm' // lettermsmall
	}

	export function selectObject( item ) {
		if (keys.has(keys.PRIMARY)) {
			state.selected = [ ...state.selected, item.uid ]
		} else {
			state.selected = [ item.uid ]
		}
	}


</script>

<style lang="sass">
	.header
		background: none
		border: none
		+row(flex-start,center)
		+grow
		+pointer
	:global(.gui-group.-selected > .gui-header)
		background: lightblue
	button
		+ptb($r-6)
		+plr($r-2)
	.actions
		+row(flex-end, center)
		button 
			+row(center, center)
			+pointer
			+m(0)
			+p(0)
			+grow
</style>


{#each data as item, idx}
	
	{#snippet label()}
		<button 
			on:click={ () => selectObject(item)}
			class="header">
			<Icon 
				class="h2"
				type={ICONS[item.object]} />
			<span class="ml1">{item.uid}</span>
		</button>
	{/snippet}

	{#snippet actions()}

		<div class="actions">
			<button>
				<Icon class="h1" type="letterm" />
			</button>
			<button>
				<Icon class="h1" type="letters" />
			</button>
		</div>

	{/snippet}

	<GUI.Group 
		class="{state.selected.includes(item.uid)?'-selected':''} {state.hovered.includes(item.uid)?'-hovered':''}"
		arrows={item.children?.length > 0}
		label={label}
		actions={actions}>
		{#if item.children?.length > 0}
			<svelte:self 
				bind:data={item.children}
				bind:lookup={lookup}
				bind:groups={groups}
				bind:state={state} />
		{/if}
	</GUI.Group>

{/each}