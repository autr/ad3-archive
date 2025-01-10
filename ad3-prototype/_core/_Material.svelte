<script>
	
	/* ====================================== */
	/*                                        */
	/*         	       CAMERA                 */
	/*                                        */
	/* ====================================== */

	import MaterialProxy from './_backend/_Material.proxy.js'
	import { MapRange } from '$_lib'

	// #define COMP3D

	const proxy = Proxification( new MaterialProxy() )
	InitialiseUID()
	proxy.initialiseWithEngine( data.uid, store.engineProxy, data.debug ).then( () => data.loaded = true )

	const TYPES = [ 'standard', 'pbr', 'shader', 'grid', 'fur', 'metallic' ]

	const defaultTypes = {
		'css': 'standard',
		'grid': 'grid',
		'pbr': 'pbr',
		'shrub': 'fur'
	}


    // /** Defines that alpha blending is disabled */
    // static readonly ALPHA_DISABLE = 0;
    // /** Defines that alpha blending is SRC ALPHA * SRC + DEST */
    // static readonly ALPHA_ADD = 1;
    // /** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC ALPHA) * DEST */
    // static readonly ALPHA_COMBINE = 2;
    // /** Defines that alpha blending is DEST - SRC * DEST */
    // static readonly ALPHA_SUBTRACT = 3;
    // /** Defines that alpha blending is SRC * DEST */
    // static readonly ALPHA_MULTIPLY = 4;
    // /** Defines that alpha blending is SRC ALPHA * SRC + (1 - SRC) * DEST */
    // static readonly ALPHA_MAXIMIZED = 5;
    // /** Defines that alpha blending is SRC + DEST */
    // static readonly ALPHA_ONEONE = 6;
    // /** Defines that alpha blending is SRC + (1 - SRC ALPHA) * DEST */
    // static readonly ALPHA_PREMULTIPLIED = 7;
	
	SetDefaults({

		targets: [], // various Shapes
		type: 'standard', // standard / basic, pbr, shader, grid, fur, metallic

		// STANDARD

		ambientColor: [ 0,0,0 ], // color of the material lit by the environmental background lighting
		diffuseColor: [ 0,0,0 ], // basic color of the material as viewed under a light
		specularColor: [ 0,0,0 ], // how the color and intensity of the highlight given by the light in the material
		emissiveColor: [ 1,1,1 ], // color of the material as if self lit

		// GRID

		lineColor: [ 1,1,1 ],
		mainColor: [ 26/255,38/255,38/255 ],

		// META

		backFaceCulling: true,
		alpha: 1,
		alphaMode: 2, // ALPHA_COMBINE / ALPHA_ADD / ALPHA_SUBTRACT / ALPHA_MULTIPLY / ALPHA_MAXIMISED / ALPHA_ONEONE
		hasAlpha: true,
		disableLighting: false,
		depthWrite: true,

		// PBR

		reflectionColor: [ 1,1,0 ],
		albedoColor: [ 0,0,1 ],
		reflectivityColor: [ 1,0,1 ],
		roughness: 0.2,
		metallic: 1,

		// FUR

		furLength: 0.3,
		furAngle: 0.2,
		furSpacing: 0.4, // length
		furDensity: 8, // densirty
		furSpeed: 2000,
		furGravity: new Vec3(0, -1, 0).toObject(),
		highLevelFur: true,
		furColor: [
				MapRange( Math.random(), 0, 1, 0.5, 1), 
				MapRange( Math.random(), 0, 1, 1, 1), 
				MapRange( Math.random(), 0, 1, 0.8, 1)
		],
		furDetail: 20,
	})

	$effect( WhenReady.bind(() => {
		data.type = defaultTypes[ store.defaultMaterialType ]
	}))

	$effect( () => {

		// if (!data.loaded) return

		const all = {

			ambientColor: data.ambientColor,
			diffuseColor: data.diffuseColor,
			specularColor: data.specularColor,
			emissiveColor: data.emissiveColor,
		}

		const args = {

			pbr: {
				reflectionColor: data.reflectionColor,
				reflectivityColor: data.reflectivityColor,
				albedoColor: data.albedoColor,
				roughness: data.roughness,
				metallic: data.metallic,
				// ...all,
			},
			grid: {
				mainColor: data.mainColor,
				lineColor: data.lineColor,
			},
			standard: all,
			basic: all,
			fur: {
				furLength: data.furLength,
				furAngle: data.furAngle,
				furSpacing: data.furSpacing,
				furDensity: data.furDensity,
				furSpeed: data.furSpeed,
				furGravity: data.furGravity,
				highLevelFur: data.highLevelFur,
				furColor: data.furColor,
				furDetail: data.furDetail
			}
		}
		const config = {

			type: data.type,

			// META

			backFaceCulling: data.backFaceCulling,
			alpha: data.alpha,
			alphaMode: data.alphaMode,
			hasAlpha: data.hasAlpha,
			disableLighting: data.disableLighting,
			depthWrite: data.depthWrite,

			...args[data.type]
		}

		proxy.setup( data.uid, config, data.debug).then( () => {
			if (!data.inited) EnableRefs()
		})
	})



</script>

<svelte:options runes={true} />

{#if children && data.inited}
	{@render children()}
{/if}

