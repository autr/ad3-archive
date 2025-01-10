<script>
	import { ICONS } from '$ad3_tools/index.js'
	import { Icon } from '$icons'

	import * as defs from '$ad3_tools/defs.js'

	const sections = { ICONS }

</script>


<div class="row-s-fs b bg3">

	{#each Object.entries(sections) as [title,obj]}
		<div class="col-s-s grow br h1vh overflow-auto">
			<header class="p-1 bb w1pc">
				{title}
			</header>
			<div class=" overflow-auto col-s-s grow">
				{#each Object.entries(obj) as [name, svg]}
					<button 
						on:click={() => navigator.clipboard.writeText(name)}
						class="row-sb-s p-1 pointer">
						<span>{name}</span>
						<div class="row-fe-c gap1">
							{@html svg}
						</div>
					</button>
				{/each}
			</div>
		</div>
	{/each}
</div>