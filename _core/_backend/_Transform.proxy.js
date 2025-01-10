/* ====================================== */
/*                                        */
/*         	 TRANSFORM NODE PROXY         */
/*                                        */
/* ====================================== */

// #define PROXY3D

export default class Transform extends Proxy {

	type = 'Transform'

	setup( data ) {


		this.uid = data.uid
		this.debug = data.debug

		this.$ensureExists()

		this.setPosition( data.position )
		this.setRotation( data.rotation )
		this.setScaling( data.scaling )
		
		return this.uid
	}

	$ensureExists() {

		if (!this.instance) {
			this.instance = new BB.TransformNode( this.uid )
			this.instance.position = new Vec3()
		}
	}

	setPosition( newPosition ) {

		this.$ensureExists()

		const isString = typeof newPosition === 'string'
		if (isString) {
			this.instance.position = this.$getWorldAbsolutePosition( newPosition )
		} else {
			newPosition = new Vec3(newPosition)
			this.instance.position.x = newPosition.x
			this.instance.position.y = newPosition.y
			this.instance.position.z = newPosition.z
		}
	}
	setRotation( rot ) {

		this.$ensureExists()

		rot = (new Vec3(...rot)).toArray()
		this.instance.rotation.x = rot[0]
		this.instance.rotation.y = rot[1]
		this.instance.rotation.z = rot[2]
	}
	setScaling( sca ) {

		this.$ensureExists()

		sca = (new Vec3(sca)).toArray()
		this.instance.scaling.x = sca[0]
		this.instance.scaling.y = sca[1]
		this.instance.scaling.z = sca[2]
	}

}


	// $triggerFromJunction( uid, note ) {
	// 	if (note === 'pointPosition') this.$syncPosition()
	// }

	// $syncPosition() {
	// 	const pos = Array.isArray(this.pointPosition) ? new Vec3(...this.pointPosition) : this.$getWorldAbsolutePosition( this.pointPosition )
	// 	if (!pos) return
	// 	this.instance.position.x = pos.x
	// 	this.instance.position.y = pos.y
	// 	this.instance.position.z = pos.z
	// 	this.$getPointJunctions().sendJunctionUpdate( this.uid )
	// }


	// setPosition( newPosition ) {
	// 	const isString = typeof newPosition === 'string'
	// 	if (isString) {
	// 		if (this.pointPosition) this.$getPointJunctions().removeJunction( this, this.pointPosition, 'pointPosition', false )
	// 		this.$getPointJunctions().setJunction( this, newPosition, 'pointPosition', debug )
	// 	}
	// 	this.pointPosition = newPosition
	// 	this.$syncPosition()
	// }
