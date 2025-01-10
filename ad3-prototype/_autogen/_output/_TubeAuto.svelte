<script>

	// #define COMPONENT

	import { InitialiseData, ProcessData, ShouldRenderChildren, SetParentReference, OnDestroy } from '$ad3_autogen/lib.data.js'

	let {
		children,
		...attributes
	} = $props()

	const data = $state({ object: 'Tube', multipleType: 'ReplaceMultipleType' })
	const parentData = getContext('data')
	const liveData = InitialiseData( data, attributes, parentData )

	setContext('data', data)

	$effect(() => ProcessData( data, attributes ))
	$effect(() => SetParentReference( parentData.uid, data, attributes ) )

	const store = getContext('store')
	const isReady = $derived( ShouldRenderChildren( data, store, children, attributes, parentData )  )

	const tagsString = $derived( (data.tags || []).join(' ') )
	const flagsString = $derived( (data.flags || []).join(' ') )
	const typeString = $derived( data.object.toLowerCase() )

	onDestroy( () => OnDestroy(liveData, parentData) )
</script>

<!-- {#if liveData.autogen}
	{@render liveData.autogen()}
{/if} -->

<div id={data.uid} data-object={data.object} class="{typeString} {tagsString} {flagsString}" >
	{#if isReady}
		{@render children()}
	{/if}
</div>

<style lang="sass">
	div
		+col(flex-start, flex-start)
		+abs
		+xl(-9999px)
		+yt(-9999px)
</style>