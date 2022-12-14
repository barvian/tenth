<script lang="ts">
	import Button from "~/components/Button.svelte";
	import Money from "~/components/inputs/Money.svelte";
	import type { ActionData, PageData } from "./$types";
    import Coins from "~/components/TipJar/Coins.svelte";
    import colors from 'tailwindcss/colors';
    
    export let data: PageData
    export let form: ActionData

    let coins: Coins
</script>

<style>
    :global(:root) {
        @apply select-none
    }

    :global(nav > *, nav .contents > *) {
        @apply relative z-50
    }
    
    *, :global(footer > *) {
        @apply relative z-10
    }
</style>

<Coins bind:this={coins} coinColor={colors.neutral[100]} coinSize={24} rounded={false} />

<h1 class="text-4xl font-bold text-center mb-5">Support Tenth</h1>
<p class="text-lg text-gray-500 mb-8 leading-snug text-center">Please enter the 6-digit code we sent to.</p>
<form method="POST" class="relative max-w-xs">
    <Money required showRequired={false} border="border-black focus:border-rose-400" shadow="shadow focus:shadow-rose-400/10" type="text" name="amount" placeholder="$0"
        description="Tips are not tax-deductible."
        descriptionAlign="text-center"
    >
        <Button type="submit" width="w-min" class="absolute inset-y-2 right-2" rounded="rounded-xl" shadow="hover:shadow hover:-translate-y-1 active:translate-y-0 active:shadow-transparent" padding="px-4">
            Tip
        </Button>
    </Money>
</form>