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
		id: 'cuboctahedron',
		names: [
			[ CUB, OCTA, HEDRON ]
		],
		description: '3 squares and a triangle meet at each vertex (Cuboctahedron)',
		symbols: [
			[3, 0, 0, 1],
			[4, 1, 0, 0]
		]
	},
	{ 
		formula: [ 2, '|', 3, 5 ],
		id: 'icosidodecahedron',
		names: [
			[ ICOSA, DODECA, HEDRON ]
		],
		description: '3 triangles and 2 pentagons meet at each vertex (Icosidodecahedron)',
		symbols: [
			[ 5, 1, 0, 0 ]
		]
	},
	{ 
		formula: [ 2, 3, '|', 3 ],
		id: 'truncatedTetrahedron',
		names: [
			[ TRUNCATED, TETRA, HEDRON ]
		],
		description: '3 triangles meet at each vertex (Truncated tetrahedron)',
		symbols: [
			[ 3, 1, 0, 1 ],
			[ 3, 1, 1, 0 ],
		]
	},
	{ 
		formula: [ 2, 4, '|', 3 ],
		id: 'truncatedOctahedron',
		names: [
			[ TRUNCATED, OCTA, HEDRON ]
		],
		description: '2 triangles and 2 squares meet at each vertex (Truncated octahedron)',
		symbols: [
			[3, 1, 1, 1],
			[4, 1, 0, 1]
		]
	},
	{ 
		formula: [ 2, 3, '|', 4 ],
		id: 'truncatedCube',
		names: [
			[ TRUNCATED, CUB ]
		],
		description: '3 triangles and a square meet at each vertex (Truncated cube)',
		symbols: [
			[ 4, 1, 1, 0 ]
		]
	},
	{ 
		formula: [ 2, 5, '|', 3 ],
		id: 'truncatedIcosahedron',
		names: [
			[ TRUNCATED, ICOSA, HEDRON ]
		],
		description: '2 triangles and 2 pentagons meet at each vertex (Truncated icosahedron)',
		symbols: [
			[ 5, 1, 0, 1 ]
		]
	},
	{ 
		formula: [ 2, 3, '|', 5 ],
		id: 'truncatedDodecahedron',
		names: [
			[ TRUNCATED, DODECA, HEDRON ]
		],
		description: '3 triangles and a pentagon meet at each vertex (Truncated dodecahedron)',
		symbols: [
			[ 5, 1, 1, 0 ]
		]
	},
	{ 
		formula: [ 3, 4, '|', 2 ],
		id: 'smallRhombicuboctahedron',
		names: [
			[ SMALL, RHOMBI, CUB, OCTA, HEDRON ],
			[ RHOMBI, CUB, OCTA, HEDRON ],
		],
		description: '2 squares, a triangle and a rectangle meet at each vertex (Rhombicuboctahedron)',
		symbols: [
			[ 4, 0, 1, 0 ]
		]
	},
	{ 
		formula: [ 3, 5, '|', 2 ],
		id: 'smallRhombicosidodecahedron',
		names: [
			[ SMALL, RHOMBI, ICOSA, DODECA, HEDRON ],
			[ RHOMBI, ICOSA, DODECA, HEDRON ],
		],
		description: '2 pentagons, a triangle, and a rectangle meet at each vertex (Rhombicosidodecahedron)',
		symbols: [
			[ 5, 0, 1, 1 ]
		]
	},
	{ 
		formula: [ 2, 3, 4, '|' ],
		id: 'greatRhombicuboctahedron',
		names: [
			[ GREAT, RHOMBI, CUB, OCTA, HEDRON ],
			[ TRUNCATED, CUB, OCTA, HEDRON ],
		],
		description: '2 triangles, a square, and a hexagon meet at each vertex (Truncated cuboctahedron)',
		symbols: [
			[ 4, 1, 1, 1 ]
		]
	},
	{ 
		formula: [ 2, 3, 5, '|' ],
		id: 'greatRhombicosidodecahedron',
		names: [
			[ GREAT, RHOMBI, ICOSA, DODECA, HEDRON ],
			[ TRUNCATED, ICOSA, DODECA, HEDRON ],
		],
		description: '2 triangles, a pentagon, and a decagon meet at each vertex (Truncated icosidodecahedron)',
		symbols: [
			[ 5, 1, 1, 1 ]
		]
	},
	{ 
		formula: [ '|', 2, 3, 4 ],
		formulaSnub: true,
		id: 'snubCube',
		names: [
			[ SNUB, CUB ],
			[ SNUB, CUB, OCTA, HEDRON ],
		],
		description: 'Snub form (Snub cube)',
		symbols: [],
		snub: true
	},
	{ 
		formula: [ '|', 2, 3, 5 ],
		id: 'snubDodecahedron',
		names: [
			[ SNUB, DODECA, HEDRON ],
			[ SNUB, ICOSA, DODECA, HEDRON ]
		],
		description: 'Snub form (Snub dodecahedron)',
		symbols: [],
		snub: true
	}
]