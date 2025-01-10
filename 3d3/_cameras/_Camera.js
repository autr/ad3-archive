/* ====================================== */
/*                                        */
/*         	    SCENE BACKEND             */
/*                                        */
/* ====================================== */

// #define WORKER

import ObjectJavascript from '../_engine/_Object.js'
import { Camera as CameraInstance } from '@babylonjs/core'
import { CreateCamera } from './lib.cameras.js'

export default class Camera extends ObjectJavascript {


	init( props ) {
		if (this.instance) this.instance.dispose()
		this.instance = CreateCamera( this, props )
		this.setMisc()
		this.send('onInited')
		this.syncProps()
	}


	setControlsEnabled( enabled ) {
		if (enabled) this.instance.attachControl( self.canvas, true )
		if (!enabled) this.instance.detachControl()
		this.say(`🛂 set controls: ${enabled}`)
	}

	setOrthographic( ortho ) {

		if (ortho) {
			this.say('👁️ orthographic 👁️')

			const w = this.getEngineWidth()
			const h = this.getEngineHeight()
			const aspect = w / h
			const halfHeight = this.instance.position.z / 2.5
			const halfWidth = halfHeight * aspect

			this.instance.mode = CameraInstance.ORTHOGRAPHIC_CAMERA
			this.instance.orthoTop = halfHeight
			this.instance.orthoBottom = -halfHeight
			this.instance.orthoLeft = -halfWidth
			this.instance.orthoRight = halfWidth

		} else {
			this.say('👁️ perspective 👁️')
			this.instance.mode = CameraInstance.PERSPECTIVE_CAMERA
		}
	}

	setMisc() {

		this.instance.multiTouchPanning = true
		// this.instance.multiTouchPanAndZoom = false

		this.instance.pinchZoom = true
		this.instance.useNaturalPinchZoom = true
		// this.instance.inertia = 0.99 // this works

		this.instance.minZ = 0.1 // TODO
		// this.instance.this.#scene.clipPlane = // TODO

		// this.instance.inertiaPanningX = 0
		// this.instance.inertiaPanningY = 0

		// this.instance.wheelDeltaPercentage = 0
		// this.instance.wheelPrecision = 0
	}
}