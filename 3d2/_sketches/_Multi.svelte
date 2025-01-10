<script>

	import Sketch from '$3d/_Sketch.svelte'
	import Polyhedra from '$3d2_wythoff'
	import { Spacer } from '$aui_misc'

	// #define COMPONENT
	

	export let canvas = null
	export let debug = false
	export let gui = false
	export let autoRotateSpeed = 0
	export let sphereDiameter = 0.08
	export let cylinderDiameter = 0.01

	export let width = null
	export let height = null

	let style_ = ""
	export { style_ as style }
	let class_ = ""
	export { class_ as class }

	export let poly = null

	export let spread = 10
	export let presets =  [ 0, 1, 2, 3, 4 ]

	$: positions = presets.map( (preset,i) => {
		return {
			position: {
				x: ((spread / (presets.length-1)) * i) - (spread/2),
				y: 0,
				z: 0
			},
			preset
		}
	})
</script>


<Sketch 
	{canvas}
	{debug}
	{gui}
	mouseWheel={true}
	showInspector={false}>
	{#each positions as { preset, position }, i}
		<Polyhedra 
			{autoRotateSpeed}
			{cylinderDiameter}
			{sphereDiameter}
			{position}
			{preset}
			gui={false}
			showCenter={false}
			showMesh={true} />
	{/each}
</Sketch>

<div
	class={class_}
	style={style_}>
	<canvas 
		class="fill"
		bind:this={canvas} />
	<Spacer 
		class="w100pc"
		ratio={1/(presets.length-1)} />
</div>
<!-- 
<div class="f2">
	{poly?.tri}
</div> -->