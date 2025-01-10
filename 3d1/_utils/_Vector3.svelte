<script>
	/* ====================================== */
	/*                                        */
	/*                   XYZ                  */
	/*                                        */
	/* ====================================== */

	import * as BB from 'babylonjs'
	import AUI from '$aui'
	import { onMount, onDestroy, getContext } from 'svelte'

	export let value = null
	export let step = 0.01

	onMount( init )

	function init() {
		if (!value && !isArray) {
			value = new BB.Vector3( 0, 0, 0 )
		}
	}

	$: isArray = Array.isArray(value)

</script>


{#if value}
	<span 
		class:--array={isArray}
		class:--vector3={!isArray}
		class="flex row">
		<AUI bind:value={value[isArray?0:'x']} set:step={step} class="maxw6em" />
		<AUI bind:value={value[isArray?1:'y']} set:step={step} class="maxw6em" />
		<AUI bind:value={value[isArray?2:'z']} set:step={step} class="maxw6em" />
	</span>
{/if}