<script>
	/* ====================================== */
	/*                                        */
	/*         	        FREE                  */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import Free from './_Free.svelte.js'


	let {

		id = 'free',
		debug = false, /** @gui */

		vertices = [],
		indices = [],
		normals = [],
		uvs = 'spherical', /** @gui oneOf: [ spherical, basic ] */

		invert = false, /** @gui */ // invert indices

		position = 0, /** @gui oneOf: [ $points ] */
		rotation = 0, /** @gui oneOf: [ $meshes ] */
		scaling = 0, /** @gui */

		updatable = true, /** @gui */

		material = 'material', /** @gui oneOf: [ $materials ] */
		children,
		...props
	} = $props()


	$effect( () => mesh.debug = debug )
	$effect( () => mesh.state.vertices = vertices )
	$effect( () => mesh.state.indices = indices )
	$effect( () => mesh.state.normals = normals )
	$effect( () => mesh.state.uvs = uvs )
	$effect( () => mesh.state.invert = invert )
	$effect( () => mesh.state.position = position )
	$effect( () => mesh.state.rotation = rotation )
	$effect( () => mesh.state.scaling = scaling )
	$effect( () => mesh.state.updatable = updatable )

	const mesh = new Free( id, debug )
	onDestroy( mesh.dispose.bind(mesh) )
</script>

<svelte:options runes={true} />

{#if children}
	{@render children()}
{/if}
