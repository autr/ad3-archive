import * as BB from 'babylonjs'


export let POINTER_EVENT_TYPES = {}
for (const key of Object.keys(BB.PointerEventTypes)) POINTER_EVENT_TYPES[BB.PointerEventTypes[key]] = key