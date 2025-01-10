// ...AKIS implies modification, like pyramids

export const TRIAKIS = 30303
export const TETRAKIS = 3030303
export const DISDYAKIS = 20202
export const TRIACONTA = 30 
export const PENTAKIS = 50505
export const RHOMBIC = -1

export const TETRA = 3
export const CUB = 4
export const CUBE = 4
export const PENTA = 5
export const HEXA = 6
export const OCTA = 8 
export const DECA = 10
export const DODECA = 12
export const ICOSA = 20
export const HEDRON = 0
export const TRUNCATED = 101
export const RHOMBI = 202
export const SNUB = 303
export const GREAT = 404
export const SMALL = 505

export const CHAR_TO_NUM = { 
	TRIAKIS,
	TETRAKIS,
	DISDYAKIS,
	TRIACONTA,
	PENTAKIS,
	RHOMBIC,

	TETRA,
	CUB,
	CUBE,
	PENTA,
	HEXA,
	OCTA,
	DECA,
	DODECA,
	ICOSA,
	HEDRON,
	TRUNCATED,
	RHOMBI,
	SNUB,
	GREAT,
	SMALL 
} 
export let NUM_TO_CHAR = {}
for ( const [char, num] of Object.entries(CHAR_TO_NUM) ) NUM_TO_CHAR[num] = char

export const CHAR_TO_POLYGON_NAME = {
	TETRA: 'Triangle (3)',
	CUB: 'Cube (4)',
	CUBE: 'Cube (4)',
	PENTA: 'Pentagon (5)',
	HEXA: 'Hexagon (6)',
	OCTA: 'Octagon (8)',
	DECA: 'Decagon (10)',
	DODECA: 'Dodecagon (12)',
	ICOSA: 'Icosagon (20)'
}
