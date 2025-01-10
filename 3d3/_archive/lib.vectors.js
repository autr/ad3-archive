import { BB } from '$3d/lib.babylon.js'

// returns center point (ie. on a polygon face)

export function getCenterFromPoints( points ) {
	return points.reduce((acc, point) => acc.add(point), BB.Vector3.Zero()).scale(1 / points.length)
}
