<script lang="ts">
    import Nav from "~/components/Nav.svelte";
</script>

<svelte:head>
    <style>
        :root { @apply bg-white bg-noise-white }
    </style>
</svelte:head>

<header class="pt-9 pb-section">
    <Nav />
</header>
<main class="max-w-prose mx-auto pb-section">
    <article class="prose">
        <slot />
    </article>
</main>