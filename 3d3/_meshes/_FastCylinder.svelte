<script>
	/* ====================================== */
	/*                                        */
	/*             FAST CYLINDER              */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import FastCylinder from './_FastCylinder.svelte.js'
	import { STANDARD_HEIGHT } from './_FastCylinder.svelte.js'
	import Builder from './_Builder.svelte'
	import { Vec3 } from '$3d1_points'
	

	let {

		points = [ { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 } ],
		radius = 0.1, /** @gui */
		sides = 4, /** @gui */
		swivel = 0, /** @gui min: 0, max: 1, step: 0.0001 */
		flat = true, /** @gui */
		material = 'material', /** @gui oneOf: $materials */


		children,
		...props
	} = $props()


	// $effect(() => fast.state.debug = props.debug)
	// $effect(() => fast.state.points = props.points)
	// $effect(() => fast.state.radius = props.radius || 0.1)
	// $effect(() => fast.state.sides = props.sides || 4)
	// $effect(() => fast.state.swivel = props.swivel || 0)
	// $effect(() => fast.state.flat = props.flat)
	// $effect(() => fast.state.material = props.material)

	$effect(() => fast.state.points = points)
	$effect(() => fast.state.radius = radius)
	$effect(() => fast.state.sides = sides)
	$effect(() => fast.state.flat = flat)
	$effect(() => fast.state.material = material)

	const fast = new FastCylinder( props.id, props.debug )
	onDestroy( fast.dispose.bind(fast) )

</script>

<svelte:options runes={true} />

<Builder 
	id={fast.id() + '_mesh'}
	debug={props.debug}
	type="cylinder"
	sides={fast.state.sides}
	rotation={{x: 0, y: fast.instance.rotation.y, z: 0}}
	scaling={fast.scaling}
	size={{
		x: fast.state.radius,
		y: STANDARD_HEIGHT,
		z: fast.state.radius,
	}} /> 

{#if children}
	{@render children()}
{/if}