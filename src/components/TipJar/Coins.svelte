  <script lang="ts">
    import { onMount, onDestroy } from 'svelte'
    import { pageLoaded, sleep } from '~/lib/promises'
    import colors from 'tailwindcss/colors'
  
    export let coinSize = 5

    let w: number
    let h: number
    $: r = h / 2
  
    const things = []

    const loadDelay = pageLoaded.then(() => sleep(500))
  
    let matter: typeof import("matter-js")
    let wrapper: HTMLElement, render: Matter.Render, engine: Matter.Engine, world: Matter.World, runner: Matter.Runner
    onMount(async() => {
      matter = await import("matter-js")

      // Increase chance of smooth initial animation
      await loadDelay

      engine = matter.Engine.create({
        enableSleeping: true // puts bodies to sleep when they come to rest, saves a lot on perf
      })
      world = engine.world
      runner = matter.Runner.create()
      
      render = matter.Render.create({
        element: wrapper,
        engine,
        options: {
          pixelRatio: 2, // I think it might actually be better a little blurry
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
          matter.Bodies.rectangle(w / 2, h+5, w, 10, { isStatic: true, render: { visible: false } }), // bottom
          matter.Bodies.rectangle(w+5, h / 2, 10, h, { isStatic: true, render: { visible: false } }), // right
          matter.Bodies.rectangle(-5, h / 2, 10, h, { isStatic: true, render: { visible: false } }), // left,
          // Bottom left corner
          ...Array.from({ length: r }, (_, i) => {
            const theta = Math.PI + Math.asin(i / r)
            const width = r + r*Math.cos(theta)
            return matter.Bodies.rectangle(width/2, h-r+i+0.5, width, 1, { isStatic: true, render: { visible: false } })
          }),
          // Bottom right corner
          ...Array.from({ length: r }, (_, i) => {
            const theta = 2 * Math.PI - Math.asin(i / r)
            const width = r - r*Math.cos(theta)
            return matter.Bodies.rectangle(w - width/2, h-r+i+0.5, width, 1, { isStatic: true, render: { visible: false } })
          })
      ])
  
      const stack = matter.Composites.stack(w / 2 - 12, -40, 3, 3, 0, 0, (x: number, y: number) => addCoin({ x, y, add: false }))
  
      matter.Composite.add(world, stack)
    })
  
    onDestroy(() => {
        matter?.Render.stop(render)
        matter?.Runner.stop(runner)
        matter?.Engine.clear(engine)
    })
  
    export function addCoin({ x, y = -5, add = true }: { x?: number, y?: number, add?: boolean } = {}) {
      const coin = matter.Bodies.circle(x ?? w/2 - coinSize/2 + 1, y, coinSize, {
        restitution: 0.75,
        render: {
          fillStyle: colors.neutral[200]
        }
      })
  
      if (add) loadDelay.then(() => { matter.Composite.add(world, coin) })
      things.push(coin)
      return coin
    }
  </script>
  
  <div class="absolute inset-0" style="clip-path: inset(2.5px round 999px)" bind:clientHeight={h} bind:clientWidth={w} bind:this={wrapper} />