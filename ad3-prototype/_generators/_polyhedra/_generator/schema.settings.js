export default {
	explode: {
		type: 'number',
		label: 'Explode',
		default: 0,
		min: 0,
		max: 10,
		step: 0.01
	},
	symbol: {
		type: 'array',
		label: 'Symbol',
		default: [2, 3, 3],
		description: 'the wythoff symbol'
	},
	symmetry: {
		type: 'array',
		label: 'Symmetry',
		description: 'wythoff reflection',
		default: [2, 2, 1]
	},
	snub: {
		type: 'boolean',
		label: 'Snub',
		description: 'snubification toggle',
		default: false
	},
	compound: {
		type: 'boolean',
		label: 'Compound',
		description: 'compounding toggle',
		default: false
	},
	stellate: {
		type: 'number',
		label: 'Stellate',
		description: 'stellation toggle',
		default: 0,
		min: 0,
		max: 4,
	},
	chiral: {
		type: 'boolean',
		label: 'Chiral',
		description: 'chiral operation toggle',
		default: false
	},
	hideFaces: {
		type: 'array',
		label: 'Hide Faces',
		description: 'specific face visibility',
		default: [false, false, false, false]
	},
	hemi: {
		type: 'boolean',
		label: 'Hemispherical',
		description: 'hemispherical transformation toggle',
		default: false
	},
	ifact: {
		type: 'number',
		label: 'IFact',
		default: 0
	},
	invertInc: {
		type: 'number',
		label: 'Invert',
		default: 0,
		min: -0.01,
		max: 0.01,
		description: 'invert faces'
	},
	theta: {
		type: 'number',
		label: 'Theta',
		default: 0
	},
	tourIndex: {
		type: 'number',
		label: 'Tour Number',
		default: 1
	},
	triangle: {
		type: 'array',
		label: 'Tri',
		description: 'interpolation triplet',
		default: [0,0,1],
		min: [0,0,0],
		max: [1,1,1]
	},
	triangleDepth: {
		type: 'number',
		label: 'Triangle Depth',
		default: 0,
		description: 'recursive sections'
	},
	useTri: {
		type: 'boolean',
		default: false,
		label: 'Use Tri'
	},
	tours: {
		type: 'array',
		default: [ // 2 * 2 * 2 = 8 positions (0 to 1) or 3 * 3 * 3 = 27 positions (-1 to 1)
			[ [-1, 0.5, 1] ], // can be set from query params
			[ [1,0,0],[1,1,0],[0,1,0],[0,1,1],[0,0,1],[1,0,1],[1,0,0],
			  [1,1,1],[1,1,0],[0,1,0],[1,1,1],[0,1,1],[0,0,1],[1,1,1],[1,0,1] ],
			[
				[-1,1,0],[0,1,0],[1,0,0],[1,-1,0],
				[-1,0,1],[0,0,1],[1,0,0],[1,0,-1],
				[0,-1,1],[0,0,1],[0,1,0],[0,1,-1],
				[1,-1,-1],[1,0,0],[0,1,1],[-1,1,1],
				[-1,1,-1],[0,1,0],[1,0,1],[1,-1,1],
				[-1,-1,1],[0,0,1],[1,1,0],[1,1,-1],
			], 
		]
	}
}
