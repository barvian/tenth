<script lang="ts">
    import type { PageData } from './$types';
    import Button from '~/components/Button.svelte'
    export let data: PageData
</script>

<h1 class="text-4xl max-w-2xl text-center leading-tight font-bold">
    FAQs
</h1>

<div class="grid gap-y-6 lg:grid-cols-2 lg:gap-x-10">
    {#each data.faqs as {q, a}}
        <details class="rounded-3xl border">
            <summary class="text-lg font-medium p-8">{q}</summary>
            <div class="p-8 pt-4">{@html a}</div>
        </details>
    {/each}
</div>

<h2>Not seeing your question?</h2>
<Button width="w-min" href="mailto:support@tenth.to">Contact us</Button>