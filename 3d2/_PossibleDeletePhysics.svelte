<script>

	// #define BABYLON

	import Sketch from '$3d/_Sketch.svelte'
	import Sphere from '$3d1_objects/_Sphere.svelte'
	import CylinderFromPoints from '$3d1_objects/_CylinderFromPoints.svelte'
	import Ground from '$3d1_objects/_Ground.svelte'
	import Polyhedron from '$3d1_polyhedra/_Polyhedron.svelte'


	// #define COMPONENT
	

	let scene = null

	function onPointer(info) {
		console.log('TYPE', info)
	}

	let groundSize = 4
	let groundPosition = new BB.Vector3(0,-1.2,0)

	function onInitGround(mesh) {
		const aggre = new BB.PhysicsAggregate( mesh, BB.PhysicsShapeType.BOX, {
			mass: 0
		}, scene )
		SAY('🌇 inited ground')
	}


	// function addDragBehaviour( mesh ) {
	// 	const drag = new BB.PointerDragBehavior({})
	// 	drag.useObjectOrientationForDragging = false
	// 	mesh.physicsBody.disablePreStep = false
	// 	mesh.addBehavior(drag)
	// }

	// function addSpring( sphereA, sphereB ) {

	// 	const minDist = 0
	// 	const maxDist = 10
	// 	const damping = 0
	// 	const stiffness = 0.4

	// 	const spring = new BB.SpringConstraint(	
	// 		new BB.Vector3(0,0,0),
	// 		new BB.Vector3(0,0,0),
	// 		new BB.Vector3(1,1,1),
	// 		new BB.Vector3(1,1,1),
	// 		minDist,
	// 		maxDist,
	// 		damping,
	// 		stiffness,
	// 		scene
	// 	)
	// 	sphereA.physicsBody.addConstraint(sphereB.physicsBody, spring)
	// 	addDragBehaviour( sphereA )
	// 	physicsViewer.showBody( sphereA )
	// 	physicsViewer.showBody( sphereB )
	// 	SAY('🌇 added spring')
	// }

	// function addBallAndSocket( point, sphere, cylinder ) {

	// 	point = new BB.Vector3( point.x, point.y, point.z )

	// 	const mainPivot = new BB.Vector3(0,0,0)
	// 	const worldMatrix = window.worldMatrix = cylinder.getWorldMatrix()
	// 	const invertedMatrix = worldMatrix.invert()
	// 	const connectedPivot = BB.Vector3.TransformCoordinates(point, invertedMatrix)

	// 	const ballSocket = new BB.BallAndSocketConstraint(
	// 		mainPivot,
	// 		connectedPivot,
	// 		new BB.Vector3(1,1,1),
	// 		new BB.Vector3(1,1,1),
	// 		scene
	// 	)

	// 	sphere.physicsBody.addConstraint(cylinder.physicsBody, ballSocket)
	// 	// sphere.physicsBody.addConstraint(cylinder.physicsBody, spring)

	// 	addDragBehaviour( sphere )
	// 	physicsViewer.showBody( sphere )
	// 	physicsViewer.showBody( cylinder )
	// 	SAY('🌇 added ball and socket')
	// }

	// const physicsViewer = new BABYLON.Debug.PhysicsViewer()

	// function onInit( res ) {

	// 	const { type, mesh, data, meshes } = res

	// 	// ------ PHYSICS BODY ------

	// 	const shapeLookup = {
	// 		sphere: BB.PhysicsShapeType.SPHERE,
	// 		cylinder: BB.PhysicsShapeType.CAPSULE
	// 	}

	// 	const aggre = new BB.PhysicsAggregate( mesh, shapeLookup[type], {
	// 		mass: 1
	// 	}, scene )

	// 	aggre.shape.filterCollideMask = 1
	// 	aggre.shape.filterMembershipMask = 2


	// 	const lookup = {}
	// 	const names = [
	// 		'AngularDamping',
	// 		'AngularVelocity',
	// 		'GravityFactor',
	// 		'LinearDamping',
	// 		'LinearVelocity',
	// 		'MassProperties'
	// 	]
	// 	for (const name of names) {
	// 		lookup[name] = aggre.body['get'+name]()
	// 	}

	// 	lookup['AngularDamping'] += 1.5
	// 	const inert = 2
	// 	lookup['MassProperties'].inertia = new BB.Vector3(inert,inert,inert)

	// 	for (const name of names) {
	// 		aggre.body['set'+name](lookup[name])
	// 	}

	// 	window.aggre = aggre
	// 	window.mesh = mesh


	// 	// ------ SPHERE CONSTRAINT ------

	// 	if (type == 'cylinder') {

	// 		window.requestAnimationFrame(() => {

	// 			const { idxA, idxB } = mesh.data
	// 			// console.log( {idxA, idxB}, meshes )
	// 			const sphereA = meshes.spheres[ idxA ]
	// 			const sphereB = meshes.spheres[ idxB ]
	// 			// console.log('CYLINDER', {sphereA, sphereB})
	// 			// addSpring( sphereA, sphereB )
	// 		})
	// 	}

	// 	if (type == 'sphere') {

	// 		SAY(`🌇 init ${type}`)

	// 		const { idx } = mesh.data
	// 		const point = data.vertices[idx]

	// 		const edges = Object.values( meshes.cylinders ).filter( cyl => {
	// 			return cyl.data.idxA === idx || cyl.data.idxB === idx
	// 		})

	// 		for (const edge of edges) {
	// 			if (idx == 1) {
	// 				// if (edge.data.idxB == 2) {
	// 					// console.log('SOCKET', idx, point, mesh.data, edge.data)
	// 					addBallAndSocket( point, mesh, edge )
	// 				// }
	// 			}
	// 			if (idx == 2) {
	// 				if (edge.data.idxA == 1) {
	// 					// console.log('SOCKET', idx, point, mesh.data, edge.data)
	// 					// const pointAlt = data.vertices[edge.data.idxA]
	// 					addBallAndSocket( point, mesh, edge )
	// 				}
	// 			}
	// 		}

	// 	}
	// }

	const GRAVITY = 0
	const INSPECTOR = false


</script>

<Sketch 
	class="grow minh100vh"
	debug={false}
	bind:scene={scene}
	gravity={{y:GRAVITY}}
	inspector={INSPECTOR}
	physicsEngine="V2">
	<!-- <Ground 
		gui={false}
		onInit={onInitGround}
		width={groundSize}
		height={groundSize}
		position={groundPosition}>
	</Ground> -->
	<!-- <Polyhedron onInit={onInit} /> -->
</Sketch>

