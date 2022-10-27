<script lang="ts">
    export let as = 'div'
    let cls = ''
    export { cls as class }
</script>

<svelte:element this={as} class="{cls} inner grid grid-cols-4 gap-y-6 gap-x-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6">
    <slot />
</svelte:element>