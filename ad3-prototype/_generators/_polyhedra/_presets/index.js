import * as PLATONIC from './lib.platonic.js'
import * as ARCHIMEDIAN from './lib.archimedean.js'

export const A = ARCHIMEDIAN
export const P = PLATONIC

const _initial = { 
	PLATONIC,
	ARCHIMEDIAN
}
const _presets = []
for (const [group, presets] of Object.entries(_initial)) {

	let index = 0
	for (const [ id, preset] of Object.entries(presets) ) {
		_presets.push({
			...preset,
			// id,
			group,
			index,
			title: `${group[0]} ${id.toLowerCase().replaceAll('_', ' ')} ${preset.formulas.map( sym => `(${sym[0]},${sym[1]},${sym[2]})`).join(' ')}`
		})

		index += 1
	}
}
export const PRESETS = _presets
export const presets = _presets
export * as POLYHEDRA from './defs.js'


export const TABLE = [

	[ [ P.CUBE, P.OCTAHEDRON ], [ P.TETRAHEDRON ], [ P.ICOSAHEDRON, P.DODECAHEDRON ] ],
	[ [ A.CUBOCTAHEDRON ], [ P.OCTAHEDRON ], [A.ICOSADODECAHEDRON] ],
	[ [ A.TRUNCATEDCUBE, A.TRUNCATEDOCTAHEDRON], [ A.TRUNCATEDTETRAHEDRON ], [A.TRUNCATEDICOSAHEDRON, A.TRUNCATEDDODECAHEDRON] ],
	[ [ A.SMALLRHOMBICUBOCTAHEDRON ], [A.CUBOCTAHEDRON], [A.SMALLRHOMBIICOSADODECAHEDRON] ],
	[ [ A.GREATRHOMBICUBOCTAHEDRON], [A.TRUNCATEDOCTAHEDRON], [A.GREATRHOMBIICOSADODECAHEDRON] ],
	[ [ A.SMALLRHOMBICUBOCTAHEDRON ] ],
	[ [A.GREATRHOMBICUBOCTAHEDRON] ],

]
