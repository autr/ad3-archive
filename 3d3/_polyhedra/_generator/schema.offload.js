
export default {
	vertexstyle: {
		type: 'string',
		description: 'vertex display style',
		default: 'icosahedron'
	},
	vertexwidth: {
		type: 'number',
		default: 0.06
	},
	edgewidth: {
		type: 'number',
		default: 0.02
	},
	alledges: {
		type: 'boolean',
		description: 'toggle to show all edges',
		default: false
	},
	allvertices: {
		type: 'boolean',
		description: 'toggle to show all vertices',
		default: false
	},
	novertices: {
		type: 'boolean',
		description: 'toggle to hide vertices',
		default: false
	},
	noedges: {
		type: 'boolean',
		description: 'toggle to hide edges',
		default: false
	},
	nofaces: {
		type: 'boolean',
		description: 'toggle to hide faces',
		default: false
	},
	dospline: {
		type: 'boolean',
		description: 'spline curve usage toggle',
		default: false
	},
	reversefaces: {
		type: 'boolean',
		description: 'reverse face orientation toggle',
		default: false
	},
	projective: {
		type: 'boolean',
		description: 'projective rendering toggle',
		default: false
	}
}