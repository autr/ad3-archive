<script>

	/* ====================================== */
	/*                                        */
	/*         	      BUILDER                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import ObjectSvelte from '../_engine/_Object.svelte.js'
	import SchemaString from './_Shape.svelte?raw'
	import  { Vec4, Vec3, Vec2 } from '$3d1_points'
	import { GUI } from '$gui'
	import { ORIENTATION, PATTERNS } from './defs.js'

	let {
		id = 'shape',
		debug = false,
		type = 'sphere', /** @gui  enum: [ sphere, box, cylinder, polygon, knot, ground ] */
		position = 0, /** @gui  enum: [ $Point ] */
		rotation = { x: 0, y: 0, z: 0 }, /** @gui */
		scaling = { x: 1, y: 1, z: 1 }, /** @gui */
		size = 0, /** @gui min: 0, max: 1, step: 0.001 */ 
		sides = 6, /** @gui  min: 3, max: 32, step: 1 */
		arc = 1, /** @gui  min: 0, max: 1, step: 0.02 */
		slice = 1, /** @gui  min: 0, max: 1, step: 0.01 */
		flat = true, /** @gui */
		tile = 1, /** @gui */
		wrap = false, /** @gui */
		pattern = 'none', /** @gui  enum: [ none, flip, rotate, row, rotaterow, fliprotate, fliprotaterow ] */
		updatable = true, /** @gui */
		faces = 'double', /** @gui  enum: [ front, back, double ] */
		enclose = true, /** @gui */
		material = undefined,
		children
	} = $props()

	export class Shape extends ObjectSvelte {}
	const shape = new Shape( id, debug, getContext('parent'), getContext('references') )

	setContext('parent', shape)
	setContext('Camera', shape)

	shape.setSchema(SchemaString)

	shape.send('create', shape.debug, shape.parent.id() )

	$effect( shape.sync( 'type', type ) )

	$effect( shape.sync( 'position', position, 'setPositionTarget' ))
	
	// $effect( shape.sync( 'position.x', position.x ))
	// $effect( shape.sync( 'position.y', position.y ))
	// $effect( shape.sync( 'position.z', position.z ))

	$effect( shape.sync( 'rotation.x', rotation.x ))
	$effect( shape.sync( 'rotation.y', rotation.y ))
	$effect( shape.sync( 'rotation.z', rotation.z ))

	$effect( shape.sync( 'scaling.x', scaling.x ))
	$effect( shape.sync( 'scaling.y', scaling.y ))
	$effect( shape.sync( 'scaling.z', scaling.z ))

	$effect( shape.sync( 'size', size ) )
	$effect( shape.sync( 'sides', sides ) )
	$effect( shape.sync( 'arc', arc ) )
	$effect( shape.sync( 'slice', slice ) )
	$effect( shape.sync( 'flat', flat ) )
	$effect( shape.sync( 'tile', tile ) )
	$effect( shape.sync( 'wrap', wrap ) )
	$effect( shape.sync( 'pattern', pattern ) )
	$effect( shape.sync( 'faces', faces ) )
	$effect( shape.sync( 'enclose', enclose ) )
	$effect( shape.sync( 'material', material ) )
	$effect( shape.sync( 'updatable', updatable ) )

	$effect( () => {

		const derivedSize = Vec4.Create( shape.props.size )
		const derivedTile = Vec2.Create( shape.props.tile )
		const derivedArc = shape.props.arc === undefined ? shape.props.arc / shape.props.sides : shape.props.arc
		const derivedSlice = shape.props.slice === undefined ? shape.props.slice / shape.props.sides : shape.props.slice
		const type = (shape.props?.type || '').toLowerCase()

		let config = {
			updatable: shape.props.updatable,
			sideOrientation: ORIENTATION[ shape.props.faces ],
			instance: shape.instance
		}

		if (type == 'box' || type == 'tiledbox' ) {

			config = {
				method: 'CreateTiledBox',
				...config,
				width: derivedSize.x,
				height: derivedSize.y,
				depth: derivedSize.z,
				wrap: shape.props.wrap,
				tileWidth: derivedTile.x,
				tileHeight: derivedTile.y,
			}
		} else if ( type === 'sphere' ) {

			config = {
				method: 'CreateSphere',
				...config,
				segments: shape.props.sides,
				diameterX: derivedSize.x,
				diameterY: derivedSize.y,
				diameterZ: derivedSize.z,
				arc: derivedArc,
				slice: derivedSlice
			}
		} else if ( type === 'cylinder' ) {

			config = {
				method: 'CreateCylinder',
				...config,
				diameterTop: derivedSize.x,
				height: derivedSize.y,
				diameterBottom: derivedSize.z,
				tessellation: shape.props.sides,
				arc: derivedArc,
				enclose: shape.props.enclose
			}
		} else if ( type === 'polygon' ) {
			config = {
				method: 'CreateDisc',
				...config,
				radius: derivedSize.x,
				tessellation: shape.props.sides,
				arc: derivedArc
			}
		} else if ( type === 'knot' ) {
			config = {
				method: 'CreateTorusKnot',
				...config,
				p: derivedSize.x,
				q: derivedSize.y,
				radius: derivedSize.z,
				tube: derivedSize.w,
				radialSegments: shape.props.sides,
				tubularSegments: shape.props.sides
			}
		} else if ( type === 'ground' ) {
			config = {
				method: 'CreateTiledGround',
				...config,
				xmin: derivedSize.x / -2,
				xmax: derivedSize.x / 2,
				zmin: derivedSize.y / -2,
				zmax: derivedSize.y / 2,
				subdivision: { w: derivedTile.z, h: derivedTile.z }
			}
		}

		shape.send('init', config)

	})

	onDestroy( shape.dispose.bind(shape) )

</script>

<svelte:options runes={true} />

{#if children && mesh?.inited}
	{@render children()}
{/if}
