<script lang="ts">
    let cls = ''
    export { cls as class }
</script>

<svg class="animate-spin h-5 w-5 {cls}" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-dasharray="{0.1 * 2*Math.PI*10} {2*Math.PI*10}" stroke-width="4"></circle>
</svg>