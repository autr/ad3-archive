/* ====================================== */
/*                                        */
/*                 TWEEN                  */
/*                                        */
/* ====================================== */

import { Vec2, Vec3, Vec4 } from '$ad3'
import { MapRange } from '$root/lib.utils.js'


// NameOfAnimation( speed, origin, destination, callbacl finished )

export const easings = {
	// no easing, no acceleration
	linear: t => t,
	// accelerating from zero velocity
	easeInQuad: t => t*t,
	// decelerating to zero velocity
	easeOutQuad: t => t*(2-t),
	// acceleration until halfway, then deceleration
	easeInOutQuad: t => t<.5 ? 2*t*t : -1+(4-2*t)*t,
	// accelerating from zero velocity 
	easeInCubic: t => t*t*t,
	// decelerating to zero velocity 
	easeOutCubic: t => (--t)*t*t+1,
	// acceleration until halfway, then deceleration 
	easeInOutCubic: t => t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1,
	// accelerating from zero velocity 
	easeInQuart: t => t*t*t*t,
	// decelerating to zero velocity 
	easeOutQuart: t => 1-(--t)*t*t*t,
	// acceleration until halfway, then deceleration
	easeInOutQuart: t => t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t,
	// accelerating from zero velocity
	easeInQuint: t => t*t*t*t*t,
	// decelerating to zero velocity
	easeOutQuint: t => 1+(--t)*t*t*t*t,
	// acceleration until halfway, then deceleration 
	easeInOutQuint: t => t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t
}


const animate = {}
for (const [name, method] of Object.entries(easings)) {
	animate[name] = (speed, origin, destination, callback, finished) => {

		// if (!browser) return

		function convertBabylon( val ) {
			const lookup = [
				{
					type: Vec2,
					keys: ['x','y']	
				},
				{
					type: Vec3,
					keys: ['x','y','z']	
				},
				{
					type: Vec4,
					keys: ['x','y','z','w']	
				}
			]
			for (const {type,keys} of lookup) {
				if (val instanceof type) {
					let obj = {}
					for (const key of keys) obj[key] = val[key]
					return obj
				}
			}
			return val
		}

		origin = convertBabylon( origin )
		destination = convertBabylon( destination )

		let ref = null
		let proceed = true
		let animation = 0

		function tick() {
			animation = Math.min( 1, animation + speed )
			const norm = easings[name](animation)
			const value = MapRange(norm, 0, 1, origin, destination)
			if (callback) value == 1 ? callback(destination) : callback( value )
			if (animation >= 1 && finished) finished() 
			if (proceed && animation < 1) ref = window.requestAnimationFrame( tick )
		}

		ref = window.requestAnimationFrame( tick )

		return {
			cancel: () => {
				proceed = false
				if (ref) window.cancelAnimationFrame( ref )
			},
			speed,
			origin,
			destination
		}
	}
}

export const Animate = animate



