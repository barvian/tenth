  <script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { pageLoaded, sleep } from '~/lib/promises';
    import { page } from '$app/stores'
	import { fade } from 'svelte/transition';
  
    let cls = ''
    export { cls as class }
    export let coinSize = 5 // radius
    export let coinColor = '#000'
    export let initialStackWidth = .8
    export let initialStackHeight = 0
    export let rounded = true

    let wrapper: HTMLElement, canvas: HTMLCanvasElement
    let w: number = 0
    let h: number = 0
    
    // const loadDelay = pageLoaded.then(() => sleep(500))
    
    let matter: typeof import("matter-js")//, Serializer: any
    // let serializer: any
    const key = `coins:${$page.url.pathname}`
    let render: Matter.Render, engine: Matter.Engine, world: Matter.World, runner: Matter.Runner
    onMount(async() => {
      matter = await import("matter-js")
      // Serializer = await import("matter-tools/build/matter-tools.serializer")
      // serializer = Serializer.create()

      // Increase chance of smooth initial animation
      // await loadDelay

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
          // @ts-ignore
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

      // const loadedWorld = serializer.parse(sessionStorage.getItem(key))
      // if (loadedWorld) {
      //   // @ts-ignore
      //   matter.Engine.merge(engine, { world: loadedWorld })
      //   return 
      // }
  
      // Add walls
      matter.Composite.add(world, [
          // If the walls aren't obnoxiously big then the coins can slip through
          matter.Bodies.rectangle(w / 2, h+25, w, 50, { isStatic: true, render: { visible: false } }), // bottom
          matter.Bodies.rectangle(w+25, h / 2, 50, h, { isStatic: true, render: { visible: false } }), // right
          matter.Bodies.rectangle(-25, h / 2, 50, h, { isStatic: true, render: { visible: false } }), // left,
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
  
      // Drop in initial coins
      let initialCols = Math.max(3, Math.floor(w*initialStackWidth / (coinSize*2)))
      let initialRows = Math.max(2, Math.floor(h*initialStackHeight / (coinSize*2)))
      matter.Composite.add(world, Array.from({ length: initialRows }, (_, r) => 
        matter.Composites.stack(w / 2 - initialCols*coinSize + (r % 2 === 0 ? coinSize/2 : coinSize/-2), h-(r+1)*coinSize*2, initialCols, 1, 0, 0, (x: number, y: number) => addCoin({ x, y, add: false })),
      ))

      // add mouse control
      const mouse = matter.Mouse.create(render.canvas),
        mouseConstraint = matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        })

    matter.Composite.add(world, mouseConstraint)

    // keep the mouse in sync with rendering
    render.mouse = mouse
  })

  onDestroy(() => {
    // if (serializer && engine) sessionStorage.setItem(key, Serializer.serialise(serializer, engine.world))
    matter?.Render.stop(render)
    matter?.Runner.stop(runner)
    matter?.Engine.clear(engine)
  })

  export function addCoin({ x, y = -coinSize, add = true }: { x?: number, y?: number, add?: boolean } = {}) {
    const coin = matter.Bodies.circle(x ?? w/2, y, coinSize, {
      restitution: 0.3,
      render: {
        fillStyle: coinColor
      }
    })

    if (add && world) /*loadDelay.then(() => { */matter.Composite.add(world, coin)/* })*/
    return coin
  }

  // https://github.com/liabru/matter-js/issues/955
  // function handleResize(event: CustomEvent & { detail: ResizeObserverEntry }) {
  //   const { width, height } = event.detail.contentRect
  //   render.bounds.max.x = width;
  //   render.bounds.max.y = height;
  //   render.options.width = width;
  //   render.options.height = height;
  //   render.canvas.width = width;
  //   render.canvas.height = height;
  // }
  </script>
  
  <div bind:this={wrapper} class="absolute inset-0 {cls} overflow-hidden">
    <canvas bind:this={canvas} class="!absolute !left-1/2 !-translate-x-1/2 !bottom-0" />
  </div>