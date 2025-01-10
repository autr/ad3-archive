import { BB } from '$3d/lib.babylon.js'

export let POINTER_EVENT_TYPES = {}
for (const key of Object.keys(BB.PointerEventTypes)) POINTER_EVENT_TYPES[BB.PointerEventTypes[key]] = key


export const MESH_TRIGGERS = [
	'Pick',
	'LeftPick',
	'RightPick',
	'CenterPick',
	'PickDown',
	'DoublePick',
	'PickUp',
	'PickOut',
	'LongPress',
	'PointerOver',
	'PointerOut',
	// 'EveryFrame',
	// 'IntersectionEnter',
	// 'IntersectionExit',
	// 'KeyDown',
	// 'KeyUp'
]