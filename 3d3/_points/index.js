/* ====================================== */
/*                                        */
/*         	      VECTORS                 */
/*                                        */
/* ====================================== */

import { Vector2 as _Vector2 } from '@babylonjs/core'
import { Vector3 as _Vector3 } from '@babylonjs/core'
import { Vector4 as _Vector4 } from '@babylonjs/core'

import { MapRange } from '$_lib/lib.utils.js'

export const Vectors = {
	Vector2: _Vector2, 
	Vector3: _Vector3,
	Vector4:  _Vector4
}

// ------ RANDOMISE ------

function Randomise( min, max ) {
	this.x = MapRange( Math.random(), 0, 1, min, max )
	this.y = MapRange( Math.random(), 0, 1, min, max )
	this.z = MapRange( Math.random(), 0, 1, min, max )
	this.w = MapRange( Math.random(), 0, 1, min, max )
	return this
}

_Vector2.prototype.randomise = Randomise
_Vector3.prototype.randomise = Randomise
_Vector4.prototype.randomise = Randomise

// ------ MOVE TOWARD ------

function MoveToward( toward, distance ) {

	const direction = toward.subtract(this).normalize()
	const move = direction.scale(distance)
	return this.add( move )
}

_Vector2.prototype.moveToward = MoveToward
_Vector3.prototype.moveToward = MoveToward
_Vector4.prototype.moveToward = MoveToward


// ------ EXPORT OBJECT ------

/* gives a simple js object back */

function ToObject() {
	let out = {
		x: ( this.x ),
		y: ( this.y )
	}
	if (this.z !== undefined) out.z = ( this.z )
	if (this.w !== undefined) out.w = ( this.w )
	return out
 
}

_Vector2.prototype.toObject = ToObject
_Vector3.prototype.toObject = ToObject
_Vector4.prototype.toObject = ToObject

// ------ CREATE FROM ANYTHING ------

/* creates vector from number / object / array */

function GenerateCreateVector( type ) {

	return function ( initial ) {
		const vector = new Vectors[type]()
		const props = [ 'x', 'y', 'z', 'w' ]
		if (Array.isArray(initial)) {
			for (let i = 0; i < initial.length; i++) {
				vector[props[i]] = initial[i]
			}
		} else if ( typeof initial === 'object' ) {
			for (const [key,value] of Object.entries(initial)) {
				vector[key] = value
			}
		} else {
			const total = parseInt( type.replace('Vector', '') )
			for (let i = 0; i < total; i++) {
				vector[props[i]] = initial
			}
		}

		return vector
	}

}

_Vector2.CreateVector = GenerateCreateVector( 'Vector2' )
_Vector3.CreateVector = GenerateCreateVector( 'Vector3' )
_Vector4.CreateVector = GenerateCreateVector( 'Vector4' )
_Vector2.Create = GenerateCreateVector( 'Vector2' )
_Vector3.Create = GenerateCreateVector( 'Vector3' )
_Vector4.Create = GenerateCreateVector( 'Vector4' )



export const Vector2 = _Vector2
export const Vector3 = _Vector3
export const Vector4 = _Vector4

export const Point2 = _Vector2
export const Point3 = _Vector3
export const Point4 = _Vector4

export const Vec2 = _Vector2
export const Vec3 = _Vector3
export const Vec4 = _Vector4
