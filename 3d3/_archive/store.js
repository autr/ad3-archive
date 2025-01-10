import { writable } from 'svelte/store'

export const _screenspaceThreshold = 4
export const _selectedMesh = writable(null)
export const _selectedNode = writable(null)
export const _plugins = writable({})