/* ====================================== */
/*                                        */
/*         	      VECTORS                 */
/*                                        */
/* ====================================== */


// #define JAVASCRIPT

import { Vector2, Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector.js'
import { MapRange } from '$_lib/lib.utils.js'

export function ExpandConstructorArguments( total, first, second, third, fourth ) {

	if (Array.isArray(first)) return first

	let output = []

	if (typeof first === 'number') {
		const standard = [ first, second, third, fourth ]
		let previous = first
		for ( let i = 0; i < total; i++ ) {
			const isUndef = standard[i] !== undefined
			const value = isUndef ? standard[i] : previous
			output.push( value )
			previous = value
		}
		return output
	}

	const x = first?.x !== undefined
	const y = first?.y !== undefined
	const z = first?.z !== undefined
	const w = first?.w !== undefined

	if (x) output.push(first.x)
	// if (!x && (y || z || w)) output.push( 0 )
	if (y) output.push(first.y)
	// if (!y && (z || w)) output.push( 0 )
	if (z) output.push(first.z)
	// if (!z && (w)) output.push( 0 )
	if (w) output.push(first.w)

	return output

}

export function RandomiseVectorInstance( object, total, min, max ) {
	object.x = MapRange( Math.random(), 0, 1, min, max )
	if (total > 1) object.y = MapRange( Math.random(), 0, 1, min, max )
	if (total > 2) object.z = MapRange( Math.random(), 0, 1, min, max )
	if (total > 3) object.w = MapRange( Math.random(), 0, 1, min, max )
	return object
}

export function MoveVectorInstanceToward( object, target, distance ) {

	const direction = target.subtract(object).normalize()
	const move = direction.scale(distance)
	return object.add( move )
}

export function BlendVec3( object, destination, smoothing ) {

	object.x = (object.x * smoothing) + (destination.x * (1-smoothing))
	object.y = (object.y * smoothing) + (destination.y * (1-smoothing))
	object.z = (object.z * smoothing) + (destination.z * (1-smoothing))

	return object
}

export function GenerateObject( object ) {
	let output = {}
	if (object.x !== undefined) output.x = Number( object.x )
	if (object.y !== undefined) output.y = Number( object.y )
	if (object.z !== undefined) output.z = Number( object.z )
	if (object.w !== undefined) output.w = Number( object.w )
	return output 
}
export function GenerateArray( object ) {
	let output = []
	if (object.x !== undefined) output[0] = Number( object.x )
	if (object.y !== undefined) output[1] = Number( object.y )
	if (object.z !== undefined) output[2] = Number( object.z )
	if (object.w !== undefined) output[3] = Number( object.w )
	return output 
}

export class Vec2 extends Vector2 {
	constructor( x, y ) {
		super( ...ExpandConstructorArguments( 2, x, y ) )
	}
	randomise( min, max ) {
		return RandomiseVectorInstance( this, 2, min, max )
	}
	moveToward( target, distance ) {
		return MoveVectorInstanceToward( this, target, distance )
	}
	toObject() {
		return GenerateObject( this )
	}
	toArray() {
		return GenerateArray( this )
	}
	distance( to ) {
		return Vector2.Distance( this, to )
	}
}

export class Vec3 extends Vector3 {
	constructor( x, y, z ) {
		const args = ExpandConstructorArguments( 3, x, y, z )
		super( ...args )
	}
	randomise( min, max ) {
		return RandomiseVectorInstance( this, 3, min, max )
	}
	moveToward( target, distance ) {
		return MoveVectorInstanceToward( this, target, distance )
	}
	toObject() {
		return GenerateObject( this )
	}
	toArray() {
		return GenerateArray( this )
	}
	distance( to ) {
		return Vector3.Distance( this, to )
	}
	blend( destination, smoothing = 1, modulus ) {
		return BlendVec3( this, destination, smoothing, modulus )
	}
	clone() {
		return new Vec3( Number(this.x), Number(this.y), Number(this.z) )
	}
}

// Vec3.prototype.Centroid = vectors => {
// 	return vectors.reduce((prev, curr) => {
// 	    return prev.add(curr);
// 	}, Vector3.Zero()).scale(1 / vectors.length)
// }


export class Vec4 extends Vector4 {
	constructor( x, y, z, w ) {
		super( ...ExpandConstructorArguments( 4, x, y, z, w ) )
	}
	randomise( min, max ) {
		return RandomiseVectorInstance( this, 4, min, max )
	}
	moveToward( target, distance ) {
		return MoveVectorInstanceToward( this, target, distance )
	}
	toObject() {
		return GenerateObject( this )
	}
	toArray() {
		return GenerateArray( this )
	}
	distance( to ) {
		return Vector4.Distance( this, to )
	}
}

globalThis.Vec2 = Vec2
globalThis.Vec3 = Vec3
globalThis.Vec4 = Vec4
