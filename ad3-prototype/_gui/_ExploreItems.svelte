<script>

	// #define COMPONENT

	import { Icon } from '$icons'
	import search from '$icons/_outline/search.svg?raw'
	import { GUI } from '$gui'

	let {} = $props()

	const lookup = getContext('lookup')
	let searchFilter = $state('')

	const searchFilterArray = $derived( searchFilter.split(' ') )
	const lookupResults = $derived( lookup.values().filter(item => {
		let keep = searchFilter.length < 2 ? true : false
		for (const str of searchFilterArray) {
			if ((item.uid||'').includes(str) || (item.object||'').includes(str)) keep = true
		}
		return keep
	}))

	function LogItem( item ) {
		SAY(`🔵 ----------------`)
		for (const [key,value] of Object.entries(item)) {
			SAY(`💠 ${key} ---> ${value}`)
		}
	}

	let hoverColors = $state({})

	function PointerOver( item ) {
		// SAY('OVER', item.uid, item)
		// hoverColors[item.uid] = item.color
		item.isHighlighted = true
		// item.color[0] = 1
		// item.radius = 0.2
		// item.color = [1,0.5,0.5,1]
	}

	function PointerLeave( item ) {
		// SAY('LEAVE', item.uid)
		item.isHighlighted = false
		// if (hoverColors[item.uid]) item.color = hoverColors[item.uid]
	}

</script>


<div class="col-fs-s overflow-none p1">

	<!-- <header class="row www7">
		<button class="pointer mr-2">
			<Icon svg={search} class="size2" />
		</button>
		<GUI.Input
			class="search www6 no-appearance b b0 ptb1"
			gui="text"
			bind:value={searchFilter} />
	</header> -->

	<div class="col-s-s grow bb">
		{#each lookup.values() as item}
			<button 
				class="pointer"
				onpointerover={() => PointerOver(item)}
				onpointerleave={() => PointerLeave(item)}
				onclick={() => LogItem(item)}>
				<div class="row-fs-c gap1">
					<span 
						class:fg3={item.isVisible}
						class:fg5={!item.isVisible}
						class="radius-1 colorswap size-1"></span>
					<span class="bb">{item.object}</span>
					<span class="italic">{item.uid}</span>
				</div>

			</button>
		{/each}

	</div>
	
</div>

<!-- 

	const filteredTreeResults = $derived.by(() => {
		const out = []
		if (!lookup) return out
		const terms = searchFilter.split(' ').map(str => str.toLowerCase())
		for (const [uid,item] of lookup.entries()) {
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

	function CreateTreeFromLookup( lookup ) {
		const tree = {}
		if (!lookup) return tree
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
 -->