import { 
	TETRA,
	CUB,
	HEXA,
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

export const TETRAHEDRON = { 
	id: 'tetrahedron',
	math: [ 3, '|', 2, 3 ],
	names: [ [ TETRA, HEDRON ] ],
	description: '3 triangles meet at each vertex (Tetrahedron)',
	formulas: [
		[ 2, 3, 3, 0, 1, 0 ],
		[ 2, 3, 3, 0, 0, 1 ]
	]
}

export const CUBE = { 
	id: 'cube',
	math: [ 3, '|', 2, 4 ],
	names: [ [ CUB ], [ HEXA, HEDRON ] ],
	description: '3 squares meet at each vertex (Cube)',
	formulas: [
		[ 2, 3, 4, 0, 1, 0 ]
	]
}

export const OCTAHEDRON = { 
	id: 'octahedron',
	math: [ 4, '|', 2, 3 ],
	names: [ [ OCTA, HEDRON ] ],
	description: '4 triangles meet at each vertex (Octahedron)',
	formulas: [
		[ 2, 3, 4, 0, 0, 1 ],
		[ 2, 3, 3, 1, 0, 0 ],
	]
}

export const DODECAHEDRON = { 
	id: 'dodecahedron',
	math: [ 3, '|', 2, 5 ],
	names: [ [ DODECA, HEDRON ] ],
	description: '3 pentagons meet at each vertex (Dodecahedron)',
	formulas: [
		[ 2, 3, 5, 0, 1, 0 ],
	]
}

export const ICOSAHEDRON = { 
	id: 'icosahedron',
	math: [ 5, '|', 2, 3 ],
	names: [ [ ICOSA, HEDRON ] ],
	description: '5 triangles meet at each vertex (Icosahedron)',
	formulas: [
		[ 2, 3, 5, 0, 0, 1 ],
	]
}

