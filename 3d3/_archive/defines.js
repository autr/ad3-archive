
export const MESH = `

	import { _materials } from '$3d1_materials'
	import { MESH_TRIGGERS } from '$3d'

	const context = getContext('sketch')
	const dispatch = createEventDispatcher()
	
	export let gui = false
	export let debug = context.getDebug()
	
	onMount( init )
	onDestroy( destroy )
	setContext( 'sketch', { ...context, getParent: () => mesh, getMesh: () => mesh } )

	export let mesh = null
	export let material = null
	export let properties = {}
	export let isPickable = true
	export let subdivide = 0
	export let data = {}

	function destroy() {
		if (mesh?.physicsImpostor) mesh.physicsImpostor.dispose()
		if (mesh?.actionManager) for (const action of mesh.actionManager.actions) mesh.actionManager.unregisterAction( action )
		if (mesh) mesh.dispose()
		if (debug) SAY(\`mesh destroyed: \${name}\`)
	}

	function bindActions() {

		mesh.actionManager = new BB.ActionManager(scene)

		for (const TRIGGER of MESH_TRIGGERS) {
			const key = \`On\${TRIGGER}Trigger\`
			const action = new BB.Action(BB.ActionManager[key])
			const type = TRIGGER.toLowerCase()
			action.onBeforeExecuteObservable.add( e => {
			  dispatch( type, { ...e, type, mesh } )
			})
			mesh.actionManager.registerAction(action)
		}
		
	}

	function init() {

		if (!browser) return
		const scene = context.getScene()
		destroy()
		initMesh()
		mesh.updatable = true
		mesh.isPickable = isPickable
		mesh.parent = context.getParent ? context.getParent() : null
		bindActions()
		updateMaterial()
		updateData()
		updateProperties()
		dispatch('init', { mesh })
		if (debug) SAY(\`mesh inited: \${name}\`)
	}



	function updateProperties() {
		if (!mesh) return
		for (const [key,value] of Object.entries(properties)) {
			if (debug) SAY('updating property', key, value)
			mesh[key] = value
		}
	}
	function updateData() {
		if (!mesh) return
		mesh.data = { ...(mesh.data || {}), ...data }
	}

	function updateMaterial() {
		if (!mesh) return
		mesh.material = $_materials?.[material] || material || defaultMaterial
		if (properties?.wireframe) mesh.material = mesh.material.clone()
		mesh.material.wireframe = properties?.wireframe || false
	}

	$: updateProperties( properties )
	$: updateData( data )
	$: updateMaterial( material )

`