<script>

	/* ====================================== */
	/*                                        */
	/*         	       TARGET                 */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { GUI } from '$gui'

	const groups = getContext('groups')

	let {
		label,
		value,
		min = -10,
		max = 10,
		step = 0.1,
		...props
	} = $props()

</script>

{#if typeof value !== 'string'}

	<GUI.Input 
		label={label}
		bind:value={value} 
		{min} 
		{max} 
		{step} />

{:else}
	<GUI.Input
		label={label}
		bind:value={value} 
		enum={["$Point"]}
		refs={groups} />
{/if}