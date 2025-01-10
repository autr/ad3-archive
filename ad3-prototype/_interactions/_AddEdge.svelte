<script>

	/* ====================================== */
	/*                                        */
	/*         	       ADD EDGE               */
	/*                                        */
	/* ====================================== */

	// #define COMPONENT

	let {
		data = $bindable({})
	} = $props()

	SetDefaults({
		enabled: true,
		onUpdate: () => {}
	})

	const store = getContext('store')

	store.polySelectData = data

	const camData = getContext('camera')
	const camProxy = getContext('cameraProxy')
	const controlsData = getContext('controls')
	const eventState = getContext('eventState')


</script>



