import * as BB from 'babylonjs'
import { CreateSolidColorMaterial } from '$3d_materials'

import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)

export function findMeshByName(scene, mesh) {
	if (typeof mesh == 'object') return mesh
	if (typeof mesh == 'string') return scene.meshes.find( m => m.name == mesh || m.id == mesh)
	return null 
}

let colors = null

export function getColors( scene ) {

	return {
		BLUE: CreateSolidColorMaterial( scene, 110/255, 156/255, 247/255 ),
		GREEN: CreateSolidColorMaterial( scene, 133/255, 224/255, 133/255 ),
		YELLOW: CreateSolidColorMaterial( scene, 247/255, 247/255, 110/255 ),
		RED: CreateSolidColorMaterial( scene, 240/255, 117/255, 117/255 ),
		PURPLE: CreateSolidColorMaterial( scene, 224/255, 133/255, 224/255),
		TURQ: CreateSolidColorMaterial( scene, 117/255, 240/255, 240/255),
		PINK: CreateSolidColorMaterial( scene, 250/255, 158/255, 189/255),
		ORANGE: CreateSolidColorMaterial( scene, 247/255, 178/255, 110/255),
		INVISIBLE: CreateSolidColorMaterial( scene, 0, 0, 0, 0),
		BG: CreateSolidColorMaterial( scene, 20/255, 31/255, 31/255 ),
		FADE: CreateSolidColorMaterial( scene, 20/255, 31/255, 31/255, 0.5 ),
		FG: CreateSolidColorMaterial( scene, 235/255, 224/255, 224/255 )
	}
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
