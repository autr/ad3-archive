<script>

	/* ====================================== */
	/*                                        */
	/*        WYTHOFF SYMBOL POLYHEDRA        */
	/*                                        */
	/* ====================================== */


	// ------ JS ------

	import Wythoff from './lib.wythoff.js'
	import { calculateAnglesBetweenEdges, maxwellsRigidityCriterion } from './lib.utils.js'
	import { tween, MapRange } from '$root'

	// ------ BABYLON ------

	// #define BABYLON

	

	import { CreateSolidColorMaterial, CreateShaderMaterial } from '$3d1_materials'
	import { IrregularPolygon, Sphere, CylinderFromPoints, FreeMesh } from '$3d1_meshes'
	import { TransformNode, KeyboardRotate } from '$3d1_transformation'
	import { FPS } from '$3d1_debug'
	import { Download } from '$3d1_export'

	import AUI from '$aui'

	// #define COMPONENT
	

	// ------ INIT ------

	let tickRequest = null
	let wythoff = new Wythoff()
	let data = {}
	let mesh = null

	export let name = 'polyhedra'
	export let debug = false
	export let onInit = null
	export let onUpdate = null
	export let onSpherePointer = () => {}

	// ------ EXTRAS ------

	export let gui = false
	export let showLabels = false

	export let meshVisibility = 1
	export let meshScale = 1 - 0.618
	export let faceVisibility = 0 // 0.4
	export let centerVisibility = 1
	export let nodeVisibility = 1
	export let edgeVisibility = 1

	export let sphereDiameter = 0.3 - 0.1618
	export let cylinderDiameter = 0.3 - 0.1618

	export let showCenter = false

	// ------ ADJUSTMENTS ------

	export let position = { x: 0, y: 0, z: 0 }
	export let rotation = { x: 0, y: 0, z: 0 }
	export let scaling = { x: 1, y: 1, z: 1 }
	export let connections = []

	export let autoRotateSpeed = 0
	export let shrinkMesh = 0.99
	export let physicsSettings = {}
	export let tessellation = 32

	// ------ INIT ------

	onMount(init)
	const context = getContext('sketch')

	const COLORS = context.getColors()

	function Identifier( ...args ) {
		return [ name, ...args ].join('')
	}

	async function init() {

		if (!browser) return
		const scene = context.getScene()
		if (onInit) onInit( { wythoff, statistics } )
		if (debug) SAY('🏺 ✅ inited polyhedron')

	}

	$: info = [
		[
			{
				title: 'Maxwell',
				value: 	maxwellsRigidityCriterion((data.points || []).length) - (data.edges||[]).length
			}
		]
	]

	let selected = {}

	let meshes = {
		spheres: {},
		cylinders: {},
		central: {}
	}
	let fps = null 


	export let refactorData = {}


	function getWorldLocation( mesh ) {
        if (mesh.parent) mesh.parent.computeWorldMatrix(true)
        mesh.computeWorldMatrix(true)
        let quaternion = BABYLON.Quaternion.Identity()
        let position = BABYLON.Vector3.Zero()
        mesh.getWorldMatrix().decompose(BABYLON.Vector3.Zero(), quaternion, position)
        let rotation = new BB.Vector3()
        quaternion.toEulerAnglesToRef(rotation)
        return { quaternion, position, rotation }
	}

	function getWorldQuaternion( mesh ) {
		return getWorldLocation( mesh ).quaternion
	}
	function getWorldRotation( mesh ) {
		return getWorldLocation( mesh ).rotation
	}
	function getWorldPosition( mesh ) {
		return getWorldLocation( mesh ).position
	}

    function bakeWorldMatrix( mesh ) {

    	const { rotation, quaternion, position } = getWorldLocation( mesh )

        if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion.copyFrom(quaternion)
        } else {
            mesh.rotation.copyFrom(rotation)
        }

        // REMOVE PARENT

        if (mesh.parent) mesh.parent = undefined

        mesh.position.x = position.x
        mesh.position.y = position.y
        mesh.position.z = position.z

        return mesh 
    }


	function onDoublePick(e ) {

		SAY(`👉👉 doublepick`)

		const camera = context.getCamera()
		const mesh = e.detail.mesh
		const meshPositionAbs = mesh.getAbsolutePosition()
		const center = new BB.Vector3(0,0,0)

		let savedMeshes = []

		node.getChildMeshes().forEach( childMesh => {
			savedMeshes.push( childMesh )
			childMesh.setParent( null )
		})

		node.lookAt( meshPositionAbs )

		node.rotation.z = 0

		node.computeWorldMatrix( true )
		
		savedMeshes.forEach( childMesh => {
			childMesh.setParent( node )
		})

		const source = node.rotation.clone()
		const destination = node.getLookAtRotation( context.getCamera().position, 0, 0, 0 )

		const roll = (destination.x - source.x) / (destination.y - source.y)

		tween.easeInOutQuad( 0.04, source.toObject(), destination.toObject(), v => {
			// node.rotationQuaternion = new BB.Quaternion(v.x,v.y,v.z,v.w)
			node.rotation = new BB.Vector3(v.x,v.y,v.z)
		}, v => {
			SAY(`🍷 ROTATED`)
			console.log({
				meshWorld: getWorldRotation( mesh ).toObject(), 
				meshRot: mesh.rotation.toObject(), 
				nodeWorld: getWorldRotation( node ).toObject(),
				nodeRot: node.rotation.toObject(), 
			})
		})

	}

	export let node = null

	function onPlayheadChange(e) {
		console.log(e.detail)
		// COLORS.VIDEO.setPlayhead(e.detail)
	}

	function fetchMeshes() {

		const initMeshes = context.getScene().meshes.filter( mesh => mesh.visibility > 0 && !mesh.name.includes('liminal') ).map( mesh => {
			SAY(`${mesh.name}`, mesh.visibility)
			return mesh.clone()
		})
		return initMeshes
		const isSingle = initMeshes.length == 1
		const combinedMesh = isSingle ? initMeshes[0] : new BB.Mesh('CombinedExportMesh', scene)
		if (!isSingle) BB.Mesh.MergeMeshes(initMeshes, false, true, combinedMesh)
		initMeshes.forEach( mesh => mesh.dispose() )
		return [ combinedMesh ]
	}

</script>

<div class="abs l2 b2 cmb0-2 minw12em">
	<Download 
		fetchMeshes={fetchMeshes}
		gui={true} />
	<span>Playhead</span>
	<AUI.Slider set:step={0.001} on:change={onPlayheadChange} />
	<span>Mesh Scale</span>
	<AUI.Slider bind:value={meshScale} set:step={0.01} />
	<span>Mesh Visibility</span>
	<AUI.Slider bind:value={meshVisibility} set:step={0.01} />
	<span>Edge Visibility</span>
	<AUI.Slider bind:value={edgeVisibility} set:step={0.01} />
	<span>Node Visibility</span>
	<AUI.Slider bind:value={nodeVisibility} set:step={0.01} />
	<span>Face Visibility</span>
	<AUI.Slider bind:value={faceVisibility} set:step={0.01} />
	<span>Center Visibility</span>
	<AUI.Slider bind:value={centerVisibility} set:step={0.01} />
	<span>Point Diameter</span>
	<AUI.Numbox bind:value={sphereDiameter} set:step={0.01} set:max={0.8} />
	<span>Edge Diameter</span>
	<AUI.Numbox bind:value={cylinderDiameter} set:step={0.01} set:max={0.8} />
	<span>Tessellation</span>
	<AUI.Numbox bind:value={tessellation} set:step={1} set:max={32} />
</div>


{#if gui}
	<h3>Explorer</h3>
	<span>Wythoff FPS</span>
	<div>
		<FPS 
			class="f2 ICOSA"
			useMilliseconds={true}
			bind:this={fps} />
	</div>
	<span>Center Node</span>
	<AUI.Toggle bind:value={showCenter} />
	<span>Show Mesh</span>
	<AUI.Slider bind:value={faceVisibility} set:step={0.01} />
	<span>Auto Rotate</span>
	<AUI.Slider bind:value={autoRotateSpeed} set:step={0.01} set:max={2} />
	<span>Show Labels</span>
	<AUI.Toggle bind:value={showLabels} />
	<span>Shrink Mesh</span>
	<AUI.Numbox bind:value={shrinkMesh} set:step={0.01} set:max={1} set:min={0.9} />
	
{/if}

<!-- ==================================== 3D ==================================== -->

<TransformNode 
	bind:node={node}
	name={`polyhedraNode`}
	{autoRotateSpeed} 
	{position}
	{rotation}
	{scaling}
	gui={false}>

	<!-- <KeyboardRotate /> -->
	<slot />

	{#each refactorData.extendedFaces || [] as face, faceIdx } 
		<IrregularPolygon
			on:doublepick={onDoublePick}
			material={COLORS[face.length]}
			properties={{
				visibility: faceVisibility
			}}
			data={{export: false, type: 'face'}}
			extrude={0}
			shape={face.map(id => JSON.parse(id))}>
		</IrregularPolygon>

	{/each}


	<!-- <FreeMesh 
		gui={gui}
		debug={false}
		deform={true}
		data={{export: true}}
		name={`polyFreeMesh`}
		material={COLORS.MASS}
		subdivide={64}
		properties={{ 
			isPickable: true, 
			visibility: meshVisibility,
			wireframe: false
		}}
		vertices={refactorData.vertexarray} /> -->

	<TransformNode
		parent={node}
		scaling={meshScale}>
		<FreeMesh 
			gui={false}
			debug={false}
			deform={false}
			data={{export: true}}
			name={`polyFreeMesh`}
			material={COLORS.MASS}
			subdivide={0}
			properties={{ 
				isPickable: true, 
				visibility: meshVisibility,
				wireframe: false
			}}
			vertices={refactorData.vertexarray}
			indices={refactorData.indicesarray}
			uvs={refactorData.uvarray} />
	</TransformNode>

	{#each refactorData.extendedPoints || [] as point, pointIdx}


			<Sphere 
				gui={false}
				tessellation={tessellation}
				name={Identifier('Sphere', point.id)}
				diameter={sphereDiameter}
				material={point.material || COLORS.MASS}
				onPointer={onSpherePointer}
				properties={{
					visibility: nodeVisibility
				}}
				debug={false}
				data={{...point, export: true}}
				on:doublepick={onDoublePick}
				position={point.xyz}>
				<!-- {#if lookup.physics}
					<Physics.Mass 
						{...physicsSettings}
						filterCollideMask={1}
						filterMembershipMask={2}
						name={Identifier('NodeMass', point.name)}
						debug={false}
						shape="SPHERE">
					</Physics.Mass>
				{/if} -->

			</Sphere>

			<CylinderFromPoints 
				tessellation={tessellation}
				diameter={cylinderDiameter}
				name={Identifier('CentreEdge', point.id)}
				material={COLORS.MASS}
				properties={{
					visibility: centerVisibility
				}}
				gui={false}
				debug={false}
				data={{id: point.id, idx: pointIdx, export: true}}
				pointA={new BB.Vector3(0,0,0)}
				pointB={point.xyz}>
			</CylinderFromPoints>

			{#each point.edges as edge}
				<CylinderFromPoints 
					tessellation={tessellation}
					material={selected.cylinders == edge.id ? COLORS.YELLOW : COLORS.MASS}
					diameter={cylinderDiameter}
					name={Identifier('Edge', edge.id)}
					properties={{
						visibility: edgeVisibility
					}}
					gui={false}
					data={{...edge, export: true}}
					debug={false}
					pointA={JSON.parse(edge.idA)}
					pointB={JSON.parse(edge.idB)}>
					<!-- {#if lookup.physics}
						<Physics.Mass 
							{...physicsSettings}
							filterCollideMask={1}
							filterMembershipMask={2}
							name={Identifier('EdgeMass', edge.id)}
							debug={false}
							shape="CAPSULE">
							<Physics.BallAndSocket
								name={Identifier('EdgeSocketA', edge.id)}
								meshA={Identifier('Sphere', edge.idA)}
								debug={true} />
							<Physics.BallAndSocket
								name={Identifier('EdgeSocketB', edge.id)}
								meshA={Identifier('Sphere', edge.idB)}
								debug={true} />
						</Physics.Mass>
					{/if} -->
				</CylinderFromPoints>
			{/each}


	{/each}

</TransformNode>


<style lang="sass">
	.gui
	.adjustments
		+p(1em)
	.points-edges-faces
		+flex
		+row( flex-end, flex-start )
		.list
			+flex 
			+column( flex-end, flex-start )
			+pr(1em)
			.item
				+plr(0.5em)
				+ptb(0.2em)
				+radius()
			.item
				+pointer
			.title
				+pt(1em)
				+sticky
				+yt(0)
				+xl(0)
				+bg(var(--bg))
				+bb
				+radius(0)
				+mlr(0.5em)
				+mb(0.5em)

	.adjustments
		+w(16em)
			
</style>

