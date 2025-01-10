<script>
	/* ====================================== */
	/*                                        */
	/*         	     RENDERMODE               */
	/*                                        */
	/* ====================================== */

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { ALLTOOLS, ICONS } from './defs.js'

	let {
		refs = $bindable(),
		inited = false
	} = $props()

	const config = $state({
		pointers: {
			tools: [ 
				{
					value: ALLTOOLS.POINTER,
					icon: ICONS.POINTER
				}
			],
			key: 'a',
			index: 0
		},
		selectors: {
			tools: [ 
				{
					value: ALLTOOLS.SELECTOR_LASSO ,
					icon: ICONS.SELECTOR_LASSO
				},
				{
					value: ALLTOOLS.SELECTOR_RECT,
					icon: ICONS.SELECTOR_RECT 
				},
			],
			key: 's',
			index: 0
		},
		creators: {
			tools: [ 
				{
					value: ALLTOOLS.CREATE,
					icon: ICONS.CREATE
				}
			],
			key: 'd',
			index: 0
		}
	})

	const activeTool = $derived( refs ? refs.store.activeTool : null )


	function ToggleTool( id ) {

		if (config[id].tools.map(v=>v.value).includes(activeTool)) {
			config[id].index += 1
			if (config[id].index >= config[id].tools.length) config[id].index = 0
		}
		refs.store.activeTool = config[id].tools[config[id].index].value
	}

	$effect(() => {
		if (!refs || inited) return 

		for (const [id, {tools,key}] of Object.entries(config)) {

			const name = tools.map( v => v.value ).join('/')
			keys.addShortcut(name, [key], e => {
				if (e.ctrlKey || e.metaKey || e.shiftKey) return
				e.preventDefault()
				e.stopPropagation()
				ToggleTool( id )
			})
		}

		inited = true
	})




	$effect(() => {
		if (!refs) return

		// sync to default

		for (const [id, {tools,key,index}] of Object.entries(config)) {
			const idx = tools.map(v=>v.value).indexOf(activeTool)
			if (idx !== -1 && index !== idx) config[id].index = idx
		}

	})

</script>

{#if refs}
	<div class="tools-selector row-fs-fs gap1">
		{#each Object.entries(config) as [id,group]}
			<div class="{id}">
				{#each group.tools as tool, index}
					<button
						title="{tool.value} ({group.key})"
						on:click={() => ToggleTool(id)}
						class:-active={tool.value === refs.store.activeTool}
						class:none={index !== group.index}>
						<Icon 
							class="size3 fg3"
							svg={tool.icon} />
					</button>
				{/each}
			</div>
		{/each}
	</div>
{/if}