/* ====================================== */
/*                                        */
/*         	    SCENE BACKEND             */
/*                                        */
/* ====================================== */

// #define WORKER

import Object from '../_engine/_Object.js'
import { Color4, HemisphericLight, Vector3 } from '@babylonjs/core'
import { Scene as SceneInstance } from '@babylonjs/core'

// import '@babylonjs/core/Debug/debugLayer'
// import '@babylonjs/inspector'

export default class Scene extends Object {

	init() {

		const engine = this.getEngine()
		this.instance = new SceneInstance( engine.getInstance() )

		const light = new HemisphericLight("light", new Vector3(0, 10, 0), this.instance)
		light.intensity = 1

		this.instance.clearColor = new Color4(0, 0, 0, 1)
	    this.instance.getBoundingBoxRenderer().frontColor.set(1, 0, 0);
	    this.instance.getBoundingBoxRenderer().backColor.set(0, 1, 0);
		this.instance.getEngine().setDepthFunctionToLessOrEqual()

		this.say(`🖼 created scene: ${this.id()}`)
		this.send('onInited')

	}

	showInspector( value ) {
		// if (!this.instance) return
		// this.instance.debugLayer[value ? 'show' : 'hide' ]()
		// if (this.debug) SAY(`🔎 INSPECTOR: ${value ? 'SHOW' : 'HIDE'}`)
	}
}

