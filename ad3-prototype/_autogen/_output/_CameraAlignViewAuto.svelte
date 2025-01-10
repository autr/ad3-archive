<script>

	// #define COMPONENT

	import { InitialiseData, ProcessData, ShouldRenderChildren, SetParentReference } from '$ad3_autogen/lib.data.js'

	let {
		children,
		...attributes
	} = $props()

	const data = $state({ object: 'CameraAlignView', multipleType: 'ReplaceMultipleType' })
	const parentData = getContext('data')
	const liveData = InitialiseData( data, attributes, parentData )

	setContext('data', data)

	$effect(() => ProcessData( data, attributes ))
	$effect(() => SetParentReference( parentData.uid, data, attributes ) )

	const store = getContext('store')
	const isReady = $derived( ShouldRenderChildren( data, store, children, attributes, parentData )  )
</script>

{#if liveData.autogen}
	{@render liveData.autogen()}
{/if}
{#if isReady}
	{@render children()}
{/if}