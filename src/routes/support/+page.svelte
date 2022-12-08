<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData
</script>

<div class="inner grid gap-y-6 lg:grid-cols-2 lg:gap-x-10 round-3xl items-start">
    {#each data.faqs as {q, a}}
        <details class="rounded-3xl border">
            <summary class="text-lg font-medium p-8">{q}</summary>
            <div class="p-8 pt-4">{@html a}</div>
        </details>
    {/each}
</div>