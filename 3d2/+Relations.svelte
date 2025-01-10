<script>
	import * as Polyhedra from './_sketches'
	import presets from '$3d2_presets'
	import * as Views from './_views'

	const groups = [
		{
			title: 'Solids',
			subtitle: 'Platonic',
			blocks: [
				{
					preset: 1,
					relation: {
						type: 'dual',
						shape: ['right']
					}
				},
				{
					preset: 2
				},
				{
					preset: 0
				},
				{
					preset: 4,
					relation: {
						type: 'dual',
						shape: ['right']
					}
				},
				{
					preset: 3
				}
			]
		},
		{
			title: '2 Frequency',
			subtitle: 'Archimedean',
			blocks: [
				{
					preset: 5,
					double: true,
					relation: {
						type: 'platonic',
						shape: ['updouble','downdouble']
					}
				},
				{
					preset: 2
				},
				{
					preset: 6,
					double: true,
					relation: {
						type: 'platonic',
						shape: ['updouble','downdouble']
					}
				}
			]
		},
		{
			title: '3 Frequency',
			subtitle: 'Archimedean',
			blocks: [
				{
					preset: 9
				},
				{
					preset: 8
				},
				{
					preset: 7
				},
				{
					preset: 10
				},
				{
					preset: 11
				}
			]
		},
		{
			title: '4 Frequency',
			subtitle: 'Archimedean',
			blocks: [
				{
					preset: 12,
					double: true
				},
				{
					preset: 5
				},
				{
					preset: 13,
					double: true
				}
			]
		},
		{
			title: '6 Frequency',
			subtitle: 'Archimedean',
			blocks: [
				{
					preset: 14,
					double: true
				},
				{
					preset: 8
				},
				{
					preset: 15,
					double: true
				}
			]
		},
		{
			title: 'Snub',
			subtitle: 'Archimedean',
			blocks: [
				{
					preset: 16,
					double: true
				},
				{
					preset: 6
				},
				{
					preset: 17,
					double: true
				}
			]
		}

	].map( group => {
		group.blocks = group.blocks.map( block => {
			block.preset = presets[block.preset] 
			return block
		})
		return group
	})

</script>


<div class="relations">
	{#each groups as { title, subtitle, blocks } } 

		<div class="flex column-center-flex-start">
			<div class="flex row-center-flex-start rel w100vw pl8 mtb2">
				<div class="abs p1 l0 b50pc">
					<div class="f3">
						{subtitle}
					</div>
					<div class="italic f2 dark">
						{title}
					</div>
				</div>
				{#each blocks as {preset,double}}
					<div class="polyhedron" class:--double={double}>
						<Polyhedra.Basic 
							cylinderDiameter={0.03}
							sphereDiameter={0.08}
							autoRotateSpeed={0}
							preset={preset} />
						<Views.Names 
							single={true}
							class="f2 maxw16em"
							value={preset.names} />
						<Views.Formula 
							value={preset} />
					</div>
				{/each}

			</div>
		</div>

	{/each}
</div>


<style lang="sass">
	.relations 
		+rel
		.polyhedron
			$size: 14vw
			&.--double
				+www( $size * 2)
				+hhh( $size )

			:global
				canvas 
					+size( $size, $size )
			+flex 
			+column( center, flex-start )
			+maxw(20vw)
			// +wrap

</style>
