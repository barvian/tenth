<script lang="ts">
	import colors from 'tailwindcss/colors'
	import Coins from '~/components/Coins.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Radio from '~/components/forms/Radio.svelte'
	import Tip from '~/components/forms/Tip.svelte'
	import Recur from '~/components/icons/Recur.svelte'
	import supabaseClient from '~/lib/db'
	import type { PageData } from './$types'

	export let data: PageData

	let coins: Coins

	let ytd = 0
	const handlePageUpdate = () => (ytd = data.ytd)
	$: data.ytd, handlePageUpdate()

	const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'usd',
		maximumFractionDigits: 0
	})

	supabaseClient
		.channel('public:tips')
		.on(
			'postgres_changes',
			{
				event: 'UPDATE',
				schema: 'public',
				table: 'tips'
			},
			(payload) => {
				if (payload.errors.length > 0) return
				ytd = payload.new.ytd
				if (
					new Date(payload.new.updated_at).getFullYear() >
						new Date(payload.old.updated_at).getFullYear() ||
					payload.new.ytd > payload.old.ytd
				) {
					coins?.addCoin()
				}
			}
		)
		.subscribe()
</script>

<Coins
	class="-z-10"
	bind:this={coins}
	coinColor={colors.neutral[100]}
	coinSize={24}
	rounded={false}
/>

<h1 class="text-4xl font-bold text-center mb-5">Support Tenth</h1>
<p class="text-xl max-w-xl text-gray-500 mb-8 leading-snug text-center">
	Tenth is a <a href="https://barvian.me" class="text-rose-500 font-medium"
		>one-man</a
	> project and charges only enough to cover its operating expenses. Tips further
	support its development.
</p>
<p
	class="bg-gray-100 rounded-xl px-4 py-3 w-full max-w-2xs text-center mb-4 text-gray-500"
>
	<mark class="font-medium">{formatter.format(ytd / 100)}</mark> received in
	tips this year{#if ytd > 0}&nbsp;❤️{/if}
</p>
<Form id="tip" class="relative w-full max-w-2xs">
	<blockquote slot="complete" class="w-full max-w-2xs mt-2" let:values>
		<p
			class="animate-fly-t rounded-2xl bg-white shadow-md border p-6 relative before:border-8 before:border-transparent before:border-t-black before:absolute before:top-[calc(100%+1px)] before:left-6 after:border-8 after:border-transparent after:border-t-white after:absolute after:top-full after:left-6"
		>
			{#if values?.frequency === 'recurring' && parseFloat(values?.recurring) === 0}
				Your monthly tip has been removed. Thanks for your time supporting Tenth
				:)
			{:else if values?.frequency === 'recurring'}
				Thanks a lot for the monthly tip! You can change it at any time by
				coming back to this page :)
			{:else}
				Thanks a lot for the tip! I'm glad you're enjoying Tenth :)
			{/if}
		</p>
		<cite class="px-4 mt-6 block text-gray-500 not-italic">
			<img
				class="rounded-full h-8 inline-block align-middle mr-2"
				alt="Maxwell Barvian, creator of Tenth"
				src="/img/max.jpg"
			/>
			Maxwell Barvian, founder
		</cite>
	</blockquote>
	<div class="grid grid-cols-2 gap-x-3 gap-y-4 relative">
		<Radio
			name="frequency"
			value="once"
			inputClass="peer/once"
			checked={!data.profile?.recurring_tip}
			disabled={!data.profile?.stripe_linked}
			border="border sibling-checked:border-rose-400"
			rounded="rounded-xl"
			color="sibling-checked:text-rose-500"
			bg="bg-white sibling-not-disabled:sibling-checked:bg-rose-400/10"
			>One time</Radio
		>
		<Radio
			class="whitespace-nowrap"
			inputClass="peer/monthly"
			name="frequency"
			value="recurring"
			checked={Boolean(data.profile?.recurring_tip)}
			disabled={!data.profile?.stripe_linked && !data.profile?.recurring_tip}
			rounded="rounded-xl"
			border="border sibling-checked:border-rose-400"
			color="sibling-checked:text-rose-500"
			bg="bg-white sibling-not-disabled:sibling-checked:bg-rose-400/10"
		>
			<Recur
				class="inline-block align-middle h-3.5 -mt-[0.15em] mr-0.5"
				strokeWidth={2.5}
			/>
			Monthly
		</Radio>
		<div
			class="hidden peer-checked/monthly:block peer-checked/monthly:animate-tooltip-t mb-4 !absolute bottom-full right-0 w-full bg-black text-white px-4 py-3 rounded-xl after:border-8 after:border-transparent after:border-t-black after:absolute after:top-full after:right-1/4 after:-mr-3"
		>
			{#if data.profile?.recurring_tip}
				You're currently managing your monthly tip.
			{:else}
				A monthly tip will replace the 50¢ monthly fee. Change or remove the tip
				from this page.
			{/if}
		</div>
		<Tip
			name="once"
			disabled={!data.profile?.stripe_linked}
			class="col-span-full peer-checked/monthly:hidden"
		/>
		<Tip
			name="recurring"
			disabled={!data.profile?.stripe_linked && !data.profile?.recurring_tip}
			class="col-span-full peer-checked/once:hidden"
			amount={data.profile?.recurring_tip}
			buttonLabel="Save"
		/>
	</div>
</Form>
