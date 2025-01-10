<script>

	import Sketch from '$ad3_sketch/_Sketch.svelte'
	import { ExplorerTree, ExplorerInspector } from '$ad3_app'
	// import stylesheet from './stylesheet.css?raw'
	import Stylesheet from './_Stylesheet.svelte'
	import css from 'css'
	import { GUI } from '$gui'
	import { Icon } from '$icons'

	import { ICONS } from '$ad3_tools'
	import Listicle from '$ad3_tools/_Listicle.svelte'
	import SelectableItem from '$ad3_tools_explore/_SelectableItem.svelte'
	import Tools from '$ad3_tools/_Tools.svelte'

	import { Tree } from '$ad3_tools_explore'

	import { GetCreatorChain } from '$ad3_libs'

	// #define COMPONENT

	let data = $state({
		object: 'Engine',
		debug: false,
		children: [
			{
				object: 'Scene',
				debug: false,
				children: [
					{
						object: 'Camera',
						debug: false
					},
					// {
					// 	object: 'Point',
					// 	hidden: false
					// },
					{
						object: 'Polyhedra',
						id: 'polyhedra',
						preset: 1,
						debug: false,
						schwarz: {
							x: 1,
							y: 1,
							z: 1
						},
						symbol: {
							x: 2,
							y: 3,
							z: 3
						},
						children: []
					}
				]
			}
		]
	})

	let refs = $state()



	const types = {
		system: ['Engine','Camera','Scene','Controls'],
		operators: ['Polyhedra', 'Pathfinder', 'Transform' ],
		graph: ['Point', 'Edge'],
		renderers: ['Shape','Material']
	}



	let filter = $state('All')
	let showHidden = $state(true)
	let search = $state('')

	$effect( () => globalThis.refs = refs )
	const filters = $derived( [ 'All', ...Object.keys( refs.groups )])

	const MULTIPLES = ['Point', 'Edge', 'Shape', 'Material'] 

	const activeObjectGui = $derived( refs.store.guiNodes[refs.store.activeObject?.uid] )


	let searchFilter = $state('')

	function BuildTreeFromList( lookup ) {
		const tree = {}
		for (const uid of lookup.keys() ) {
			let currentNode = tree
			const chain = [ uid, ...GetCreatorChain( lookup.get(uid) )]
			for (const parent of chain.reverse()) {
				currentNode[parent] = currentNode[parent] || {}
				currentNode = currentNode[parent]
			}
		}
		return tree
	}
	const filteredItems = $derived.by(() => {
		const out = []
		const terms = searchFilter.split(' ').map(str => str.toLowerCase())
		for (const [uid,item] of refs.lookup.entries()) {
			let yes = false
			const uidStr = uid.toLowerCase()
			const objStr = (item.object || '').toLowerCase()
			for (const term of terms) {
				if (uidStr.includes(term) || objStr.includes(term)) {
					yes = true
				}
			}

			if (yes) out.push( uid )
		}
		return out
	})

	const lookupTree = $derived( BuildTreeFromList( refs.lookup ) )

	const CREATE = 'Create New Object'
	let createNew = $state(CREATE)

	$effect( () => {
		if (createNew !== CREATE) {
			refs.store.activeScene.children.push({ object: createNew })
			createNew = CREATE
		}
	})
</script>



<!-- <Stylesheet /> -->


<div class="row-s-s hhh1vh bg normal" style:--width="140px">
	<div class="explorer www8">

		{#if refs}
			<div class="row-fs-s pr-1">
				<button class="pl1 pointer">
					<Icon svg={ICONS.SEARCH} class="size2" />
				</button>
				<GUI.Input
					class="search grow www1pc no-appearance w1pc no-border b0 ptb1"
					gui="text"
					bind:value={searchFilter} />
				<div 
					class="row-s-c grow rel">
					<!-- <GUI.Input 
						class="selector grow ptb1 pointer no-appearance"
						enum={['$filters']}
						refs={{filters}}
						gui="select"
						bind:value={filter}> -->
					<!-- <div class="abs" style="right:0px;pointer-events:none">
						<Icon 
							type="chevrondown" />
					</div> -->
				</div>
				
			</div>

			<div class="col-s-s overflow-auto grow bt bb">

				{#each Object.entries(lookupTree) as [uid,children]}
					<Tree 
						{uid} 
						{children} 
						filters={filteredItems}
						bind:refs={refs} />
				{/each}
			</div>

			<div class="p1 col-s-s minh1--3pc maxh1--2pc bg2">
				<!-- {#each refs.store.selected as uid}
					{@render refs.store.guiNodes[uid]()}
				{/each}
 -->

			</div>
			<div class="row-s-s gap1 bt p1 cminw0">
				{#if refs.store.fun}
					<GUI.Input
						bind:value={refs.store.fun.speed}
						min="0"
						max="10"
						step="0.00001"
						gui="range" />
					<GUI.Input
						bind:value={refs.store.fun.grow}
						min="0"
						max="20"
						step="0.00001"
						gui="range" />
					<GUI.Input
						bind:value={refs.store.fun.multiplier}
						min="0"
						max="2"
						step="0.00001"
						gui="range" />
				{/if}
			</div>
		{/if}
	</div>

	<main class="grow col-s-s rel cno-basis cgrow hhh1vh bl bg4">
		<Sketch 
			bind:refs={refs}
			bind:data={data}>

			<Tools bind:refs={refs} />
		</Sketch>.

	</main>

	<div class="bl col-s-fs overflow-auto www8">

		{#if refs}
			<header class="bb bg2">
				{#each Object.entries( refs.lookup ) as [uid,item], index }

					{#if !MULTIPLES.includes(item.object)}
						<SelectableItem 
							item={item}
							index={index}
							active={refs.store.activeObject === item}
							on:click={() => refs.store.activeObject = item} />
					{/if}
				{/each}
			</header>
			<div class="overflow-auto grow p1">
				{#if activeObjectGui }
					{@render activeObjectGui()}
				{:else}
					<div class="italic">
						No object / group selected
					</div>
				{/if}
			</div>
			<footer class="bt rel bg2">
				<GUI.Input
					gui="select"
					class="hidden fill"
					bind:value={createNew}
					enum={[CREATE, 'Polyhedra','Group','Pathfinder']} />
				<div class="row-sb-c p1">
					<div class="row-fs-c gap1">
						<Icon svg={ICONS.ADD_OBJECT} />
						{CREATE}
					</div>
					<Icon type="chevrondown" />
				</div>
			</footer>

		{/if}
	</div>
</div>


<style lang="sass" global>
	:root
		--logos: 14px
	.search[type=text]
		+ptb($r1)
	.selector
		border: none 
		background: transparent
	.explorer
		// +www($r7i)
		+col(stretch,flex-start)
		+hhh(100vh)
		+overflow(hidden)


</style>
