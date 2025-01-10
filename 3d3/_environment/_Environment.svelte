<script>
	
	/* ====================================== */
	/*                                        */
	/*         	    ENVIRONMENT               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT
	// #define ENTITY

	import Gui from '$gui_auto/_Gui.svelte'
	import Environment from './_Environment.svelte.js'
	import ObjectTree from './_ObjectTree.svelte'

	let {
		children,
		...props
	} = $props()

	const env = new Environment( props.id, props.debug )
	setContext('env', env)
	setContext('lib', env.lib)

	onDestroy( env.destroy )

	const ANYTHING = {
		type: 'array',
		items: {
			type: 'string',
			oneOf: [ '$all' ]
		}
	}

	schemas.add( env, {
		show: true, 
		selected: ['tube'],
		hovered: [],
		soloed: [],
		muted: []
	}, {
		show: {},
		selected: ANYTHING,
		hovered: ANYTHING,
		soloed: ANYTHING,
		muted: ANYTHING
	})
</script>

<svelte:options runes={true} />

	{#if env.inited}
		<div 
			class="environment {props.class} col hhh1vh"
			style={props.style}>
			<header class="p1 basis0">

				{#if children}
					{@render children()}
				{/if}
			</header>
			{#if env.props.show}
				<div class="p1 overflow-auto" style="max-height: 50vh">
					<ObjectTree object={env} />
				</div>
				<div class="p1 overflow-auto col-fs-fs basis0 grow">
					{#each env.lib.all.entries() || {} as [id, item]}
						<div >
							<Gui 
								label={false}
								id={item.id()}
								bind:value={item.props}
								schema={item.schema} />
						</div>
					{/each}
				</div>
			{/if}
		</div>


	{/if}
