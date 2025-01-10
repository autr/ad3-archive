<script>

	// #define BABYLON
	import { browser } from '$app/environment'
	import { onMount, onDestroy, getContext } from 'svelte'

	// #define COMPONENT
    import { CreateSolidColorMaterial } from '$3d/_materials';
	

	export let text = 'Hello World'
	export let position = new BB.Vector3(0,0,0)
	export let explode = 0.2
	export let fontSize = 6
	export let resolution = 3
	export let name = 'label'
	export let fillStyle = 'white'

	const context = getContext('sketch')

	export let plane = null
	export let texture = null
	export let debug = context.getDebug()
	export let parent = null
	export let data = {}
	export let visible = true


	onMount( init )
	onDestroy( destroy )

	let request = null

	function init() {

		if (!browser) return
		const scene = context.getScene()
		if (!scene) return window.requestAnimationFrame( init )

		destroy()

		updatePlane()
		updateParent()
		updateTexture()
		updateVisible()
		updateData()

	}

	function updateVisible() {
		plane.isVisible = visible
	}
	function updatePlane() {

		const scene = context.getScene()
		if (!scene) return


		const planeWidth = (width / 100)
		const planeHeight = (height / 100)
		plane = BB.MeshBuilder.CreatePlane(name, { width: planeWidth, height: planeHeight }, scene)
		plane.material = new BB.StandardMaterial('labelMaterial', scene)
		plane.material.specularColor = new BB.Color3(0, 0, 0, 1) // Remove highlight
		plane.material.emissiveColor = new BB.Color4(1, 1, 1 )
		plane.material.disableLighting = true
		plane.billboardMode = BB.Mesh.BILLBOARDMODE_ALL
		plane.position = position
	}
	$: width = text.length * fontSize * 0.8
	$: height = fontSize * 1.2

	function updateTexture() {
		const scene = context.getScene()
		if (!plane || !plane?.parent || !scene) return

		const resWidth = width * resolution
		const resHeight = height * resolution
		const resFontSize = fontSize * resolution

		texture = new BB.DynamicTexture('texture', { width: resWidth, height: resHeight }, scene, true)
		texture.hasAlpha = true


		const font = `italic ${resFontSize}px Arial`
		const textureContext = texture.getContext()
		textureContext.clearRect(0, 0, width, height)
		textureContext.font = font
		textureContext.fillStyle = fillStyle
		const measure = textureContext.measureText(text)
		const x = (resWidth/2) - (measure.width/2)
		const y = (resHeight/2) + (measure.hangingBaseline/2)
		textureContext.fillText(text, x, y )

		plane.material.emissiveTexture = texture
		plane.material.diffuseTexture = texture
		plane.material.opacityTexture = texture

		texture.update()
	}

	let requestUpdateParent = null
	function updateParent() {
		plane.parent = parent || context.getParent()
	}


	let previousText, previousParent
	function onUpdatedExternally() {
		const neuText = previousText !== text
		const neuParent = previousParent !== parent
		if ( neuText || neuParent ) {
			init()
			if (neuText) previousText = text 
			if (neuParent) previousParent = parent
		}
	}

	function onUpdatedParentPosition() {
		if (!plane || !plane?.parent) return
		const direction = plane.parent.position.subtract(BABYLON.Vector3.Zero()).normalize()
		const newChildPosition = direction.scale(explode)
		plane.position.copyFrom(newChildPosition)
	}

	function updateData() {
		if (!plane) return
		plane.data = data
	}

	$: updateData( data )
	$: onUpdatedExternally( parent, text )
	$: updateVisible( visible )



	function destroy() {
		if (plane) plane.dispose()
		if (texture) texture.dispose()
		plane = null
		texture = null
		if (debug) SAY('🏷️ removed label')
	}


</script>
