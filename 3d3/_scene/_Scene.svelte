<script>
	
	/* ====================================== */
	/*                                        */
	/*         	        SCENE                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import ObjectSvelte from '../_engine/_Object.svelte.js'
	import SceneString from './_Scene.svelte?raw'

	let {
		inspector = false, /** @gui */
		id = 'scene',
		children,
		...props
	} = $props()

	export class Scene extends ObjectSvelte {}
	const scene = new Scene( id, props.debug, getContext('parent'), getContext('references') )
	scene.setSchema(SceneString)

	setContext('parent', scene)
	setContext('scene', scene)

	scene.send('create', scene.debug, scene.parent.id() )
	scene.send('init')

	$effect( () => { if (props.debug !== undefined) {
		scene.debug = props.debug
		if (scene.debug) scene.say('🐞 toggle on')
	}})

	// onDestroy( scene.send('dispose') )

</script>

<svelte:options runes={true} />

{#if scene.inited}
	{@render children()}
{/if}

