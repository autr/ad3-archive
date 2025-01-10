<script>
	import * as BB from 'babylonjs'
	import Sketch from '$3d/_Sketch.svelte'
	import Sphere from '$3d_meshes/_Sphere.svelte'
	import Ground from '$3d_meshes/_Ground.svelte'
	import Mass from '$3d_physics/_Mass.svelte'
	import BallAndSocket from '$3d_physics/_BallAndSocket.svelte'
	import Spring from '$3d_physics/_Spring.svelte'
	import PointerDrag from '$3d_behaviours/_PointerDrag.svelte'
	import CylinderFromPoints from '$3d_meshes/_CylinderFromPoints.svelte'
	import { CreateSolidColorMaterial } from '$3d_materials'


	// #include essential

	const hello = 'world'
	

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

	let nodeA = new BB.Vector3(0,1,0)
	let nodeB = new BB.Vector3(-1,0.2,0)
	let nodeC = new BB.Vector3(0,0,0)
	let nodeD = new BB.Vector3(1,1,1)
	let nodeE = new BB.Vector3(-1,1,1)

	let physics, scene, ground

	let lineMatrixA = null // SET THESE ONCE (just in case - YES ✅)
	let lineMatrixB = null // SET THESE ONCE (just in case - YES ✅)
	let lineMatrixC = null // SET THESE ONCE (just in case - YES ✅)

	let canvas = null

	let lookup = {}

	let positions = {}
	function onRender() {
		positions.A = lookup.sphereA.position.clone()
		positions.B = lookup.sphereB.position.clone()
		positions.C = lookup.sphereC.position.clone()
	}
</script>


{#if canvas}
	<div class="abs maxw16em p1 maxh100vh overflow-auto z-index99">
		<Sketch 
			debug={true}
			gui={true}
			class="fill"
			canvas={canvas}
			gravity={{y: -9}}
			bind:scene={scene}
			onRender={onRender}
			physics="V2">

			<Mass 
				gui={true}
				guiOnly={true}
				bind:angularDamping={physicsSettings.angularDamping}
				bind:angularVelocity={physicsSettings.angularVelocity}
				bind:gravityFactor={physicsSettings.gravityFactor}
				bind:linearDamping={physicsSettings.linearDamping}
				bind:linearVelocity={physicsSettings.linearVelocity}
				bind:mass={physicsSettings.mass}
				bind:massCenter={physicsSettings.massCenter}
				bind:massInertia={physicsSettings.massInertia}
				bind:massInertiaOrientation={physicsSettings.massInertiaOrientation}
				/>

			<Ground 
				bind:mesh={ground}
				gui={false}
				width={4}
				height={4}
				subdivisions={12}
				position={{y: -1}}>

				<Mass 
					{...physicsSettings} 
					mass={0}
					mesh={ground}
					name="ground"
					shape="BOX" />
			</Ground>
			<CylinderFromPoints 
				bind:mesh={lookup.lineA}
				gui={false}
				pointA={nodeA}
				pointB={nodeD}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.lineA}
					name="lookup.lineA"
					shape="CAPSULE" />
			</CylinderFromPoints>
			<CylinderFromPoints 
				bind:mesh={lookup.lineB}
				gui={false}
				pointA={nodeA}
				pointB={nodeD}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.lineB}
					name="lookup.lineB"
					shape="CAPSULE" />
			</CylinderFromPoints>
			<CylinderFromPoints 
				bind:mesh={lookup.lineC}
				gui={false}
				pointA={nodeA}
				pointB={nodeE}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.lineC}
					name="lookup.lineC"
					shape="CAPSULE" />
			</CylinderFromPoints>

			<CylinderFromPoints 
				bind:mesh={lookup.lineD}
				gui={false}
				pointA={nodeB}
				pointB={nodeD}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.lineD}
					name="lookup.lineD"
					shape="CAPSULE" />
			</CylinderFromPoints>

			<!-- NODE A -->

			<Sphere 
				bind:mesh={lookup.sphereA}
				gui={false}
				position={nodeA}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.sphereA}
					name="lookup.sphereA"
					shape="SPHERE" />
				<PointerDrag
					mesh={ lookup.sphereA } />
				<BallAndSocket
					meshA={lookup.sphereA}
					meshB={lookup.lineA}
					pivot={nodeA} />
				<BallAndSocket
					meshA={lookup.sphereA}
					meshB={lookup.lineB}
					pivot={nodeA} />
				<BallAndSocket
					meshA={lookup.sphereA}
					meshB={lookup.lineC}
					pivot={nodeA} />
			</Sphere>

			<!-- NODE B -->

			<Sphere 
				bind:mesh={lookup.sphereB}
				gui={false}
				position={nodeB}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.sphereB}
					name="lookup.sphereB"
					shape="SPHERE" />
				<PointerDrag
					mesh={ lookup.sphereB } />
				<BallAndSocket
					meshA={lookup.sphereB}
					meshB={lookup.lineA}
					pivot={nodeB} />
				<BallAndSocket
					meshA={lookup.sphereB}
					meshB={lookup.lineD}
					pivot={nodeB} />
			</Sphere>

			<!-- NODE C -->

			<Sphere 
				bind:mesh={lookup.sphereC}
				gui={false}
				position={nodeC}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.sphereC}
					name="lookup.sphereC"
					shape="SPHERE" />
				<PointerDrag
					mesh={ lookup.sphereC } />
				<Spring
					meshA={lookup.sphereA}
					meshB={lookup.sphereC}
					pivotA={nodeA}
					pivotB={nodeC} />
			</Sphere>

			<!-- NODE D -->

			<Sphere 
				bind:mesh={lookup.sphereD}
				gui={false}
				position={nodeD}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.sphereD}
					name="lookup.sphereD"
					shape="SPHERE" />
				<BallAndSocket
					meshA={lookup.sphereD}
					meshB={lookup.lineD}
					pivot={nodeD} />
				<BallAndSocket
					meshA={lookup.sphereD}
					meshB={lookup.lineB}
					pivot={nodeD} />
				<PointerDrag
					mesh={ lookup.sphereD } />
			</Sphere>


			<!-- NODE E -->

			<Sphere 
				bind:mesh={lookup.sphereE}
				gui={false}
				position={nodeE}>
				<Mass 
					{...physicsSettings} 
					filterCollideMask={1}
					filterMembershipMask={2}
					mesh={lookup.sphereE}
					name="lookup.sphereE"
					shape="SPHERE" />
				<BallAndSocket
					meshA={lookup.sphereE}
					meshB={lookup.lineC}
					pivot={nodeE} />
				<PointerDrag
					mesh={ lookup.sphereE } />
			</Sphere>

			{#if positions.E}
				<Spring
					meshA={lookup.sphereE}
					meshB={lookup.sphereD}
					pivotA={nodeE}
					pivotB={nodeD} />
				<CylinderFromPoints 
					gui={false}
					diameter={0.01}
					pointA={positions.E}
					pointB={positions.D}>
				</CylinderFromPoints>
			{/if}

			{#if positions.A && positions.C}
				<CylinderFromPoints 
					gui={false}
					diameter={0.01}
					pointA={positions.A}
					pointB={positions.C}>
				</CylinderFromPoints>
			{/if}

			
		</Sketch>
	</div>
{/if}

<canvas bind:this={canvas} class="fill" />

