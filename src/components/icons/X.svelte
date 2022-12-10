<script lang="ts">
    let cls = ''
    export { cls as class }
    export let strokeWidth = 3
</script>

<svg class={cls} viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.625 2.5L2.625 16.5" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width={strokeWidth} stroke-linecap="square" stroke-linejoin="round"/>
    <path d="M16.625 16.5L2.625 2.5" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width={strokeWidth} stroke-linecap="square" stroke-linejoin="round"/>
</svg>