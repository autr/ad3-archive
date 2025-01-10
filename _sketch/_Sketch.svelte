<script>
	

	globalThis.isNative = false
	
	/* ====================================== */
	/*                                        */
	/*         	       SKETCH                 */
	/*                                        */
	/* ====================================== */

	import Helper from './_Helper.svelte'
	import { RENDERMODE, PROJECTIONMODE, ALLTOOLS } from '../_tools'
	import { STORE_DEFAULTS } from './defs.js'
	import { SvelteMap } from 'svelte/reactivity'
	import { ComputeCSSVariables } from '$_lib'
	import { LoadBabylonFull } from '$ad3_core_backend_lib/index.js'
	import sketchStore from './store.svelte.js'
	
	// #define COMPONENT

	let {
		uid = 'sketch',
		data = $bindable({ object: 'Engine' }),
		refs = $bindable({}),
		class: classes,
		style: styles,
		children,
		variables = $bindable(null),
		inited = $bindable(false),
		...engineProps
	} = $props()

	for (const [key,value] of Object.entries(engineProps)) data[key] = value

	const internalData = $state({})
	let chosenData = data || internalData
	if (chosenData === data) SAY(`⚙️ USING EXTERNAL DATA ${uid}`)
	if (chosenData === internalData) SAY(`⚙️ USING INTERNAL DATA ${uid}`)

	// ------ REF OBJECTS ------

	const lookup = $state( new SvelteMap()) // used for finding object
	const groups = $state({}) // grouped objects
	const store = $state({...STORE_DEFAULTS}) // stateful interactions
	const elements = $state({
		sketchWrapper: undefined,
		domCanvas: undefined,
		svgCanvas: undefined
	})

	// ------ REF CONTEXTS ------

	setContext('store', store)
	setContext('lookup', lookup)
	setContext('groups', groups)
	setContext('data', chosenData)
	$effect( () => setContext('elements', elements ))


	export const getStore = () => store
	export const getLookup = () => lookup
	export const getGroups = () => groups
	export const getElements = () => elements
	export const getData = () => chosenData

	// ------ BABYLON ------


	$effect( async () => {
		if (!elements.domCanvas || !browser) return


		if (!variables) {
			variables = ComputeCSSVariables()
			if (!variables) {
				SAY(`❌ COULD NOT PARSE VARIABLES`)
				variables = {}
			} else {
				SAY(`🌞 VARIABLES`)
			}
		}


		if (sketchStore.isLoadingBabylon === 0) {
			sketchStore.isLoadingBabylon = 1
			await LoadBabylonFull()
			requestAnimationFrame( () => {
				SAY(`🟢 ENABLING BABYLON`)
				sketchStore.isLoadingBabylon = 2
			})
		}
	})


	// ------ REF DEFINE ------

	$effect( () => {
		if (elements.domCanvas && store.engineProxy ) {
			refs.uid = uid
			refs.elements = elements
			refs.lookup = lookup
			refs.groups = groups
			refs.data = chosenData
			refs.store = store
		}
	})


	$effect( () => {
		inited = data.inited
	})


</script>

<svelte:options runes={true} />


<div 
	bind:this={elements.sketchWrapper}
	style={styles}
	class="sketchWrapper -rendermode-{store.renderMode} {classes}">


	<div 
		bind:this={elements.canvasWrapper}
		tabindex="0"
		class="canvasWrapper overflow-hidden">
		<canvas 
			id={uid} 
			class="domCanvas"
			bind:this={elements.domCanvas}/>
	</div>



	{#if elements.domCanvas && sketchStore.isLoadingBabylon === 2 && variables}

		{#if chosenData}
			<Helper 
				bind:data={chosenData}
				isSketch={true} />
		{/if}

		{#if children}
			{@render children()}
		{/if}
	{/if}


</div>

<style lang="sass" global>
	html, body, *
		overscroll-behavior-x: none
	.sketchWrapper
		+rel
		+grow
		+h(100%)
		+w(100%)
		+radius(0px)
		.canvasWrapper
			+radius(0px)
			+b($r-2)
			border-color: rgba(1,1,1,0)
			transition: border-color 0.2s ease 
			&:focus
				outline: 0
				// border-color: var(--aqua3)
		.canvasWrapper, canvas
			+fill
		&.-rendermode-svg
			.svgCanvas 
				opacity: 1
		&.-rendermode-dom
			.svgCanvas
				opacity: 0
</style>
