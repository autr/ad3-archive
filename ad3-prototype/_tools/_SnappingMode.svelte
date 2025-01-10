<script>
	/* ====================================== */
	/*                                        */
	/*         	       SNAPPING               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { Icon } from '$icons'
	import { keys } from '$keys'
	import { ICONS } from './defs.js'
	import { Vec3 } from '$ad3/index.js'
	import { XYZ } from '$ad3_tools_guis'

	let {
		refs = $bindable()
	} = $props()

	let previousSnap = 1
	let inited = false

	const SnappingPoints = $state({
		object: 'Group',
		id: 'SnappingPoints',
		children: []
	})

	$effect( () => {

		if (inited || !refs.store.activeScene) return

		if (!refs.store.activeScene.children) refs.store.activeScene.children = []
		refs.store.activeScene.children.push(SnappingPoints)

		// ------------ TOGGLE ------------

		keys.addShortcut('toggleSnapmode', ['z'], e => {
			e.preventDefault()
			e.stopPropagation()
			console.log(previousSnap)
			refs.store.snapMode = snapMode === 'none' ? ids[previousSnap] : 'none'
		})

		// ------------ INCREMENT ------------

		keys.addShortcut('toggleSnapmode', ['x'], e => {
			e.preventDefault()
			e.stopPropagation()
			let index = ids.indexOf(snapMode)
			index += 1
			if (index >= config.length) index = 0
			refs.store.snapMode = ids[index]
		})

		inited = true
	})

	const snapMode = $derived(refs.store.snapMode)
	const ids = $derived( config.map( item => item.id ) )

	$effect( () => {
		if (snapMode !== 'none') previousSnap = ids.indexOf(snapMode)
	})

	const config = [
		{
			id: 'ratio',
			value: ((1 + Math.sqrt(5)) / 2)-1,
			name: 'φ',
			classes: 'pb-3'
		},
		{
			id: 'fifth',
			value: 1/5,
			name: '1/5',
			classes: ''
		},
		{
			id: 'quarter',
			value: 1/4,
			name: '1/4',
			classes: ''
		},
		{
			id: 'third',
			value: 1/3,
			name: '1/3',
			classes: ''
		},
		{
			id: 'half',
			value: 1/2,
			name: '1/2',
			classes: ''
		},
		{
			id: 'none',
			value: 1,
			name: '1/1',
			classes: ''
		},
	].reverse()

	$effect( () => {
		if (!refs.groups?.Edge || !refs.store.activeScene) return
		const divide = config.find( mode => mode.id === refs.store.snapMode ).value
		let index = 0
		for (const [uid, item] of Object.entries(refs.groups?.Edge || {})) {
			let pointA = untrack( () => refs.lookup.get( item.pointA ) )
			let pointB = untrack( () => refs.lookup.get( item.pointB) )
			if (pointA && pointB) {
				pointA = new Vec3( untrack( () => pointA.position ) )
				pointB = new Vec3( untrack( () => pointB.position ) )
				const dist = pointA.distance( pointB )
				const count = 1/divide
				for (let i = 1; i < count; i++) {
					const move = (dist/count)*i
					const neu = pointA.clone().moveToward( pointB, move )

					if (SnappingPoints.children[index]) {
						SnappingPoints.children[index].position = neu
						SnappingPoints.children[index].hidden = false
					} else {
						SnappingPoints.children.push({
							id: 'SnappingPoint' + index,
							object: 'Point',
							position: neu,
							class: 'snapping-point',
							hidden: false
						})
					}
					index += 1
				}
			}
		}
		for (let i = index; i < SnappingPoints.children.length; i++) {
			SnappingPoints.children[i].hidden = true
		}
	})

	function toggle() {

	}

</script>


	<div class="snapping row-c-fs gap1">
		<button class="-highlight" on:click={toggle}>
			<Icon svg={ICONS.SNAP} />
		</button>
		{#each config as {id,value,name,classes}}

			<button 
				on:click={() => refs.store.snapMode = id}
				class:-selected={refs.store.snapMode === id}
				class="pre {classes || ''}">
				{name}
			</button>
		{/each}
	</div>