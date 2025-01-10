<script>
	
	/* ====================================== */
	/*                                        */
	/*         	     WORKSPACE                */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { GUI } from '$gui'
	import TreeView from './_views/_TreeView.svelte'

	// import { Vec3 } from '$3d1_points'
	// import Object from '../_engine/_Object.svelte.js'
	// import CameraString from './_Camera.svelte?raw'
	// import { GUI } from '$gui'


	let {
		children,
		explorer,
		custom,
		...props
	} = $props()

	class Workspace {

		engines = $state.raw([])
		layout = $state.raw([])

		inited = $state(false)
		state = $state({
			engineIndex: 0,
			viewIndex: 0
		})

		engine = $derived( this.engines[this.state.engineIndex] )

		schema = {
			engineIndex: { 
				enum: [ '$engines' ], 
				gui: 'select' 
			}
		}

		constructor() {
			this.inited = true

		}
		addEngine( engine ) {
			this.engines = [ ...this.engines, engine ]
			SAY(`⚒️ engine added to workspace`)
		}
	}


	const workspace = new Workspace()
	setContext('workspace', workspace) 

	let value = $state(0)
</script>

<style lang="sass">
	.workspace
		+row(stretch, stretch)
		+fill
		+overflow( none )
		.explorer, .custom, .editor
			+maxh(100vh)
			+minw($r8)
			+basis(0)
			+p($r1)
			+overflow(auto)
		.engines
			+grow
			+rel
			+minw(480px)
</style>

<svelte:options runes={true} />

<div class="workspace">
	<div class="explorer">
		<header class="">
			<GUI 
				id="selector"
				bind:value={ workspace.state.engineIndex }
				references={ workspace }
				schema={workspace.schema.engineIndex} />


		</header>
		{#if explorer}
			{@render explorer()}
		{/if}
		<div class="tree">
			<TreeView object={workspace.engine} />
		</div>
	</div>
	<div class="engines">
		{#if children}
			{@render children()}
		{/if}
	</div>

	{#if custom}
		<div class="custom">
			<header class="">
				<pre></pre>
			</header>
			{@render custom()}
		</div>
	{/if}
</div>
