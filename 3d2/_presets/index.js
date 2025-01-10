import { default as platonic } from './lib.platonic.js'
import { default as archimedean } from './lib.archimedean.js'
import { default as catalan } from './lib.catalan.js'

export const presets = [

	// ADD GROUPS AND GROUP INDEXES

	...platonic.map((preset,groupIndex) => ({ ...preset, group: 'platonic', groupIndex })),
	...archimedean.map((preset,groupIndex) => ({ ...preset, group: 'archimedean', groupIndex })),
	// ...catalan.map((preset,groupIndex) => ({ ...preset, group: 'catalan', groupIndex })),
	// ...catalan.map((preset,groupIndex) => ({ ...preset, group: 'catalan', groupIndex }))
].map( (preset, presetIndex) => {

	// FIND COMMON FORMULAS

	preset.commonFormula = preset.formula.filter(v=>!isNaN(v)).sort((a,b)=>a-b)
	preset.commonInteger = preset.commonFormula[2]
	preset.frequency = preset.commonFormula[2]
	preset.commonIndex = preset.formula.indexOf(preset.commonInteger)
	preset.presetIndex = presetIndex
	return preset

})

export default presets
