<script lang="ts">
	import { onDestroy, onMount } from 'svelte'

	let cls = ''
	export { cls as class }
	export let coinSize = 5 // radius
	export let coinColor = '#000'
	export let coinOpacity = 1
	export let initialStackWidth = 0.8
	export let rounded = true

	let wrapper: HTMLElement, canvas: HTMLCanvasElement
	let w = 0
	let h = 0

	let matter: typeof import('matter-js')
	let render: import('matter-js').Render,
		engine: import('matter-js').Engine,
		world: import('matter-js').World,
		runner: import('matter-js').Runner

	onMount(async () => {
		matter = await import('matter-js')

		engine = matter.Engine.create({
			enableSleeping: true // puts bodies to sleep when they come to rest, saves a lot on perf,
		})
		world = engine.world
		runner = matter.Runner.create()

		w = wrapper.clientWidth
		h = wrapper.clientHeight
		let r = rounded ? h / 2 : 0

		render = matter.Render.create({
			engine,
			canvas,
			options: {
				pixelRatio: 'auto',
				width: w,
				height: h,
				showSleeping: false,
				wireframes: false,
				background: 'transparent'
			}
		})

		matter.Render.run(render)
		matter.Runner.run(runner, engine)

		// Add walls
		matter.Composite.add(world, [
			// If the walls aren't obnoxiously big then the coins can slip through

			// Bottom
			matter.Bodies.rectangle(w / 2, h + 25, w, 50, {
				isStatic: true,
				render: { visible: false }
			}),
			// Right
			matter.Bodies.rectangle(w + 25, h / 2, 50, h, {
				isStatic: true,
				render: { visible: false }
			}),
			// Left
			matter.Bodies.rectangle(-25, h / 2, 50, h, {
				isStatic: true,
				render: { visible: false }
			}),
			// Bottom left corner
			...Array.from({ length: r }, (_, i) => {
				const theta = Math.PI + Math.asin(i / r)
				const width = r + r * Math.cos(theta)
				return matter.Bodies.rectangle(width / 2, h - r + i + 0.5, width, 1, {
					isStatic: true,
					render: { visible: false }
				})
			}),
			// Bottom right corner
			...Array.from({ length: r }, (_, i) => {
				const theta = 2 * Math.PI - Math.asin(i / r)
				const width = r - r * Math.cos(theta)
				return matter.Bodies.rectangle(
					w - width / 2,
					h - r + i + 0.5,
					width,
					1,
					{ isStatic: true, render: { visible: false } }
				)
			})
		])

		// Drop in initial coins
		const bottomCols = Math.max(
			3,
			Math.floor((w * initialStackWidth) / (coinSize * 2))
		)
		const topCols = Math.ceil((bottomCols - 1) / 2)
		matter.Composite.add(world, [
			// bottom
			matter.Composites.stack(
				w / 2 - bottomCols * coinSize,
				h - coinSize * 2,
				bottomCols,
				1,
				0,
				0,
				(x: number, y: number) => addCoin({ x, y, add: false })
			),
			// top
			matter.Composites.stack(
				w / 2 -
					topCols * coinSize +
					((bottomCols - topCols) % 2 ? 0 : coinSize),
				h - coinSize * 3.5, // avoid any even minor falling animations
				topCols,
				1,
				0,
				0,
				(x: number, y: number) => addCoin({ x, y, add: false })
			)
		])
	})

	onDestroy(() => {
		matter?.Render.stop(render)
		matter?.Runner.stop(runner)
		matter?.Engine.clear(engine)
	})

	export function addCoin({
		x,
		y = -coinSize,
		add = true
	}: { x?: number; y?: number; add?: boolean } = {}) {
		const coin = matter.Bodies.circle(x ?? w / 2, y, coinSize, {
			restitution: 0.3,
			render: {
				fillStyle: coinColor,
				opacity: coinOpacity
			}
		})

		if (add && world) matter.Composite.add(world, coin)
		return coin
	}
</script>

<div bind:this={wrapper} class="absolute inset-0 {cls} overflow-hidden">
	<canvas
		bind:this={canvas}
		class="!absolute !left-1/2 !-translate-x-1/2 !bottom-0"
	/>
</div>
