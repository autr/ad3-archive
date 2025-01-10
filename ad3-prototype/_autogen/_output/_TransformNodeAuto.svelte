<script>

	// #define COMPONENT

	import { InitialiseData, ProcessData, ShouldRenderChildren, SetParentReference } from '$ad3_autogen/lib.data.js'

	let {
		children,
		...inputData
	} = $props()

	const data = $state({ object: 'TransformNode', multipleType: 'ReplaceMultipleType' })
	const parentData = getContext('data')
	const liveData = InitialiseData( data, inputData, parentData )

	setContext('data', data)

	$effect(() => ProcessData( data, inputData ))
	$effect(() => SetParentReference( parentData.uid, data, inputData ) )

	const store = getContext('store')
	const isReady = $derived( ShouldRenderChildren( data, store, children, inputData, parentData )  )
</script>

{#if liveData.autogen}
	{@render liveData.autogen()}
{/if}
{#if isReady}
	{@render children()}
{/if}