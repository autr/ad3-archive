<script>
	import { ResizeableTable } from '$global_table'
	import presets from '$3d2/_presets'
	import Cell from './_Cell.svelte'

	console.log(Cell)
	export let showHeader = true

	const stats = '12em'
	const max = '99em'
	export let theadData = {
		solid: ['8em', max],
		names: ['26em',max],
		formula: ['20em', max],
		faces: [stats, max],
		points: [stats, max],
		edges: [stats, max],
		tensegrity: ['14em', max]
	}

</script>

<ResizeableTable 
	on:click
	class="polyhedra"
	{showHeader}
	{theadData}
	tbodyData={presets}
	thHandler={Cell}
	tdHandler={Cell} />

<style lang="sass">
	:global
		.polyhedra.table
			+bt
			+br
			.thead
				+sticky
				+yt(0)
				+xl(0)
				+z-index(1)
				.td
					background: var(--bg3)
			.tr .td
				+bb
				+br
				border-color: var(--fg1)
				&:last-child
					border-right: none

</style>