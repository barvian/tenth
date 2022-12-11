<script lang="ts">
	import Percentage from "~/components/Percentage.svelte";
    import { page } from '$app/stores'
</script>

<div role="heading" aria-level={1} class="text-4xl max-w-2xl text-center leading-tight font-bold">
    Donate
    <Percentage value={$page.data.profile?.percentage} />
    of your checking account to charity every year.
</div>