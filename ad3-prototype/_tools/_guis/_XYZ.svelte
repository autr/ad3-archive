<script>

	/* ====================================== */
	/*                                        */
	/*         	         XYZ                  */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	import { GUI } from '$gui'

	const groups = getContext('groups')

	let {
		label,
		value = $bindable(),
		...props
	} = $props()

</script>

<div>{label}</div>
<div class="row-s-c gap">
	{#each ['x','y','z'] as letter,i}
		<GUI.Input
			class="minw0 grow"
			bind:value={value[letter]}
			{...props} />
	{/each}
</div>