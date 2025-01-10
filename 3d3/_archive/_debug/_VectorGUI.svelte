<script>
	/* ====================================== */
	/*                                        */
	/*                   XYZ                  */
	/*                                        */
	/* ====================================== */

	// #define BABYLON
	import AUI from '$aui'
	import { onMount, onDestroy, getContext } from 'svelte'

	export let value = null
	export let step = 0.001

	onMount( init )

	function init() {
		if (!value && !isArray) {
			value = new BB.Vector4( 0, 0, 0, 0 )
		}
	}

	$: isArray = Array.isArray(value)

</script>


{#if value}
	<span 
		class:--array={isArray}
		class:--vector3={!isArray}
		class="flex row">
		{#each isArray ? value : Object.keys(value.toObject()) as key, idx }
			<AUI bind:value={value[isArray?idx:key]} set:step={step} class="maxw6em" />
		{/each}
		<!-- <AUI bind:value={value[isArray?3:'w']} set:step={step} class="maxw6em" /> -->
	</span>
{/if}