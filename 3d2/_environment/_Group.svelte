<script>

	/* ====================================== */
	/*                                        */
	/*        WYTHOFF SYMBOL POLYHEDRA        */
	/*                                        */
	/* ====================================== */

	

	// #define BABYLON

	import * as Meshes from '$3d1_meshes'
	import * as Physics from '$3d1_physics'
	import { VectorGUI } from '$3d1_debug'
	import { CreateSolidColorMaterial, CreateShaderMaterial } from '$3d1_materials'
	import { TransformNode } from '$3d1_transformation'

	import AUI from '$aui'

	// #define COMPONENT
	

	// ------ INIT ------

	let tickRequest = null
	let wythoff = new Wythoff()
	let data = {}
	let mesh = null

	export let name = 'group'

	// ------ ADJUSTMENTS ------

	export let position = { x: 0, y: 0, z: 0 }
	export let rotation = { x: 0, y: 0, z: 0 }
	export let scaling = { x: 1, y: 1, z: 1 }


	export let sphereDiameter = 0.08
	export let cylinderDiameter = 0.01
	export let tessellation = 8
	export let autoRotateSpeed = 0
	export let shrinkMesh = 0.99
	export let physicsSettings = {}

	export let gui = false
	export let debug = false

	let environment = {}

	// ------ INIT ------

	onMount(init)
	setContext( 'sketch', { ...context, getEnviroment: () => environment } )
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

</script>


{#if gui}
	<div>
		<button on:click={downloadOBJ}>
			Download OBJ
		</button>
		<button on:click={downloadSTL}>
			Download STL
		</button>
	</div>
	<div>
		<button on:click={forceReset}>Force Reset</button>
	</div>
	<span>Wythoff FPS</span>
	<div>
		<Utils.FPS 
			class="f2 ICOSA"
			useMilliseconds={true}
			bind:this={fps} />
	</div>
	<span>Preset</span>
	<AUI.Selectbox 
		bind:value={preset}
		set:options={presets}
		set:optionRender={presetOptionRender} />
	<span>Wythoff</span>
	<div class="cmr0-5">
		{#each ['Basic','Advanced'] as name, idx}
			<button
				on:click={()=>wythoff.settings.useTri = idx}
				class:CUBE={wythoff.settings.useTri == idx}>
				{name}
			</button>
		{/each}
	</div>
	<span>Center Node</span>
	<AUI.Toggle bind:value={showCenter} />
	<span>Show Mesh</span>
	<AUI.Toggle bind:value={showMesh} />
	<span>Postman</span>
	<AUI.Slider bind:value={interpolatePostman} set:step={0.0001} />
	<span>Interpolate</span>
	<VectorGUI bind:value={wythoff.settings.triangle} />
	<VectorGUI bind:value={wythoff.settings.symbol} />
	<VectorGUI bind:value={wythoff.settings.symmetry} />

	<AUI.Slider class="mt0-5" bind:value={wythoff.settings.interpolate} set:step={0.01} set:min={0} set:max={15} />
	<span>Stellate</span>
	<AUI.Numbox bind:value={wythoff.settings.stellate} set:step={0.01} set:min={1} set:max={4} /> 
	<span>Chiral</span>
	<AUI.Toggle bind:value={wythoff.settings.chiral} /> 
	<span>Explode</span>
	<AUI.Slider bind:value={wythoff.settings.explode} set:step={0.01} set:max={2} />
	<span>Auto Rotate</span>
	<AUI.Slider bind:value={autoRotateSpeed} set:step={0.01} set:max={2} />
	<span>Show Labels</span>
	<AUI.Toggle bind:value={showLabels} />
	<span>Tessellation</span>
	<AUI.Numbox bind:value={tessellation} set:step={2} set:max={64} />
	<span>Point Diameter</span>
	<AUI.Numbox bind:value={sphereDiameter} set:step={0.01} set:max={0.8} />
	<span>Edge Diameter</span>
	<AUI.Numbox bind:value={cylinderDiameter} set:step={0.01} set:max={0.8} />
	<span>Shrink Mesh</span>
	<AUI.Numbox bind:value={shrinkMesh} set:step={0.01} set:max={1} set:min={0.9} />
	<span>Snub</span>
	<AUI.Toggle bind:value={wythoff.settings.snub} />
	
{/if}

<!-- ==================================== 3D ==================================== -->

<TransformNode 
	{autoRotateSpeed} 
	{position}
	{rotation}
	{scaling}
	{gui}>

	{#if !lookup.physics }
		<Meshes.FreeMesh 
			gui={gui}
			debug={false}
			name={`polyFreeMesh`}
			scaling={{x:shrinkMesh,y:shrinkMesh,z:shrinkMesh}}
			material={showMesh && !showCenter ? COLORS.BG : COLORS.INVISIBLE}
			properties={{ isPickable: true }}
			vertices={data.vertexarray} />
	{/if}

	<!-- SPHERES -->

	{#each solution.pointsList || [] as point, idx}

		{#if idx < solution.position - 1}
			<Meshes.Sphere 
				name={Identifier('ChineseSphere', point.id)}
				diameter={sphereDiameter + 0.02}
				material={COLORS.GREEN}
				data={{...point}}
				position={point.xyz} />

			<Meshes.CylinderFromPoints 
				diameter={cylinderDiameter + 0.001}
				name={Identifier('ChineseEdge', point.id)}
				material={COLORS.GREEN}
				pointA={point.xyz}
				pointB={solution.pointsList[idx+1].xyz} />
		{/if}
	{/each}

	{#if solution.position > 0}
		<Meshes.Sphere 
			name={Identifier('ChineseModulusSphere')}
			diameter={sphereDiameter + 0.001}
			material={COLORS.YELLOW}
			position={solution.toPoint} />
		<Meshes.CylinderFromPoints 
			diameter={cylinderDiameter + 0.001}
			name={Identifier('ChineseModulusCylinder')}
			material={COLORS.GREEN}
			pointA={solution.fromPoint}
			pointB={solution.toPoint} />
	{/if}

	{#each lookup.extendedPoints as point, pointIdx}


			<Meshes.Sphere 
				gui={false}
				tessellation={tessellation}
				name={Identifier('Sphere', point.id)}
				diameter={sphereDiameter}
				material={point.material || COLORS.FG}
				onPointer={onSpherePointer}
				onInit={onInitSphere}
				debug={false}
				data={{...point, export: true}}
				position={point.xyz}>
				{#if lookup.physics}
					<Physics.Mass 
						{...physicsSettings}
						filterCollideMask={1}
						filterMembershipMask={2}
						name={Identifier('NodeMass', point.name)}
						debug={false}
						shape="SPHERE">
						<!-- <Behaviours.PointerDrag /> -->
					</Physics.Mass>
				{/if}

			</Meshes.Sphere>

			{#if showCenter}
				<Meshes.CylinderFromPoints 
					tessellation={tessellation}
					diameter={cylinderDiameter}
					name={Identifier('CentreEdge', point.id)}
					material={COLORS.ORANGE}
					gui={false}
					debug={false}
					data={{id: point.id, idx: pointIdx, export: true}}
					pointA={new BB.Vector3(0,0,0)}
					pointB={point.xyz}>
				</Meshes.CylinderFromPoints>
			{/if}

			{#each point.edges as edge}
				<Meshes.CylinderFromPoints 
					tessellation={tessellation}
					material={selected.cylinders == edge.id ? COLORS.YELLOW : COLORS.FG}
					diameter={cylinderDiameter}
					onInit={onInitCylinder}
					name={Identifier('Edge', edge.id)}
					gui={false}
					data={{...edge, export: true}}
					debug={false}
					pointA={JSON.parse(edge.idA)}
					pointB={JSON.parse(edge.idB)}>
					{#if lookup.physics}
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
					{/if}
				</Meshes.CylinderFromPoints>
			{/each}


	{/each}


	<slot />
</TransformNode>

