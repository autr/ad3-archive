<script>

	// #define COMPONENT

	import { MapRange } from '$root/lib.utils.js'

	import { Vec3 } from '$3d1_points'
	import { GUI } from '$gui'

	import Scene from './_scene/_Scene.svelte'
	import Camera from './_cameras/_Camera.svelte'
	import Shape from './_meshes/_Shape.svelte'
	import Point from './_points/_Point.svelte'
	import Engine from './_engine/_Engine.svelte'
	import Workspace from './_environment/_Workspace.svelte'
	
	// import Tube from './_meshes/_Tube.svelte'
	// import Material from './_materials/_Material.svelte'
	// import Environment from './_environment/_Environment.svelte'
	// import Polyhedron from './_polyhedra/_Polyhedron.svelte'
	// import Node from './_points/_Node.svelte'
	// import Free from './_meshes/_Free.svelte'
	// import FastCylinder from './_meshes/_FastCylinder.svelte'
	// import Input from '$gui_auto/_Input.svelte'

	import SYNCTEST from './_points/_SYNCTEST.svelte'
	import StartingPoint from './_3d3/_StartingPoint.svelte'

	let debug = $state(false)

	let targetName = $state('pointee')


</script>


<svelte:options runes={true} />
<Workspace>
	<Engine debug={false}>
			<Scene debug={false}>
				<input bind:value={targetName} />
				<Point id="pointee" debug={true} />
				<StartingPoint />
				<SYNCTEST target={targetName} />
				<!-- <Camera debug={false}>

					<Shape debug={true} position={"point1"} />
				</Camera> -->
			</Scene>
	</Engine>


</Workspace>

