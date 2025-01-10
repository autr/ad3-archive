<script>

	import Sketch from '$3d/_Sketch.svelte'
	import Polyhedra from '$3d2_wythoff'

	// #define COMPONENT
	

	export let canvas = null
	export let debug = false
	export let gui = false
	export let autoRotateSpeed = 0
	export let preset = 3
	export let sphereDiameter = 0.08
	export let cylinderDiameter = 0.01

	let style_ = ""
	export { style_ as style }
	let class_ = ""
	export { class_ as class }

	export let poly = null
</script>


<Sketch 
	{canvas}
	{debug}
	{gui}
	showInspector={false}>
	<Polyhedra 
		{autoRotateSpeed}
		{preset}
		{cylinderDiameter}
		{sphereDiameter}
		gui={false}
		showCenter={false}
		showMesh={true} />
</Sketch>

<canvas 
	bind:this={canvas}
	class={class_}
	style={style_} />
<!-- 
<div class="f2">
	{poly?.tri}
</div> -->