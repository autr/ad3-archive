<script>
	/* ====================================== */
	/*                                        */
	/*         	      MATERIAL                */
	/*                                        */
	/* ====================================== */


	// #define COMPONENT

	import Material from './_Material.svelte.js'
	import store from './store.svelte.js'

	let {

		emissive = 'hsv( 230%, 100%, 100%, 1)',
		diffuse = 'hsv( 0%, 100%, 100%, 1)',
		specular = 'hsv( 0%, 0%, 0%, 1)',
		ambient = 'hsv( 0%, 0%, 0% )',

		wireframe = false, /** @gui */

		id = 'material',
		...props
	} = $props()

	$effect(() => material.syncState({
		diffuse,
		specular,
		emissive,
		ambient,
		wireframe
	}))
	const material = new Material( id, store.materials )
	onDestroy( material.destroy )
</script>

<svelte:options runes={true} />
