import { RENDERMODE, PROJECTIONMODE, SNAPMODE, ALLTOOLS } from '../_tools/defs.js'

export const PERSPECTIVE_MULTIPLIER = 1000
export const ORTHOGRAPHIC_MULTIPLIER = 250
export const LINE_HEIGHT = 1.4


const FUN = {
	fog: true,
	speed: 0,
	grow: 2,
	multiplier: 1
}


export const STORE_DEFAULTS = {

	ORTHOGRAPHIC_MULTIPLIER: ORTHOGRAPHIC_MULTIPLIER,
	PERSPECTIVE_MULTIPLIER: PERSPECTIVE_MULTIPLIER,
	LINE_HEIGHT: LINE_HEIGHT,

	unitMultiplier: PERSPECTIVE_MULTIPLIER,
	lineHeight: LINE_HEIGHT,

	defaultMaterialType: 'css', // remove eventually
	fun: FUN, // remove eventually

	svgNodes: {},
	guiNodes: {},

	markers:{},
	coordinates:{},

	selected: [],
	hovered: [],
	disabled: [],
	removed: [],

	activeTool: ALLTOOLS.POINTER,
	renderMode: RENDERMODE.GPU,
	projectionMode: PROJECTIONMODE.PERSPECTIVE,
	snapMode: SNAPMODE.NONE,

	activeObject: null,

	engineData: null,
	engineProxy: null,

	cameraData: null,
	cameraProxy: null,

	activeScene: null,
	activeSceneProxy: null,
}