<script>

	/* ====================================== */
	/*                                        */
	/*         	        POINT                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import SchemaString from './_Point.svelte?raw'
	import Object from '../_engine/_Object.svelte.js'

	let {
		id,
		x = 0, /** @gui */
		y = 0, /** @gui */
		z = 0, /** @gui */

		debug = false, /** @gui */
		children,
		...props
	} = $props()

	export class Point extends Object {}
	const point = new Point( id, debug, getContext('parent'), getContext('references') )

	setContext('parent', point)
	setContext('point', point)

	point.setSchema(SchemaString)

	// point.send('create', point.debug, point.parent.id() )

	$effect( () => {
		console.log(point.id(), 'THE INTERNAL X IS CHANGED', point.props.x)
	})

	$effect( point.sync('x', x ))
	$effect( point.sync('y', y ))
	$effect( point.sync('z', z ))

	$effect( () => {
		if (point.inited) return
		point.send('init', x, y, z )
	})

</script>

<svelte:options runes={true} />

{#if children}
	{@render children()}
{/if}
