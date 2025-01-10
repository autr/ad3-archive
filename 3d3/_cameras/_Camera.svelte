<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       CAMERA                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Vec3 } from '$3d1_points'
	import ObjectSvelte from '../_engine/_Object.svelte.js'
	import SchemaString from './_Camera.svelte?raw'
	import { GUI } from '$gui'

	let {
		type = 'arcrotate', /** @gui enum: [ arcrotate, free, universal, arcfollow, fly, follow, touch, target, touch, webxr, anaglypharcrotate, anaglyphfree, anaglyphuniversal, stereoscopicarcrotate, stereoscopicfree, stereoscopicuniversal ] */
		target = undefined, /** @gui {enum: [ none, $Point ] */
		position = { x: 0, y: 0, z: -4 }, /** @gui */
		controls = true, /** @gui */
		orthographic = false, /** @gui */
		interaxial = true, /** @gui */
		sidebyside = true, /** @gui */
		children,
		...props
	} = $props()

	export class Camera extends ObjectSvelte {}
	const cam = new Camera( props.id, props.debug, getContext('parent'), getContext('references') )

	setContext('parent', cam)
	setContext('camera', cam)

	cam.setSchema(SchemaString)

	cam.send('create', cam.debug, cam.parent.id() )

	$effect( cam.sync('target', target))
	$effect( cam.sync('type', type))

	$effect( cam.sync('position.x', position.x))
	$effect( cam.sync('position.y', position.y))
	$effect( cam.sync('position.z', position.z))

	$effect( cam.sync('interaxial', interaxial))
	$effect( cam.sync('sidebyside', sidebyside))
	
	$effect( cam.sync('orthographic', orthographic, 'setOrthographic' ))
	$effect( cam.sync('controls', controls, 'setControlsEnabled' ))

	const alpha = -Math.PI / 1
	const beta = Math.PI / 2
	const minZ = 0

	$effect( () => {
		if (cam.inited) return
		cam.send('init', {
			...cam.props, 
			position: { ...cam.props.position },
			alpha,
			beta,
			minZ
		})
	})

	onDestroy( cam.dispose.bind(cam) )

</script>

<svelte:options runes={true} />

{#if cam?.inited}
	{@render children()}
{/if}
