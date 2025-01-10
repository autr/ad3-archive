<script>
	import { onMount } from 'svelte'
	import * as BABYLON from 'babylonjs'
	import * as Cannon from 'cannon-es'
	import { browser } from '$app/environment'

	if (browser) window.CANNON = Cannon

	let engine, canvas, scene, camera, light, ground
	let bars = []
	let joints = []
	let lines = []

	onMount( init )

	function addJoint(box1, box2, mainPivot, connectedPivot) {
		let params = {
			length: 10,
			stiffness: 10,
			damping: 1,
			mainPivot: mainPivot,
			connectedPivot: connectedPivot
		};
		let joint = new BABYLON.PhysicsJoint(BABYLON.PhysicsJoint.SpringJoint, params);
		box1.physicsImpostor.addJoint(box2.physicsImpostor, joint);
		return joint;
	}

	function createBar(i, scene, mat) {
		let bar = BABYLON.MeshBuilder.CreateCylinder(
			"bar" + i,
			{ height: 16, diameter: 0.5 },
			scene
		)
		bar.position.x = (i - 1) * 2;
		bar.position.y = 5;

		bar.material = mat

		bar.physicsImpostor = new BABYLON.PhysicsImpostor(
			bar,
			BABYLON.PhysicsImpostor.BoxImpostor,
			{
				mass: 1,
				nativeOptions: { collisionFilterGroup: 2, collisionFilterMask: 1 },
			},
			scene
		);

		let pointerDragBehavior = new BABYLON.PointerDragBehavior({});
		pointerDragBehavior.useObjectOrienationForDragging = false;
		pointerDragBehavior.updateDragPlane = false;
		bar.addBehavior(pointerDragBehavior);

		return bar;
	}

	function updateLine(joint, line) {
		let worldAnchorA = new CANNON.Vec3({x:0, y:0, z:0});
		let worldAnchorB = new CANNON.Vec3({x:0, y:0, z:0});

		joint.physicsJoint.getWorldAnchorA(worldAnchorA)
		joint.physicsJoint.getWorldAnchorB(worldAnchorB)

		line[0].x = worldAnchorA.x
		line[0].y = worldAnchorA.y
		line[0].z = worldAnchorA.z
		line[1].x = worldAnchorB.x
		line[1].y = worldAnchorB.y
		line[1].z = worldAnchorB.z
	}

	function init() {
		if (!browser) return
		engine = new BABYLON.Engine(canvas, true);

		scene = new BABYLON.Scene(engine)
		scene.enablePhysics()
		scene.physicsEnabled = false


		camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 1, new BABYLON.Vector3(0, 0, 0), scene);
		camera.setPosition(new BABYLON.Vector3(0, -12, 25));
		// camera.attachControl(canvas, true);

		scene.clearColor = new BABYLON.Color4(0, 0, 0, 0); // RGBA(0, 0, 0, 0) is transparent

		ground = BABYLON.MeshBuilder.CreateBox("ground", { height: 5, width: 100, depth: 100 }, scene);
		ground.position.y = -13
		ground.isPickable = false
		ground.physicsImpostor = new BABYLON.PhysicsImpostor(
			ground,
			BABYLON.PhysicsImpostor.BoxImpostor, {
				mass: 0,
				nativeOptions: {
					collisionFilterGroup: 1,
					collisionFilterMask: 2,
				}
			},
			scene
		)

		const groundMat = new BABYLON.StandardMaterial('groundMat', scene);
		// groundMat.alpha = 0
		ground.material = groundMat

		const barMat = new BABYLON.StandardMaterial('barMat', scene)
		barMat.diffuseColor = new BABYLON.Color3(209/255, 224/255, 224/255)
		barMat.specularColor = new BABYLON.Color3(0, 0, 0)
	    barMat.emissiveColor = new BABYLON.Color3(209/255, 224/255, 224/255)


		bars = [
			createBar(0, scene, barMat),
			createBar(1, scene, barMat),
			createBar(2, scene, barMat)
		];

		joints = [
			addJoint(bars[1], bars[0], {x: 0, y: 8, z: 0}, {x: 0, y: 8, z: 0}),
			addJoint(bars[2], bars[1], {x: 0, y: 8, z: 0}, {x: 0, y: 8, z: 0}),
			addJoint(bars[0], bars[2], {x: 0, y: 8, z: 0}, {x: 0, y: 8, z: 0}),
			addJoint(bars[1], bars[0], {x: 0, y: -8, z: 0}, {x: 0, y: -8, z: 0}),
			addJoint(bars[2], bars[1], {x: 0, y: -8, z: 0}, {x: 0, y: -8, z: 0}),
			addJoint(bars[0], bars[2], {x: 0, y: -8, z: 0}, {x: 0, y: -8, z: 0}),
			addJoint(bars[1], bars[0], {x: 0, y: 8, z: 0}, {x: 0, y: -8, z: 0}),
			addJoint(bars[2], bars[1], {x: 0, y: 8, z: 0}, {x: 0, y: -8, z: 0}),
			addJoint(bars[0], bars[2], {x: 0, y: 8, z: 0}, {x: 0, y: -8, z: 0}),
		]
		
		lines = [];
		for (let i = 0; i < joints.length; i++) {
			lines.push([new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(0, 0, 0)]);
		}

		let linesystem = BABYLON.MeshBuilder.CreateLineSystem(
			"linesystem",
			{ lines: lines, updatable: true },
			scene
		); 

		scene.registerBeforeRender(function() {
			for (let i = 0; i < joints.length; i++) {
				updateLine(joints[i], lines[i]);
			}
			BABYLON.MeshBuilder.CreateLineSystem("lines", {lines: lines, instance: linesystem});    
		});

		engine.runRenderLoop(function () { 
				scene.render();
		})

		return scene
	}

	function run() {
		scene.physicsEnabled = !scene.physicsEnabled

	}


</script>

<svelte:window on:resize={e=>engine.resize()} />
<button on:click={run} class="abs b0 l0 z-index99">{scene?.physicsEnabled ? 'Pause' : 'Run' }</button>
<canvas class="fill" bind:this={canvas} />


