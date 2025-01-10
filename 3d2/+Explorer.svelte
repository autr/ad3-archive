<script>

	// #define BABYLON
	import AUI from '$aui'
	import { tween, MapRange } from '$root'

	import Sketch from '$3d'
	import Wythoff from '$3d2_wythoff/_Wythoff.svelte'
	import Polyhedra from '$3d2'

	import RouteInspection from '$3d2_wythoff/_RouteInspection.svelte'
	import Download from '$3d1_export/_Download.svelte'
	import { PointerRotateable, PointerMoveable } from '$3d1_transformation'

	import * as Meshes from '$3d1_meshes'
	import * as Physics from '$3d1_physics'
	
	import * as Views from '$3d2_views'

	import { POINTER_EVENT_TYPES } from '$3d'

	// #define COMPONENT


	let physicsSettings = {
		angularDamping: 0.1 + 1.5,
		angularVelocity: new BB.Vector3(0,0,0),
		gravityFactor: 1,
		linearDamping: 0,
		linearVelocity: new BB.Vector3(0,0,0),
		mass: 1,
		massCenter: new BB.Vector3(0,0,0),
		massInertia: new BB.Vector3(2,2,2),
		massInertiaOrientation: new BB.Vector3(0,0,0)
	}

	let polyCanvas, xyzCanvas
	let groundMesh = null

	let tri = null
	tri = new BB.Vector3(1,0,0).subtract( new BB.Vector3(0.5,0.5,0.5) )
	tri = new BB.Vector3(0,1,0).subtract( new BB.Vector3(0.5,0.5,0.5) ) // A
	tri = new BB.Vector3(1,1,0).subtract( new BB.Vector3(0.5,0.5,0.5) ) // B
	tri = new BB.Vector3(1,0,1).subtract( new BB.Vector3(0.5,0.5,0.5) ) // C
	tri = new BB.Vector3(0,0,1).subtract( new BB.Vector3(0.5,0.5,0.5) ) // C
	tri = new BB.Vector3(0,1,1).subtract( new BB.Vector3(0.5,0.5,0.5) ) // D
	let polyhedron = null 


	let data = null
	function onPolyhedraUpdated( d ) {
		data = d
		window.data = d
	}

	let connection = null

	function onSpherePointer( e ) {

		if (e.eventName == 'POINTERDOWN' && e.pickedMesh) {
			connection = {
				from: e.pickedMesh,
			}
			SAY(`🌴 new connection`)
		}
	}


	function onCanvasMove(e) {

		if (connection) {
			const meshes = sketch.findMeshes( mesh => mesh?.data?.type == 'point' && mesh != connection.from )
			connection.to = sketch.findClosestMeshByEvent( e, meshes)
		}
	}
	function onPointerup( e ) {
		if (!connection) return
		const fromId = connection.from.data.id
		const toId = connection.to.data.id
		if (connection?.from && connection?.to) polyhedron.addConnection( [fromId, toId] )
		connection = null
	}

	function onKeydown(e) {
		if (e.key == 'Escape') connection = null
	}


	let sketch, showXYZ, runPhysics, isAnimating

	// let data = {}

	let refactorData = {}
</script>

<svelte:window 
	on:keydown={onKeydown} 
	on:pointerup={onPointerup}
	on:pointerleave={onPointerup} />

<canvas 
	on:pointermove={onCanvasMove}
	bind:this={polyCanvas} class="fill" />

<div class="abs r0 b0 flex column-flex-end-flex-end p1 f2">
	{#if refactorData?.statistics}
		<div class="flex column cmtb0-5">
			<Views.Statistics data={refactorData.statistics.faces} />
		</div>
		<div class="flex column cmtb0-5 bt bb">
			<Views.Statistics data={refactorData.statistics.points} inset={0.2} />
		</div>

		<div class="flex column cmtb0-5">
			<Views.Statistics data={refactorData.statistics.edges} value={2} showLength={true} />
		</div>
	{/if}
</div>

<div class="f4 t1 italics abs l50pc" style="transform:translate(-50%, 0%)">STEMS</div>
<!-- <div class="abs l0 p1 t0 z-index99 maxh100vh overflow-auto cmb0-5"> -->
	<!-- <h3>Demo</h3>
	<span>Physics</span>
	<AUI.Toggle bind:value={runPhysics} /> -->
	<Sketch 
		canvas={polyCanvas}
		bind:this={sketch}
		gui={false}
		showInspector={false}
		physics={'havok'}
		runPhysics={runPhysics && !isAnimating}
		onInit={()=> showXYZ = true}
		controls={false}
		debug={false}>
		<Wythoff
			position={new BB.Vector3( 1.6, 1, 0)}
			scaling={0.6}
			gui={false}
			xCount={5}
			yCount={5}
			zCount={5}
			bind:data={refactorData}
			bind:isAnimating={isAnimating}
			bind:value={tri} />
		{#if connection?.from}
			<Meshes.Sphere 
				diameter={0.09}
				debug={false}
				material={sketch.getColors().RED}
				position={connection.from.getAbsolutePosition()} />
		{/if}
		{#if connection?.to}
			<Meshes.Sphere 
				diameter={0.09}
				debug={false}
				material={sketch.getColors().RED}
				position={connection.to.getAbsolutePosition()} />
		{/if}
		{#if connection?.from && connection?.to}
			<Meshes.CylinderFromPoints
				diameter={0.012}
				name={'newConnection'}
				debug={false}
				material={sketch.getColors().RED}
				pointA={connection.from.getAbsolutePosition()}
				pointB={connection.to.getAbsolutePosition()}  />
		{/if}

			<Meshes.Ground 
				width={3} 
				height={3}
				gui={false}
				properties={{
					visibility: 0
				}}
				bind:mesh={groundMesh}
				position={{y: -1.2}}>

				<!-- <Physics.Mass 
					{...physicsSettings}
					mesh={groundMesh}
					mass={0}
					name="ground"
					shape="BOX" /> -->
			</Meshes.Ground>
		<Polyhedra 
			{physicsSettings}
			bind:this={polyhedron}
			preset={0}
			onUpdate={onPolyhedraUpdated}
			onSpherePointer={onSpherePointer}
			gui={false}
			{refactorData}
			showCenter={false}
			showMesh={!connection} 
			autoRotateSpeed={0}>
			<Download gui={false} />
			<RouteInspection 
				points={refactorData.extendedPoints}
				edges={refactorData.extendedEdges}
				gui={false} />
			<PointerRotateable
				enabled={!connection} />
			<PointerMoveable />
		</Polyhedra>
	</Sketch>
<!-- </div> -->
