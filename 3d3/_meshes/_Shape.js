/* ====================================== */
/*                                        */
/*         	     SHAPE WORKER             */
/*                                        */
/* ====================================== */

// #define WORKER

import Object from '../_engine/_Object.js'
import { MeshBuilder } from '@babylonjs/core'

export default class Shape extends Object {

	init( config ) {
		if (this.instance) this.instance.dispose()
		this.say(`🏞️ shape: ${config.type}`)
		this.instance = new MeshBuilder[config.method]( config.id, config, this.getScene() )
		this.send('onInited')
		this.syncProps()
	}
}