<script>

	let timestamp = null 

	export let trigger = false
	export let toFixed = 0
	export let smoothing = 0.9
	export let useMilliseconds = false

	let elapsed, fps, inited 
	export function update() {
		if (!timestamp) timestamp = Number( new Date() )
		const t = Number( new Date() )
		elapsed = t - timestamp
		if (!fps) fps = elapsed ? 1000/elapsed : 0
		if (elapsed) fps = !inited ? fps : (fps * smoothing) + ((1000 / elapsed) * (1-smoothing))
		timestamp = t
		inited = true
	}

	let style_ = ""
	export { style_ as style }
	let class_ = ""
	export { class_ as class }

	$: update( trigger )
</script>
<span style={style_} class={class_}>
	{#if !useMilliseconds}
		{fps.toFixed(toFixed)}
	{:else}
		{elapsed}ms
	{/if}
</span>