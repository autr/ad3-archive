<script>
	import { PRESETS, TABLE } from '$ad3_generators_polyhedra_presets'

	let polyhedra = $state({})

	function selectPolyhedra( preset ) {

		// const polyhedra = refs?.groups?.Polyhedra?.polyhedra
		// if (!polyhedra) return
		// const symbols = preset.symbols
		// const symbol = preset.symbols[0]

		// polyhedra.symbol = [ symbol[0], symbol[1], symbol[2] ]
		// polyhedra.snub = preset?.snub || false

		// schwarzDestination = new Vec3(symbol[3],symbol[4],symbol[5])


		// if (anim) anim.cancel()
		// anim = Animate.easeOutQuad( 0.04, polyhedra.schwarz, neuSchwarz, tweened => {
		// 	polyhedra.schwarz = tweened
		// 	// const quat = new BB.Quaternion( v.x, v.y, v.z, v.w )
		// 	// quat.toEulerAnglesToRef( nodeRef.rotation )

		// 	// nodeRef.rotationQuaternion = new BB.Quaternion( v.x, v.y, v.z, v.w )
		// }, v => {
		// 	SAY(`🥭 ANIM`)
		// 	// const rot = Number( getWorldRotation( nodeRef ).z )
		// 	// nodeRef.rotation.z = 0.3333
		// 	// nodeRef.rotation.z -= mesh.rotation.z
		// })
	}


	function tick() {
		// const polyhedra = refs?.groups?.Polyhedra?.polyhedra
		// if (schwarzDestination && polyhedra) {

		// 	const newX = (polyhedra.schwarz.x * smoothing) + (schwarzDestination.x * (1-smoothing))
		// 	const newY = (polyhedra.schwarz.y * smoothing) + (schwarzDestination.y * (1-smoothing))
		// 	const newZ = (polyhedra.schwarz.z * smoothing) + (schwarzDestination.z * (1-smoothing))

		// 	const closeX = Math.abs(newX - schwarzDestination.x) < unit
		// 	const closeY = Math.abs(newY - schwarzDestination.y) < unit
		// 	const closeZ = Math.abs(newZ - schwarzDestination.z) < unit

		// 	if( closeX && closeY && closeZ) {

		// 		if (!hasArrived) {
		// 			polyhedra.schwarz.x = schwarzDestination.x
		// 			polyhedra.schwarz.y = schwarzDestination.y
		// 			polyhedra.schwarz.z = schwarzDestination.z
		// 			hasArrived = true
		// 		}
		// 	} else {
		// 		hasArrived = false

		// 		const snapX = SnapToUnit(newX, unit)
		// 		const snapY = SnapToUnit(newY, unit)
		// 		const snapZ = SnapToUnit(newZ, unit)

		// 		if (polyhedra.schwarz.x !== snapX) polyhedra.schwarz.x = snapX
		// 		if (polyhedra.schwarz.y !== snapY) polyhedra.schwarz.y = snapY
		// 		if (polyhedra.schwarz.z !== snapZ) polyhedra.schwarz.z = snapZ
		// 	}

		// }

		requestAnimationFrame(tick)
	}
</script>


{#snippet tr()}
	<div class="p1">
		<button 
			onclick={SaveProject}
			class="colorswap fg1 bg3 button">
			Save Project
		</button>
		<div class="OCTA colorswap ">BLUE</div>
	</div>
{/snippet}

{#snippet tl()}
	<div class="col ">
		{#each sortedPresets as preset, idx}
			<button 
				class="pointer row gap2 fg1 colorswap bg3 ptb-1 plr1 f1" 
				onclick={() => selectPolyhedra(preset)}
				onfocus={()=>{}}
				onmouseover={() => selectPolyhedra(preset)}>
				<Name value={preset.names[0]} />
				{preset.symbols.map( sym => sym[2]).join(', ')}
			</button>
		{/each}
	</div>
{/snippet}


		<Overlay {tr} {tl} />