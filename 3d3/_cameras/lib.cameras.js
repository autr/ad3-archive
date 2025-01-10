/* ====================================== */
/*                                        */
/*         	       CAMERAS                */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT


import { Vec3 } from '$3d1_points' 

import { 
	ArcRotateCamera, 
	FreeCamera, 
	UniversalCamera, 
	FlyCamera, 
	ArcFollowCamera, 
	FollowCamera, 
	TargetCamera, 
	TouchCamera, 
	WebXRCamera, 
	AnaglyphArcRotateCamera, 
	AnaglyphFreeCamera, 
	AnaglyphUniversalCamera, 
	StereoscopicArcRotateCamera, 
	StereoscopicFreeCamera, 
	StereoscopicUniversalCamera } from '@babylonjs/core'

const cameras = new Map()

cameras.set( ArcRotateCamera, ['id', 'alpha', 'beta', 'radius', 'target', 'scene'] )
cameras.set( FreeCamera, ['id', 'position', 'scene'] )
cameras.set( UniversalCamera, ['id', 'position', 'scene'] )
cameras.set( FlyCamera, ['id', 'position', 'scene'] )
cameras.set( ArcFollowCamera, ['id', 'alpha', 'beta', 'radius', 'target', 'scene'] )
cameras.set( FollowCamera, ['id', 'position', 'target', 'scene'] )
cameras.set( TargetCamera, ['id', 'position', 'scene'] )
cameras.set( TouchCamera, ['id', 'position', 'scene' ] )
cameras.set( WebXRCamera, ['id', 'scene', 'xr'] ) // XR SESSION
cameras.set( AnaglyphArcRotateCamera, ['id', 'alpha', 'beta', 'radius', 'target', 'interaxial', 'scene'] )
cameras.set( AnaglyphFreeCamera, ['id', 'position', 'interaxial', 'scene'] )
cameras.set( AnaglyphUniversalCamera, ['id', 'position', 'interaxial', 'scene'] )
cameras.set( StereoscopicArcRotateCamera, ['id', 'alpha', 'beta', 'radius', 'target', 'interaxial', 'sidebyside', 'scene'] )
cameras.set( StereoscopicFreeCamera, ['id', 'position', 'interaxial', 'sidebyside', 'scene'] )
cameras.set( StereoscopicUniversalCamera, ['id', 'position', 'interaxial', 'sidebyside'] )

export function CreateCamera( object, props ) {
	for (const [constructor, config] of cameras.entries()) {
		const name = constructor.name.replace('Camera','').replaceAll('_','').toLowerCase()
		
		if (name === props.type ) {
			let args = {}

			const position = object.getTarget( props.position, Vec3.Create( props.position ) )
			const scene = object.getScene()
			const target = object.getTarget( props.target )

			for (const key of config) {
				if (key === 'id') {
					args[key] = object.id()
				} else if (key === 'scene') {
					args[key] = scene
				} else if (key === 'target') {
					args[key] = target
				} else if (key === 'position') {
					args[key] = position
				} else if (key === 'radius') {
					args[key] = position.z
				} else {
					args[key] = props[key]
				}
			}
			args = Object.values( args )
			object.say(`🎞️ ${props.type} camera` )
			return new constructor( ...Object.values(args) )
			

		}
	}
}