<script lang="ts">
    let cls = ''
    export { cls as class }
    export let strokeWidth = 4
</script>

<svg class="animate-spin {cls}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width={strokeWidth} vector-effect="non-scaling-stroke"></circle>
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-dasharray="{0.1 * 2*Math.PI*10} {2*Math.PI*10}" stroke-width={strokeWidth} vector-effect="non-scaling-stroke"></circle>
</svg>