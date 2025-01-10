/* ====================================== */
/*                                        */
/*         	        STORE                 */
/*                                        */
/* ====================================== */

// #define JAVASCRIPT

class MaterialsStore {

	// ------ MATERIALS ------

	materials = $state({})
	getMaterial(id) { return untrack( () => this.materials[id] ) }

	// ------ COLORS ------

	colors = $state({})
	getColor(id) { return untrack( () => this.colors[id] ) }

	// ------ TEXTURES ------

	textures = $state({})
	getTexture(id) { return untrack( () => this.textures[id] ) }



	constructor() {

	}
}

const store = new MaterialsStore()

export default store