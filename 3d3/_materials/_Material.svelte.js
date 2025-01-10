
/* ====================================== */
/*                                        */
/*         	      MATERIAL                */
/*                                        */
/* ====================================== */

import { StandardMaterial, Color4 } from '@babylonjs/core'
import { colorspaces } from '$gui_color'
import { MapRange } from '$_lib/lib.utils.js'
import store from './store.svelte.js'

// #define JAVASCRIPT

function ConvertStringToColor(str) {
	const pattern = /(\w+)\(([^)]*)\)/
	const match = str.match(pattern)
	if (match) {

		// ------ MATCHED BRACKETS ------

		const id = (match[1] || '').toLowerCase()
		const values = match[2].split(',').map(arg => arg.trim())

		if ( id && colorspaces[id] ) {

			// ------ FIND CRITERIA ------

			const isRGB = id.includes('rgb')
			const isHS = id.includes('hs')
			let usesPercentages = false
			let usesDecimals = false
			let usesNormalised = true
			const space = colorspaces[id]

			for (const value of values) {
				if (value.includes('%')) usesPercentages = true
				if (value.includes('.')) usesDecimals = true
				if (parseFloat(value) > 1) usesNormalised = false
			}

			// ------ CONVERT WITH DIVISOR ------

			const processed = values.map( (value,idx) => {

				let divisor = 1
				if (isRGB && !usesNormalised && !usesDecimals) divisor = 255
				if (isHS && idx === 0 && !usesNormalised && usesPercentages) divisor = 360
				if (isHS && idx !== 0 && !usesNormalised && usesPercentages) divisor = 100
				if (!isHS && !isRGB && (usesPercentages && !usesNormalised)) divisor = 100
				if (idx === 3) {
					return parseFloat( value )
				} else {
					return MapRange( parseFloat( value ) / divisor, 0, 1, space.min[idx], space.max[idx] )
				}
			})


			if (isRGB) {
				SAY(`🎨 RGB ${processed.map(num=>num)}`)
				return new Color4( ...processed )
			}

			const converted = space.rgb(processed)
			// const converted = colorspaces.rgb[id](processed)

			SAY(`🎨 ${id.toUpperCase()} ${processed.map(num=>Math.round(num))} -> RGB ${converted.map(num=>Math.round(num) )}`)

			return new Color4( ...converted.map(num=>Math.round(num / 255)) )
		}




	}
	return false
}


export default class _Material extends Component {	

	setMaterialProperty( which, input ) {
		if (typeof input === 'string' ) {

			SAY(`${which}`)
			const neu = ConvertStringToColor( input )
			const color = store.getColor( input )
			const texture = store.getTexture( input )

			if (color) {
				this.instance[which+'Color'] = color
				this.instance[which+'Texture'] = null
			} else if (texture) {

				this.instance[which+'Color'] = new Color4(1,1,1,1)
				this.instance[which+'Texture'] = texture
			} else if (neu) {
				this.instance[which+'Color'] = neu
				this.instance[which+'Texture'] = null
			} else {
				SAY(`❌ ${this.state.id} ${which} "${input}"`)
			}
		}
	}
	
	constructor( id, collection ) {
		super( id, collection )
		this.instance = new StandardMaterial()
		this.instance.backFaceCulling = false

		$effect( () => this.setMaterialProperty( 'diffuse', this.state.diffuse ) )
		$effect( () => this.setMaterialProperty( 'specular', this.state.specular ) )
		$effect( () => this.setMaterialProperty( 'emissive', this.state.emissive ) )
		$effect( () => this.setMaterialProperty( 'ambient', this.state.ambient ) )
		$effect( () => {
			this.instance.wireframe = this.state.wireframe
		})
	}

}