
// #define JAVASCRIPT

import { Vec2, Vec3 } from '$ad3/_Vec.js'
import { MapRange } from '$_lib'
export { polygonContains as PolygonContains } from 'd3-polygon'
export { polygonHull as PolygonHull } from 'd3-polygon'
export { polygonArea as PolygonArea } from 'd3-polygon'
export { polygonLength as PolygonLength } from 'd3-polygon'
export { polygonCentroid as PolygonCentroid } from 'd3-polygon'


export function GenerateUID( id, refs ) {

	const type = refs?.size ? 'map' : 'object'
	let uid = id
	let idx = 1
	while ( type === 'map' ? refs.has(uid) : refs[uid] !== undefined ) {
		idx += 1
		uid = id + idx
	}
	return uid
}


export function GetPreciseCoordinate(e, element, cropRange) {
	if (!e) e = {}
	let { clientX, clientY, target } = e

	if (!element?.getBoundingClientRect) {
		SAY(`🚨 no client rect for:`, element)
		return null
	}

	const box = element.getBoundingClientRect()
	if (!clientX) clientX = box.left + (box.width/2)
	if (!clientY) clientY = box.top + (box.height/2)

	const x = MapRange(clientX,box.left,box.left+box.width,0,box.width, cropRange)
	const y = MapRange(clientY,box.top,box.top+box.height,0,box.height, cropRange)

	const normX = MapRange( x, 0, box.width, 0, 1 )
	const normY = MapRange( y, 0, box.height, 0, 1 )

	return { x, y, target, e, areaWidth: box.width, areaHeight: box.height, normX, normY }
}

export function FindIntersection(pointA, pointB, mesh, scene, iterationLimit = 1000) {
	let isAoccluded = false
	let isBoccluded = false

	for (let i = 0; i < iterationLimit; i++) {
		const middlePoint = Vec3.Lerp(pointA, pointB, 0.5)
		const direction = middlePoint.subtract(pointA).normalize()
		const ray = new BB.Ray(pointA, direction, Vec3.Distance(pointA, pointB))
		const hit = scene.pickWithRay(ray, mesh)

		if (hit.hit) { 
			pointB = middlePoint
			isBoccluded = true
		} else {
			pointA = middlePoint
			isAoccluded = true
		}

		if (Vec3.Distance(pointA, pointB) < 0.0001) {
			return { intersectionPoint: middlePoint, isAoccluded, isBoccluded }
		}
	}

	return { intersectionPoint: null, isAoccluded, isBoccluded }
}
