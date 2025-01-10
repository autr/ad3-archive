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

	let debug = $state(false)

	const maxPos = 10
	const maxSize = 0.1
	const maxItems = 5000
	let counter = $state(0)


	let state = $state({
		run: false,
		maxPosition: 10,
		maxSize: 0.1,
		maxItems: 5000,
		perFrame: 20,
		counter: 0,
	})

	const shapes = $derived.by(() => {
		let out = []
		for (let i = 0; i < state.maxItems; i++) {
			out.push( {
				position: {
					x: MapRange( Math.random(), 0, 1, -state.maxPosition, state.maxPosition),
					y: MapRange( Math.random(), 0, 1, -state.maxPosition, state.maxPosition),
					z: MapRange( Math.random(), 0, 1, -state.maxPosition, state.maxPosition)
				},
				size: {
					x: MapRange( Math.random(), 0, 1, -state.maxSize, state.maxSize),
					y: MapRange( Math.random(), 0, 1, -state.maxSize, state.maxSize),
					z: MapRange( Math.random(), 0, 1, -state.maxSize, state.maxSize)
				}
			})
		}
		return out
	})

	if (browser) tick()

	function tick() {
		if (state.counter < state.maxItems && state.run) state.counter += 20
		if (browser) requestAnimationFrame( tick )
	}


</script>


<svelte:options runes={true} />


<Workspace>
	<Engine debug={false}>
			<Scene debug={false}>
				<Camera debug={false}>

					<Point />

					{#each shapes as shape, idx}
						{#if idx < state.counter}
							<Shape {...shape} />
						{/if}
					{/each}
					<Point />
				</Camera>
			</Scene>
	</Engine>

</Workspace>



<!-- 
HELLO LETS GO

<Input min={0} max={1} step={0.001} bind:value={data.x} />
{data.x}

<Point x={data.x} debug={true} /> -->

<!-- <div class="flex minh1vh fg2" style="--gap: var(--r-1)">
	<div 
		style="filter: invert(1); z-index: 999" 
		class="hhh1vh overflow-hidden row abs t0 l0">
		<Environment selected={['polyhedron']} debug={true} >



			<aside id="custom m1 br fg2 fg ">
				<aside class="col gap1">
					<button 
						class="button"
						on:click={ () => testDispose = !testDispose }>
						DISPOSE
					</button>
					<Input min={0} max={1} step={0.001} bind:value={schwarz.x} />
					<Input min={0} max={1} step={0.001} bind:value={schwarz.y} />
					<Input min={0} max={1} step={0.001} bind:value={schwarz.z} />
					<Input min={3} max={5} step={1} bind:value={frequency} />

					{#each Object.entries(show) as [id]}
					<span class="row gap1">
						<Input type="boolean" bind:value={show[id]} /> {id}
					</span>
					{/each}
				</aside>
			</aside>


			<Engine {canvas} debug={DEBUG} >
				<Scene inspector={false} debug={DEBUG} >
					<Camera debug={DEBUG} />

						<Point debug={DEBUG} />
		
					{#if testDispose}
						<Polyhedron schwarz={schwarz} snub={false} {frequency} {show} />
						<Polyhedron schwarz={schwarz} snub={false} {frequency} {show} />
					{/if}
					 <Point id="a" debug={true} x={2} y={1} />
					<Point id="b" debug={true} y={-1} />
					<FastCylinder debug={true} id="fast" points={['a','b']} /> 

					<Builder type="sphere" position="test" debug={true} />
				</Scene>
			</Engine>


		</Environment>
	</div>


	<div class="grow b rel">
	</div>

</div> -->

