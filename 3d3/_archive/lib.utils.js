// #define BABYLON
import { CreateSolidColorMaterial, CreateColor, CreateMetallicMaterial, CreateMassMaterial, AddMaterialDefaults } from '$3d1_materials'

import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)



export function findMeshByName(scene, mesh) {
	if (typeof mesh == 'object') return mesh
	if (typeof mesh == 'string') return scene.meshes.find( m => m.name == mesh || m.id == mesh)
	return null 
}

let colors = null

export function CreateVideoMaterial( scene ) {
	if (!scene) return console.error('NO SCENE')
	const videoTexture = new BABYLON.VideoTexture(
		'videoTexture',  // name
		'/crazy/newforms.mp4', 
		scene, 
		false, // mipmaps (expensive)
		false, // invertY
		BB.VideoTexture.TRILINEAR_SAMPLINGMODE, // samplingMode
		{
			autoPlay: true,
			autoUpdateTexture: true,
			muted: true,
			loop: true
		},
		err => {
			SAY('VIDEO ERROR', err)
		},
		null // format RGBA
	)
	const { video } = videoTexture

	const videoEvents = [
		'abort',
		'canplay',
		'canplaythrough',
		'durationchange',
		'emptied',
		'ended',
		'error',
		'loadeddata',
		'loadedmetadata',
		'loadstart',
		'pause',
		'play',
		'playing',
		'progress',
		'ratechange',
		'seeked',
		'seeking',
		'stalled',
		'suspend',
		'timeupdate',
		'volumechange',
		'waiting'
	]

	// for (const event of videoEvents ) {
	// 	video.addEventListener( event, e => {
	// 		SAY(`${event}`, e.message || '')
	// 	})
	// }

	
	const material = new BABYLON.StandardMaterial('videoMaterial', scene)
	material.emissiveTexture = videoTexture
	material.disableLighting = true
	material.setPlayhead = position => {
		if (position >= 0 && position <= 1) {
			const { video } = material.emissiveTexture
			video.currentTime = video.duration * position
		}
	}
	scene.registerBeforeRender(() => {
		// SAY('RENDER')
	    // videoTexture.update()
	})
	return material
}

export function getColors( scene ) {

	const BLUE = CreateColor( 110/255, 156/255, 247/255 )
	const GREEN = CreateColor( 133/255, 224/255, 133/255 )
	const YELLOW = CreateColor( 247/255, 247/255, 110/255 )
	const RED = CreateColor( 240/255, 117/255, 117/255 )
	const PURPLE = CreateColor( 224/255, 133/255, 224/255)
	const TURQ = CreateColor( 117/255, 240/255, 240/255)
	const PINK = CreateColor( 250/255, 158/255, 189/255)
	const ORANGE = CreateColor( 247/255, 178/255, 110/255)
	const INVISIBLE = CreateColor( 0, 0, 0, 0)
	const BG = CreateColor( 20/255, 31/255, 31/255 )
	const FADE = CreateColor( 20/255, 31/255, 31/255, 0.5 )
	const FG = CreateColor( 235/255, 224/255, 224/255 )

	let init = {
		BLUE: CreateSolidColorMaterial( scene, BLUE ),
		GREEN: CreateSolidColorMaterial( scene, GREEN ),
		YELLOW: CreateSolidColorMaterial( scene, YELLOW ),
		RED: CreateSolidColorMaterial( scene, RED ),
		PURPLE: CreateSolidColorMaterial( scene, PURPLE),
		TURQ: CreateSolidColorMaterial( scene, TURQ),
		PINK: CreateSolidColorMaterial( scene, PINK),
		ORANGE: CreateSolidColorMaterial( scene, ORANGE),
		INVISIBLE: CreateSolidColorMaterial( scene, INVISIBLE),
		BG: CreateSolidColorMaterial( scene, BG ),
		FADE: CreateSolidColorMaterial( scene, FADE ),
		FG: CreateSolidColorMaterial( scene, FG ),
		VIDEO: CreateVideoMaterial( scene )
	}

	init[3] = init.RED
	init[4] = init.GREEN
	init[5] = init.PURPLE
	init[6] = init.ORANGE
	init[8] = init.TURQ
	init[10] = init.PINK
	init[20] = init.BLUE
	init.MASS = CreateMassMaterial( scene, RED, FG, BLUE )

	return init
}

export function distanceToRay(point, ray) {
	const rayDir = ray.direction.normalize()
	const p1ToPoint = point.subtract(ray.origin)
	const p1ToPointAlongRay = BB.Vector3.Dot(p1ToPoint, rayDir)
	const closestPoint = ray.origin.add(rayDir.scale(p1ToPointAlongRay))
	return BB.Vector3.Distance(point, closestPoint)
}

export function findClosestMeshByEvent(canvas, anyEventOrRay, meshes, maxDistance = 999) {
	let ray = anyEventOrRay?.pickInfo?.ray || anyEventOrRay?.ray
	if (!ray) {
		const { clientX, clientY } = anyEventOrRay
		if (!clientX || !clientY) return SAY(`❌ cannot find closest mesh without event`)
		const rect = canvas.getBoundingClientRect()
		const mouseX = clientX - rect.left
		const mouseY = clientY - rect.top
		ray = scene.createPickingRay(mouseX, mouseY, BB.Matrix.Identity(), camera)
	}


	let closestMesh = null
	let minDistance = Infinity

	for (const mesh of meshes) {
		if (mesh?.position) {
			const distance = distanceToRay(mesh.getAbsolutePosition(), ray)
			if (distance < minDistance) {
				minDistance = distance
				closestMesh = mesh
			}
		}
	}
	return minDistance < maxDistance ? closestMesh : null
}

export function findMeshes( scene, callback ) {
	return scene.meshes.filter(callback)
}
