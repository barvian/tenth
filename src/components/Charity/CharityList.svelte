<script lang="ts">
    import { fly } from 'svelte/transition';

    let cls = ''
    export {cls as class}
</script>

<div transition:fly|local={{y: 50}} class="overlap pb-2 pt-1.5 overflow-y-hidden overflow-x-auto select-none no-scrollbar hover:cursor-grab {cls}" on:mousedown>
    <!-- containerWidth = min(90vw,theme(maxWidth.5xl) -->
    <!-- paddingX = pagePadding + (90vw-containerWidth)/2 -->
    <!-- Repeat for every max-width breakpoint change, if any -->
    <div class="grid auto-cols-[theme(width.80)] grid-rows-1 grid-flow-col gap-4 w-fit px-[calc(theme(padding.page)+calc(100vw-(theme(padding.page)*2)-min(90vw,theme(maxWidth.5xl)))/2)]">
        <slot />
    </div>
</div>