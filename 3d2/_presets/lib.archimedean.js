import { 
	TETRA,
	CUB,
	HEXA,
	PENTA,
	OCTA ,
	DODECA ,
	ICOSA ,
	HEDRON,
	TRUNCATED,
	RHOMBI ,
	SNUB ,
	GREAT ,
	SMALL
} from '../defs.js'

export default [
	{ 
		formula: [ 2, '|', 3, 4 ],
		formulaInterp: [0],
		id: 'cuboctahedron',
		names: [
			[ CUB, OCTA, HEDRON ]
		],
		description: '3 squares and a triangle meet at each vertex (Cuboctahedron)',
		stats: {
			faces: {
				TETRA: 8,
				CUB: 6
			},
			vertices: 12,
			edges: 24,
		},
		symbols: [
			[3, 0, 0, 1],
			[4, 1, 0, 0]
		]
	},
	{ 
		formula: [ 2, '|', 3, 5 ],
		id: 'icosidodecahedron',
		formulaInterp: [0],
		names: [
			[ ICOSA, DODECA, HEDRON ]
		],
		description: '3 triangles and 2 pentagons meet at each vertex (Icosidodecahedron)',
		stats: {
			faces: {
				TETRA: 20,
				PENTA: 12,
			},
			vertices: 30,
			edges: 60,
		},
		symbols: [
			[ 5, 1, 0, 0 ]
		]
	},
	{ 
		formula: [ 2, 3, '|', 3 ],
		formulaInterp: [1],
		id: 'truncatedTetrahedron',
		names: [
			[ TRUNCATED, TETRA, HEDRON ]
		],
		description: '3 triangles meet at each vertex (Truncated tetrahedron)',
		stats: {
			faces: {
				TETRA: 4,
				HEXA: 4

			},
			vertices: 12,
			edges: 18,
		},
		symbols: [
			[ 3, 1, 0, 1 ],
			[ 3, 1, 1, 0 ],
		]
	},
	{ 
		formula: [ 2, 4, '|', 3 ],
		formulaInterp: [5],
		id: 'truncatedOctahedron',
		names: [
			[ TRUNCATED, OCTA, HEDRON ]
		],
		description: '2 triangles and 2 squares meet at each vertex (Truncated octahedron)',
		stats: {
			faces: {
				CUB: 6,
				HEXA: 8,
			},
			vertices: 24,
			edges: 36,
		},
		symbols: [
			[3, 1, 1, 1],
			[4, 1, 0, 1]
		]
	},
	{ 
		formula: [ 2, 3, '|', 4 ],
		formulaInterp: [1],
		id: 'truncatedCube',
		names: [
			[ TRUNCATED, CUB ]
		],
		description: '3 triangles and a square meet at each vertex (Truncated cube)',
		stats: {
			faces: {
				TETRA: 8,
				OCTA: 6
			},
			vertices: 24,
			edges: 36,
		},
		symbols: [
			[ 4, 1, 1, 0 ]
		]
	},
	{ 
		formula: [ 2, 5, '|', 3 ],
		formulaInterp: [5],
		id: 'truncatedIcosahedron',
		names: [
			[ TRUNCATED, ICOSA, HEDRON ]
		],
		description: '2 triangles and 2 pentagons meet at each vertex (Truncated icosahedron)',
		stats: {
			faces: {
				PENTA: 12,
				HEXA: 20,
			},
			vertices: 60,
			edges: 90,
		},
		symbols: [
			[ 5, 1, 0, 1 ]
		]
	},
	{ 
		formula: [ 2, 3, '|', 5 ],
		formulaInterp: [1],
		id: 'truncatedDodecahedron',
		names: [
			[ TRUNCATED, DODECA, HEDRON ]
		],
		description: '3 triangles and a pentagon meet at each vertex (Truncated dodecahedron)',
		stats: {
			faces: {
				TETRA: 20,
				DECA: 12,
			},
			vertices: 60,
			edges: 90,
		},
		symbols: [
			[ 5, 1, 1, 0 ]
		]
	},
	{ 
		formula: [ 3, 4, '|', 2 ],
		formulaInterp: [1],
		id: 'smallRhombicuboctahedron',
		names: [
			[ SMALL, RHOMBI, CUB, OCTA, HEDRON ],
			[ RHOMBI, CUB, OCTA, HEDRON ],
		],
		description: '2 squares, a triangle and a rectangle meet at each vertex (Rhombicuboctahedron)',
		stats: {
			faces: {
				TETRA: 8,
				CUB: 18,
			},
			vertices: 24,
			edges: 48,
		},
		symbols: [
			[ 4, 0, 1, 0 ]
		]
	},
	{ 
		formula: [ 3, 5, '|', 2 ],
		formulaInterp: [1],
		id: 'smallRhombicosidodecahedron',
		names: [
			[ SMALL, RHOMBI, ICOSA, DODECA, HEDRON ],
			[ RHOMBI, ICOSA, DODECA, HEDRON ],
		],
		description: '2 pentagons, a triangle, and a rectangle meet at each vertex (Rhombicosidodecahedron)',
		stats: {
			faces: {
				TETRA: 20,
				CUB: 30,
				PENTA: 12
			},
			vertices: 60,
			edges: 120,
		},
		symbols: [
			[ 5, 0, 1, 1 ]
		]
	},
	{ 
		formula: [ 2, 3, 4, '|' ],
		formulaInterp: [7],
		id: 'greatRhombicuboctahedron',
		names: [
			[ GREAT, RHOMBI, CUB, OCTA, HEDRON ],
			[ TRUNCATED, CUB, OCTA, HEDRON ],
		],
		description: '2 triangles, a square, and a hexagon meet at each vertex (Truncated cuboctahedron)',
		stats: {
			faces: {
				CUB: 12,
				HEXA: 8,
				OCTA: 6
			},
			vertices: 48,
			edges: 72,
		},
		symbols: [
			[ 4, 1, 1, 1 ]
		]
	},
	{ 
		formula: [ 2, 3, 5, '|' ],
		formulaInterp: [7],
		id: 'greatRhombicosidodecahedron',
		names: [
			[ GREAT, RHOMBI, ICOSA, DODECA, HEDRON ],
			[ TRUNCATED, ICOSA, DODECA, HEDRON ],
		],
		description: '2 triangles, a pentagon, and a decagon meet at each vertex (Truncated icosidodecahedron)',
		stats: {
			faces: {
				CUB: 30,
				HEXA: 20,
				DECA: 12
			},
			vertices: 120,
			edges: 180,
		},
		symbols: [
			[ 5, 1, 1, 1 ]
		]
	},
	{ 
		formula: [ '|', 2, 3, 4 ],
		formulaInterp: [7],
		formulaSnub: true,
		id: 'snubCube',
		names: [
			[ SNUB, CUB ],
			[ SNUB, CUB, OCTA, HEDRON ],
		],
		description: 'Snub form (Snub cube)',
		stats: {
			faces: {
				TETRA: 32,
				CUB: 6,
			},
			vertices: 24,
			edges: 60,
		},
		symbols: [],
		snub: true
	},
	{ 
		formula: [ '|', 2, 3, 5 ],
		formulaInterp: [7],
		formulaSnub: true,
		id: 'snubDodecahedron',
		names: [
			[ SNUB, DODECA, HEDRON ],
			[ SNUB, ICOSA, DODECA, HEDRON ]
		],
		description: 'Snub form (Snub dodecahedron)',
		stats: {
			faces: {
				TETRA: 80,
				PENTA: 12,
			},
			vertices: 60,
			edges: 150,
		},
		symbols: [],
		snub: true
	}
]