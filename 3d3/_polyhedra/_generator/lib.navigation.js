
import { CreateLogger } from '$lib/lib.essential.js'
const SAY = CreateLogger(import.meta.url)

const KEY_ANGLES = { 'ArrowUp': 270, 'ArrowDown': 90, 'ArrowLeft': 180, 'ArrowRight': 0 }

import presets from '$3d2_presets'

export function findPresetBySchwarzFormula( triangle, generator, snub ) {

	const filtered = presets.filter( preset => {
		let yes = false 
		if (!preset.symbols) {
			SAY(`❌ THIS PRESET DOES NOT HAVE SYMBOLS`, preset)
		} else {
			for (const [gen,x,y,z] of preset.symbols ) {
				// console.log({gen,x,y,z}, triangle, generator)
				const sameGen = (gen == generator )
				const sameTri = (x == triangle.x && y == triangle.y && z == triangle.z)
				if (sameGen && sameTri ) yes = true
			}
		}
		return yes
	})

	if (filtered.length > 1) SAY(`❌ DUPLICATE PRESETS`, filtered)
	return filtered?.[0]
}
export function absolutePositionToScreen( scene, position ) {

	const engine = scene.getEngine()
	const width = engine.getRenderWidth()
	const height = engine.getRenderHeight()
	
	const point = BB.Vector3.Project(
		position,
		BB.Matrix.Identity(),
		scene.getTransformMatrix(),
		{ x: 0, y: 0, width, height }
	)
	return point
}

export function getDistanceAndAngle( scene, mesh, screenPosition ) {
	const point = absolutePositionToScreen( scene, mesh.getAbsolutePosition() )
	const distance = Math.sqrt(Math.pow(point.x - screenPosition.x, 2) + Math.pow(point.y - screenPosition.y, 2))
	let angle = Math.atan2(point.y - screenPosition.y, point.x - screenPosition.x) * 180 / Math.PI
	angle = (angle - KEY_ANGLES[type] + 360) % 360
	angle = angle > 180 ? 360 - angle : angle // ensure angle is within [-180, 180] range
	const angleDiff = Math.abs(angle)
	return { distance, angle, angleDiff }
}

export function findMeshByKeyboard(scene, type, currentMesh, meshes ) {

	if (Object.keys(KEY_ANGLES).indexOf(type) == -1) return null

	if (!value.mesh) {
		value.mesh = meshes.find(mesh => {
			return mesh.position.x === value.x && mesh.position.y === value.y && mesh.position.z === value.z
		})
	}

		
	const balance = 1
	const screenPosition = absolutePositionToScreen( scene, currentMesh.getAbsolutePosition() )

	let maxDistance = 0
	let minDiff = Infinity
	let closestMesh = null


	for (const mesh of meshes) {
		const { distance } = getDistanceAndAngle( scene, mesh, screenPosition )
		if (distance > maxDistance) maxDistance = distance
	}

	for (const mesh of meshes) {
		if (mesh !== currentMesh) {

			const { distance, angle, angleDiff } = getDistanceAndAngle( scene, mesh, screenPosition )

			let distanceScaled = distance / maxDistance 
			const combinedDiff = distance + angleDiff
			if (combinedDiff < minDiff) {
				minDiff = combinedDiff
				closestMesh = mesh
			}
		}
	}

	return closestMesh
}