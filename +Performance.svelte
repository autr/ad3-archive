<script>
	import { StringFileSize, GetConstructorArguments } from '$_lib'

	function ColorForValue(value, min, max) {
		const mid = (min + max) / 2;
		let r, g, b;
		
	 if (value <= mid) {
			const ratio = (mid - value) / (mid - min); // Invert ratio for green to cyan
			r = Math.round(128 * ratio); // Light Green to Cyan
			g = 255;
			b = Math.round(255 * ratio + 128 * (1 - ratio));
		} else {
			const ratio = (max - value) / (max - mid); // Invert ratio for cyan to red
			r = 255;
			g = Math.round(255 * ratio); // Cyan to Light Red
			b = Math.round(128 * ratio);
		}

		return `rgb(${r}, ${g}, ${b})`;
	}

	const lib = $derived.by( () => {
		const arr = []
		for (const [name, object] of Object.entries(post)) {
			const item = { name }
			if (typeof object === 'function') {
				item.size = StringFileSize( object )
				item.args = GetConstructorArguments( object )
			} else {
				item.items = []
				item.size = 0
				for (const [childName, childObj] of Object.entries(object)) {
					const size = StringFileSize(childObj)
					item.items.push({
						name: childName,
						size,
						args: GetConstructorArguments( childObj )
					})
					item.size += parseInt(size)
				}
				item.size += 'KB'
			}
			arr.push(item)
		}
		return arr.sort( (a,b) => {
			return parseInt(b.size) - parseInt(a.size)
		})
	})

	const totalSize = $derived( lib.reduce((acc, item) => {
		return acc + parseInt( item.size )
	}, 0))
</script>


{#snippet RenderItem({name,args,size,items})}
	<div class="row-s-c p1">
		<span class="col basis0 grow">
			<span class="col flex">
				<span class="fg1">
					<span>{name}</span>
				</span>
				<span>
					<span class="fg3 italic">{args?.type}</span>
					<span class="fg5 italic">{args?.args}</span>
				</span>
			</span>
			{#if items}<span class="orange4">({items.length})</span>{/if}
		</span>
		<span 
			class="row filesize col basis0"
			style={`--kbColor: ${ColorForValue(parseInt(size), 0, 200)}`}>
			{size}
			{#if items}<span>({items.length})</span>{/if}
		</span>
	</div>
{/snippet}
<div class="col-s-s overflow-auto bg">
	<header class="bb plr1 ptb1 row-sb-c">
		<span class="f2 fg1">Size <span class="fg4"></span></span>
		<span class="fg3 f2">{totalSize}KB</span>
	</header>
	{#each lib as item}
		<div class="bb col-s-s">
			{@render RenderItem(item)}
		</div>
		<!-- {#if item.items}
			{#each item.items as childItem}
				{@render RenderItem(childItem)}
			{/each}
		{/if} -->

	{/each}

</div>
<style lang="sass">
	.filesize
		color: var(--kbColor)
</style>