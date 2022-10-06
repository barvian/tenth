<script lang="ts">
    import { cubicOut } from 'svelte/easing';
    import { tweened } from 'svelte/motion';
    
    export let percent: number | string
    let cls = ''
    export {cls as class}

    let val = tweened(0.005, {
		duration: 350,
		easing: cubicOut
	})
    $: val.set(typeof percent === 'string' ? (+percent)/100 : percent)

    const h = 0.675 // radius of hole as percentage of outer circle
    
    function getCoordinatesForPercent(p: number) {
        const x = Math.cos(2 * Math.PI * p);
        const y = Math.sin(2 * Math.PI * p);
        return [x, y];
    }

    const [startX, startY] = getCoordinatesForPercent(0)
    $: largeArcFlag = $val > .5 ? 1 : 0;
    $: [endX, endY] = getCoordinatesForPercent($val)

    $: [outlineStartX, outlineStartY] = getCoordinatesForPercent($val+.01)
    $: outlineLargeArcFlag = largeArcFlag ? 0 : 1;
    $: [outlineEndX, outlineEndY] = getCoordinatesForPercent(.99)
</script>

<div class={cls}>
    <svg class="w-full -scale-x-100 rotate-90" viewBox="-1 -1 2 2">
        <defs>
            <radialGradient id="grad" gradientUnits="userSpaceOnUse" cx="0px" cy="0px" r="1px">
            <stop offset="{h*100}%" stop-color="#FD7660"/>
            <stop offset="100%" stop-color="#FEDDBE"/>
            </radialGradient>
        </defs>
        <!-- https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/ -->
        <path
        d="
            M {outlineStartX} {outlineStartY}
            A 1 1 0 {outlineLargeArcFlag} 1 {outlineEndX} {outlineEndY}
            L {outlineEndX*h} {outlineEndY*h}
            A {h} {h} 0 {outlineLargeArcFlag} 0 {outlineStartX*h} {outlineStartY*h} z
        "
        fill="#FFEDDF" />
        <path d="
            M {startX} {startY}
            A 1 1 0 {largeArcFlag} 1 {endX} {endY}
            L {endX*h} {endY*h}
            A {h} {h} 0 {largeArcFlag} 0 {startX*h} {startY*h} z
        " fill="url(#grad)" />
    </svg>
    <svg class="absolute overflow-visible top-0 left-0 w-full -scale-x-100 rotate-90 -translate-x-1.5 -translate-y-1.5" viewBox="-1 -1 2 2">
        <path d="
            M {startX} {startY}
            A 1 1 0 {largeArcFlag} 1 {endX} {endY}
            L {endX*h} {endY*h}
            A {h} {h} 0 {largeArcFlag} 0 {startX*h} {startY*h} z
        " fill="none" stroke="black" stroke-width="1px" vector-effect="non-scaling-stroke" />
    </svg>
</div>