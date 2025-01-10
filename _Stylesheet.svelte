<style lang="sass" global>
	@import url('https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,100..1000&display=swap')
	@import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap')

	$bg5: hsl(180, 20%, 1%)
	$bg4: hsl(180, 20%, 10%)
	$bg3: hsl(180, 20%, 15%)
	$bg2: hsl(180, 20%, 19%)
	$bg1: hsl(180, 20%, 25%)
	$bg0: hsl(180, 20%, 30%)

	$fg5: hsl(180, 20%, 60%)
	$fg4: hsl(180, 20%, 70%)
	$fg3: hsl(180, 20%, 85%)
	$fg2: hsl(180, 20%, 95%)
	$fg1: hsl(180, 20%, 99%)

	$reddish: hsl(0, 80%, 65%)
	$greenish: hsl(120, 60%, 65%)
	$purpleish: hsl(300, 60%, 65%)
	$turqish: hsl(180, 80%, 65%)
	$blueish: hsl(220, 90%, 70%)
	$pinkish: hsl(340, 90%, 75%)
	$yellowish: hsl(60, 100%, 45%)
	$orangeish: hsl(30, 90%, 60%)

	$fg1: hsl(180, 20%, 20%)
	$fg2: hsl(180, 20%, 25%)
	$fg3: hsl(180, 20%, 30%)
	$fg4: hsl(180, 20%, 44%)
	$fg5: hsl(180, 20%, 58%)

	$bg0: hsl(180, 20%, 60%)
	$bg1: hsl(180, 20%, 70%)
	$bg2: hsl(180, 20%, 85%)
	$bg3: hsl(180, 20%, 95%)
	$bg4: hsl(180, 20%, 99%)
	$bg5: hsl(180, 20%, 100%)

	$reddish: hsl(0, 80%, 70%)
	$greenish: hsl(120, 60%, 70%)
	$purpleish: hsl(300, 60%, 70%)
	$turqish: hsl(180, 80%, 70%)
	$blueish: hsl(220, 90%, 70%)
	$pinkish: hsl(340, 90%, 80%)
	$yellowish: hsl(60, 90%, 70%)
	$orangeish: hsl(30, 90%, 70%)

	#app, :root

		--reddish: #{$reddish}
		--greenish: #{$greenish}
		--purpleish: #{$purpleish}
		--turqish: #{$turqish}
		--blueish: #{$blueish}
		--pinkish: #{$pinkish}
		--yellowish: #{$yellowish}
		--orangeish: #{$orangeish}

		--bg1: #{$bg1}
		--bg2: #{$bg2}
		--bg3: #{$bg3}
		--bg: #{$bg3}
		--bg4: #{$bg4}
		--bg5: #{$bg5}
		--bg6: #{$fg1}
		--bg7: #{$fg2}
		--bg8: #{$fg3}
		--bg9: #{$fg4}

		--fg1: #{$fg1}
		--fg2: #{$fg2}
		--fg3: #{$fg3}
		--fg: #{$fg3}
		--fg4: #{$fg4}
		--fg5: #{$fg5}

		--fg6: #{$bg0}
		--fg7: #{$bg1}
		--fg8: #{$bg2}
		--fg9: #{$bg3}

		--colorAxis: #{$bg5}
		--colorSelection: #{$fg3}
		--logos: 13px

	html *, body * 
		font-family: 'Space Mono', 'Roboto Flex', BlinkMacSystemFont, -apple-system, sans-serif!important
		color: var(--fg)

	h1, h2, h3, h4, h5, h6 
		font-family: 'Space Mono', 'Roboto Flex', BlinkMacSystemFont, -apple-system, sans-serif!important
		font-style: italic!important
		font-weight: 400!important

	$shapes: ( TETRA: 4, CUB: 6, CUBE: 6, PENTA: 5, HEXA: 6, OCTA: 8, DECA: 10, DODECA: 12, ICOSA: 20 )
	$colorsBySides: ( 3 : $reddish, 4 : $greenish, 5 : $purpleish, 6 : $orangeish, 8 : $turqish, 10 : $pinkish, 12 : $yellowish, 20 : $blueish)
	$colors: ( TETRA: $reddish,CUB: $greenish, CUBE: $greenish, PENTA: $purpleish, HEXA: $orangeish,OCTA: $turqish,DECA: $pinkish,DODECA: $yellowish, ICOSA: $blueish )

	:root 
		@each $shape, $color in $colors
			--#{$shape}: #{$color}
			--#{to-lower-case(#{$shape})}: #{$color}


	@each $shape, $color in $colors 
		.#{$shape}, .#{to-lower-case(#{$shape})} 
			color: $color!important
			border-color: $color!important
			stroke: $color!important
			&.bg
				background-color: $color!important
				fill: $color!important

	@each $sides, $color in $colorsBySides
		.c#{$sides}
			color: $color !important
			border-color: $color !important
			stroke: $color !important
			&.bg
				background-color: $color !important
				fill: $color !important

	:root 
		@each $sides, $color in $colorsBySides
			--c#{$sides}: #{$color}



	.fill 
		fill: var(--fg)

	.darker, .darkest 
		color: $fg1!important
		border-color: $fg1!important
		stroke: $fg1!important
	.dark, .darken 
		color: $fg2!important
		border-color: $fg2!important
		stroke: $fg2!important
	.normal 
		color: $fg3!important
		border-color: $fg3!important
		stroke: $fg3!important
	.bright 
		color: $fg4!important
		border-color: $fg4!important
		stroke: $fg4!important
	.brighter, .brightest 
		color: $fg5!important
		border-color: $fg5!important
		stroke: $fg5!important
	.popper
		background-color: $bg1!important
		fill: $bg2!important
	.pop 
		background-color: $bg2!important
		fill: $bg2!important
	.bg 
		background-color: $bg3!important
		fill: $bg4!important
	.sink 
		background-color: $bg4!important
		fill: $bg4!important
	.sinker
		background-color: $bg5!important
		fill: $bg5!important

	// button, .button, a, .numbox, .slider, .points 
	// 	background: $bg3!important
	// 	border-radius: var(--radius)
	// 	&:active:not(.unclickable), &.--focused:not(.unclickable) 
	// 		filter: brightness(1) invert(1)
	// 		* 
	// 			border-color: transparent

	canvas 
		outline: none

	*
		// text-transform: uppercase

	::selection 
		background: $fg3
		color: $bg3

	.context-element
		.point
			stroke-width: 0px
			fill: var(--fg1)
			--radius: 16px
			&.snapping-point
				fill: var(--fg5)!important
		.edge
			--radius: 5px
			stroke-linecap: round
			stroke: var(--fg4)
			vector-effect: non-scaling-stroke

		.marker
			fill: var(--fg4)
			color: var(--fg4)
			font-size: 1.4em


		.point, .edge
			&.-unconnected, &.-removed
				fill: var(--bg2)
				stroke: var(--bg2)
				&.edge
					--radius: 3px
				&.point
					--radius: 12px
			&.hovered-edge
				stroke: var(--c6)
				--radius: 6.2px
			&.selected-edge
				stroke: var(--c3)
				--radius: 6.2px

			&.-hovered, &:hover
				fill: var(--c6)
				stroke: var(--c6)
			&.-selected
				fill: var(--c3)
				stroke: var(--c3)
				&.edge
					--radius: 6px
				&.point
					--radius: 17px
			&.-hidden
				display: none
				opacity: 0


</style>