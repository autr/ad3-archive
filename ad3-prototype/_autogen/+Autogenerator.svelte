<script>
	import * as A from '$ad3_core'
	import * as B from '$ad3_generators'
	import * as C from '$ad3_interactions'

	// #define COMPONENT

	const config = {
		A: { names: Object.keys(A), location: '$ad3_core' },
		B: { names: Object.keys(B), location: '$ad3_generators' },
		C: { names: Object.keys(C), location: '$ad3_interactions' },
	}

	async function writeLibrary() {

		const response = await fetch(window.location.pathname, {
			method: 'POST', // *GET, POST, PUT, DELETE, etc.
			mode: 'cors', // no-cors, *cors, same-origin
			cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
			credentials: 'same-origin', // include, *same-origin, omit
			headers: { 'Content-Type': 'application/json' },
			redirect: 'follow', // manual, *follow, error
			body: Stringify(config),
			referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
		})

		text = await response.text()
		// setTimeout(() => text = 'Write Library', 1000)
	}

	let text = $state('')


	// writeLibrary()

</script>

<div class="col-s-s minh1vh">
	<div class="row-s-s">
		{#each Object.entries(config) as [id, {names,location}]}
			<div class="col-s-fs grow basis0 bl">
				<header class="row-sb-c ptb2 basis0 p1">
					<div class="f3">{id}</div>
					<div class="italic f2">{location}</div>
				</header>
				<div>
					{#each names as name}
						<div class="f2 p1 bt">{name}</div>
					{/each}
				</div>
			</div>
		{/each}
	</div>
	<button 
		on:click={writeLibrary}
		class="grow col-c-c w1pc colorswap fg1 bg5 italic pointer">
		<div class="f3 pb1">Write Library</div>
		<div>{text}</div>
	</button>
</div>