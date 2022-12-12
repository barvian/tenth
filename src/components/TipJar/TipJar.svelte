<script lang="ts">
	import Button from "../Button.svelte";
	import Coins from "./Coins.svelte";

	let coins: Coins
</script>

<!-- containerWidth = min(90vw,theme(maxWidth.5xl) -->
<!-- paddingX = pagePadding + (90vw-containerWidth)/2 -->
<!-- Repeat for every max-width breakpoint change, if any -->
<div class="fixed bottom-9 right-[calc(theme(padding.page)+calc(100vw-(theme(padding.page)*2)-min(100vw-(theme(padding.page)*2),theme(maxWidth.5xl)))/2)]">
	<Button class="border" width="w-min" rounded="rounded-full" color="text-black" bg="bg-white">
		<Coins bind:this={coins} />
		<span class="relative">Tips</span><!-- position on top of coins -->
	</Button>
</div>