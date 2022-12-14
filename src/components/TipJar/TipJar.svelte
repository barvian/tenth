<script lang="ts">
	import Button from "../Button.svelte";
	import Coins from "./Coins.svelte";
	import supabaseClient from '~/lib/db'
	import { onDestroy, onMount } from "svelte";
	import Money from "../inputs/Money.svelte";

	let coins: Coins

	const channel = supabaseClient.channel('tips')
	let subscribed = false
	onMount(() => {
		channel
			.on('broadcast', { event: 'tip' }, handleTip)
			.subscribe(status => {
				subscribed = status === 'SUBSCRIBED'
			})
		
		return () => {
			channel.unsubscribe()
		}
	})

	let tipId: string

	function handleTip(event: any) {
		if (event?.payload?.id === tipId) return // this was ours
		coins?.addCoin()
	}

	// if (subscribed) {
		// channel.send({
		// 	type: 'broadcast',
		// 	event: 'tip',
			// payload: { id: tipId }
		// })
	// }
</script>

<!-- containerWidth = min(90vw,theme(maxWidth.5xl) -->
<!-- paddingX = pagePadding + (90vw-containerWidth)/2 -->
<!-- Repeat for every max-width breakpoint change, if any -->
<details class="fixed bottom-9 right-[calc(theme(padding.page)+calc(100vw-(theme(padding.page)*2)-min(100vw-(theme(padding.page)*2),theme(maxWidth.5xl)))/2)]">
	<Button as="summary" class="border" width="w-min" rounded="rounded-full" color="text-black" bg="bg-white">
		<Coins class="clip-[inset(2.5px_round_999px)]" bind:this={coins} />
		<span class="relative">Tips</span><!-- position on top of coins -->
	</Button>
	<div class="rounded-2xl border z-50 bg-white right-0 absolute bottom-full mb-6 min-w-[260px] shadow-md animate-fly-t" role="dialog">
		<div class="px-2 mx-2 pt-4 pb-2">
			tip!
		</div>
		<form method="POST" class="relative w-full px-4 pb-4">
			<Money bg="bg-transparent" align="text-center" rounded="rounded-xl" shadow={false} padding="p-2.5" required showRequired={false} descriptionAlign="text-center" type="text" name="amount" placeholder="$0">
				Tips are not tax-deductible.
			</Money>
			<Button type="submit" class="mt-2.5" rounded="rounded-xl" shadow="hover:shadow hover:-translate-y-1 active:translate-y-0 active:shadow-transparent" padding="p-3">
				Tip
			</Button>
		</form>
	</div>
</details>