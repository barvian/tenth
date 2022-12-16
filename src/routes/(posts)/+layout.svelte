<script lang="ts">
    import { page } from '$app/stores'    
</script>

<article class="w-full max-w-prose prose prose-neutral prose-h1:text-center prose-h1:text-4xl prose-h1:font-bold prose-lead:text-center prose-lead:text-xl prose-lead:text-gray-500 prose-lead:font-normal prose-h1:mb-5 prose-lead:mt-5 prose-lead:mb-12 prose-a:text-orange-500 prose-a:font-medium prose-a:no-underline">
    <h1>{$page.data.meta.title}</h1>
    {#if $page.data.meta.last_updated}
        <p class="lead">Last updated {new Date($page.data.meta.last_updated).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'long' })}</p>
    {/if}
    <slot />
</article>
