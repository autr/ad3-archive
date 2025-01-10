<script>
	/* ====================================== */
	/*                                        */
	/*                  MASS                  */
	/*                                        */
	/* ====================================== */

	import AUI from '$aui'
	import * as Utils from '$3d_utils'
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext, setContext } from 'svelte'

	// #include essential
	

	const context = getContext('sketch')
	
	export let gui = false
	export let guiOnly = false // ONLY SETTINGS
	export let aggregate = null // PHYSICS OBJECT
	export let onInit = null // CALLBACK
	export let debug = context.getDebug()

	export let name = 'Mass'
	export let shape = 'BOX'
	export let angularDamping = null
	export let angularVelocity = null
	export let gravityFactor = null
	export let linearDamping = null
	export let linearVelocity = null
	export let mass = null
	export let massCenter = null
	export let massInertia = null
	export let massInertiaOrientation = null

	export let filterCollideMask = null
	export let filterMembershipMask = null

	export let mesh = null


	onMount( init )
	onDestroy( destroy )


	function init() {

		if (!browser || guiOnly) return
		const scene = context.getScene()
		const candidateMesh = mesh ? mesh : context.getMesh ? context.getMesh() : null
		if (!candidateMesh || !scene) return 

		destroy()

		const shapeType = BB.PhysicsShapeType[shape]
		aggregate = new BB.PhysicsAggregate( candidateMesh, shapeType, { mass }, scene ) // mass must be 1 to "initiate"
		updateSettings()

		if (onInit) onInit( mesh )
		if (debug) SAY(`✅ ${name}, inited mass aggregate` )
	}

	$: init( mesh )

	function isUndefOrNull( val ) {
		return val === undefined || val === null
	}
	function updateSettings() {

		if (!aggregate || guiOnly) return

		// ------ FILTER MASKS ------

		if (filterCollideMask) aggregate.shape.filterCollideMask = filterCollideMask
		if (filterMembershipMask) aggregate.shape.filterMembershipMask = filterMembershipMask

		// ------ VARIOUS SETTINGS ------

		if (!isUndefOrNull(angularDamping)) aggregate.body.setAngularDamping( angularDamping )
		if (!isUndefOrNull(angularVelocity)) aggregate.body.setAngularVelocity( angularVelocity )
		if (!isUndefOrNull(gravityFactor)) aggregate.body.setGravityFactor( gravityFactor )
		if (!isUndefOrNull(linearDamping)) aggregate.body.setLinearDamping( linearDamping )
		if (!isUndefOrNull(linearVelocity)) aggregate.body.setLinearVelocity( linearVelocity )

		// ------ MASS PROPERTIES ------

		let massProps = {}

		if (!isUndefOrNull(mass)) massProps.mass = mass
		if (!isUndefOrNull(massCenter)) massProps.centerOfMass = massCenter
		if (!isUndefOrNull(massInertia)) massProps.inertia = massInertia
		if (!isUndefOrNull(massInertiaOrientation)) massProps.intertiaOrientation = massInertiaOrientation

		if (Object.keys(massProps).length > 0) {
			aggregate.body.setMassProperties( massProps )
		}

		if (debug) SAY(`✨ ${name}, updated mass settings`)


	}

	updateSettings( 
		angularDamping, 
		angularVelocity, 
		gravityFactor, 
		linearDamping, 
		linearVelocity, 
		mass, 
		massCenter, 
		massInertia, 
		massInertiaOrientation 
	)

	function destroy() {
		if (aggregate) {
			aggregate.dispose()
			aggregate = null
			if (debug) SAY(`🚨 ${name}, removed mass aggregate`)
		}
	}

	$: shapeOptions = Object.keys(BB.PhysicsShapeType).filter( val => val.length > 1 )

</script>


{#if gui}
	<span>Shape</span>
	<AUI.Selectbox bind:value={shape} set:options={shapeOptions} />
	<span>Angular Damping</span>
	<AUI.Numbox bind:value={angularDamping} set:step={0.01} />
	<span>Angular Velocity</span>
	<Utils.Vector3 bind:value={angularVelocity} />
	<span>Gravity Factor</span>
	<AUI.Numbox bind:value={gravityFactor} set:step={0.01} />
	<span>Linear Damping</span>
	<AUI.Numbox bind:value={linearDamping} set:step={0.01} />
	<span>Linear Velocity</span>
	<Utils.Vector3 bind:value={linearVelocity} />
	<span>Mass</span>
	<AUI.Numbox bind:value={mass} set:step={0.01} />
	<span>Mass Center</span>
	<Utils.Vector3 bind:value={massCenter} />
	<span>Mass Inertia</span>
	<Utils.Vector3 bind:value={massInertia} />
	<span>Mass Inertia Orientation</span>
	<Utils.Vector3 bind:value={massInertiaOrientation} />
{/if}
{#if aggregate}
	<slot />
{/if}
