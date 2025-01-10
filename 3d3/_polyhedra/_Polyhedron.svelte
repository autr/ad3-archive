<script>
	/* ====================================== */
	/*                                        */
	/*         	     POLYHEDRON               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Vec3 } from '$3d1_points'
	import Node from '../_points/_Node.svelte'
	import Polyhedron from './_Polyhedron.svelte.js'
	import Point from '../_points/_Point.svelte'
	import Builder from '../_meshes/_Builder.svelte'
	import Tube from '../_meshes/_Tube.svelte'
	import Free from '../_meshes/_Free.svelte'
	import FastCylinder from '../_meshes/_FastCylinder.svelte'
	import Edge from '../_modelling/_Edge.svelte'
	import RouteFinder from '../_routes/_RouteFinder.svelte'
	import { MapRange } from '$lib'

	// let timestamp = new Date()
	// function tick() {
	// 	console.log('ELAPSED', new Date() - timestamp)
	// 	timestamp = new Date()
	// 	requestAnimationFrame( tick )
	// }

	// if (browser) requestAnimationFrame( tick )

	let {

		id = 'polyhedron',

		preset = 'tetrahedron', /** @gui oneOf: [ $polypresets ] */
		worker = false, /** @gui */
		debug = {
			polyhedron: false, /** @gui type: boolean */
			mesh: false, /** @gui */
			tubes: false, /** @gui */
			cylinders: false, /** @gui */
			faces: false, /** @gui */
			points: false, /** @gui */
			spheres: false, /** @gui */
		},
		show = {
			mesh: false, /** @gui */
			tubes: false, /** @gui */
			cylinders: false, /** @gui */
			spheres: false, /** @gui */
			center: false, /** @gui */
		},
		schwarz = { 
			x: 1, /** @gui step: 0.001, min: 0, max: 1 */ 
			y: 0, /** @gui step: 0.001, min: 0, max: 1 */ 
			z: 1 /** @gui step: 0.001, min: 0, max: 1 */ 
		}, 
		frequency = 3, /** @gui min: 3, max: 5 */
		explode = 0, /** @gui step: 0.001, min: 0, max: 1 */
		snub = false, /** @gui */
		stellate = 0, /** @gui */

		position = { x: 0, y: 0, z: 0 }, /** @gui */
		rotation = { x: 0, y: 0, z: 0 }, /** @gui */
		scaling = { x: 1, y: 1, z: 1 }, /** @gui */

		children,
		...props
	} = $props()

	$effect(() => poly.syncState({

		debug: debug.polyhedron,
		schwarz,
		frequency,
		explode,
		snub,
		stellate,
		worker,

		show,
		position,
		rotation,
		scaling

	}))

	const refs = {
		edges: [],
		points: []
	}

	const poly = new Polyhedron( id, debug.polyhedron )

	onDestroy( poly.dispose.bind(poly) )

	const edges = $derived.by( () => {
		const total = Math.max( poly.edges.length, refs.edges.length )
		for (let i = 0; i < total; i++ ) {
			if (i < poly.edges.length) {
				refs.edges[i] = {
					points: poly.edges[i].map( idx => 'point'+idx ),
					id: 'edge' + i
				}
			}
		}
		return [ ...refs.edges ]
	})
	const points = $derived.by( () => {
		const total = Math.max( poly.points.length, refs.points.length )
		for (let i = 0; i < total; i++ ) {
			if (i < poly.points.length) {
				refs.points[i] = {
					x: poly.points[i].x,
					y: poly.points[i].y,
					z: poly.points[i].z,
					id: 'point' + i
				}
			}
		}
		return [ ...refs.points ]
	})

	function radiusFunction( idx, distance ) {

		return MapRange( Math.sin( distance ), -1, 1, 0.01, 0.1 )
		// return 0.01
	}

	let showing = $derived( poly?.state?.show || {} )

</script>

<svelte:options runes={true} />

{#if poly.mesh}

	{#each points as point, idx}
		<Point 
			id={point.id}
			debug={true || debug.points}
			x={point.x} 
			y={point.y} 
			z={point.z} />
	{/each}

	<Point 
		id="center"
		debug={debug.points}
		x={0} y={0} z={0} />


	<Node {position} {rotation}>

		{#each edges as edge}

<!-- 
			<Edge
				id={edge.id}
				points={edge.points} />

			{#if showing.tubes}
				<Tube 
					id={edge.id + 'tube'}
					points={edge.points}
					radius={radiusFunction}
					cap="cap"
					debug={debug.tubes} />
			{/if}
 -->
			{#if showing.cylinders}
				<FastCylinder
					id={edge.id + 'fast'}
					debug={debug.cylinders}
					points={edge.points} />

			{/if}
		{/each}


		{#if showing.spheres}
			{#each points as point, idx}
				<Builder 
					debug={debug.spheres}
					size={0.1} 
					type={'sphere'} 
					id={'sphere_'+point.id}
					position={point.id} />
			{/each}

			{#if showing.center}
				<Builder
					debug={debug.spheres}
					size={0.1}
					type={'sphere'}
					id="spherecenter"
					position="center" />
			{/if}

		{/if}

		{#if showing.mesh}
			<Free 
				debug={debug.mesh}
				invert={true}
				vertices={poly.mesh.vertices}
				uvs={poly.mesh.uvs}
				indices={poly.mesh.indices} />
		{/if}

	</Node>
	
	<!-- <RouteFinder /> -->

{/if}


{#if children}
	{@render children()}
{/if}