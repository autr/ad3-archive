<script>

	export let gui = false 
	export let gravity = new BB.Vector3(0,-9.8,0)
	export let vacuum = 0 // -1 to 1

	// ========== UPDATE PHYSICS SETTINGS ==========

	async function updatePhysicsSettings() {
		if (!browser || !scene) return
		if (physics) physics = physics.toLowerCase()

		if (!$_plugins[physics] && physics) {

			$_plugins[physics] = 1

			if (physics == 'v2' || physics == 'havok') {

				const havokWASM = await HavokPhysics()
				$_plugins[physics] = new HavokPlugin( true, havokWASM )
				SAY(`🦄 loaded HAVOK physics`)

			} else if (physics == 'cannon') {
				$_plugins[physics] = new BB.CannonJSPlugin()
				SAY(`⛷️ ✅ loaded CANNON physics`)

			} else if (physics == 'ammo') {

				const ammo = await Ammo.bind(window)()
				$_plugins[physics] = new BB.AmmoJSPlugin()
				SAY(`⛷️ ✅ loaded AMMO physics`)

			} else {
				SAY(`⛷️ 🚨 no physics engine enabled`)
			}
		}

		if (physics && !scene.getPhysicsEngine() && $_plugins[physics] !== 1 && $_plugins[physics] ) {
			const grav = new BB.Vector3( gravity.x, gravity.y, gravity.z)
			scene.enablePhysics( grav, $_plugins[physics] )
			if (debug) SAY(`⛷️ enabled physics, ${physics}`)
		}

		scene.physicsEnabled = runPhysics
	}

	
	$: updatePhysicsSettings( runPhysics, gravity, vacuum )
</script>

{#if gui}
	<span>Physics</span>
	<AUI bind:value={runPhysics}  />
	<span>Gravity</span>
	<Utils.Vector3 bind:value={gravity} set:step={0.1} />

{/if}