/* ====================================== */
/*                                        */
/*         	    POINT BACKEND             */
/*                                        */
/* ====================================== */

// #define WORKER

import ObjectJavascript from '../_engine/_Object.js'
import { Vec2, Vec3, Vec4 } from '$3d1_points'

export default class Point extends ObjectJavascript {

	init( x, y, z ) {
		SAY('INIT POINT', x, y, z)
		this.instance = new Vec3( x, y, z )
		this.send( 'onInited' )
	}

}


