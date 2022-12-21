<script lang="ts">
	import { toast } from '@zerodevx/svelte-toast'
	import type { Nonprofit } from 'types/change'
	import Charity from '~/components/Charity/Charity.svelte'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'
	import X from '~/components/icons/X.svelte'
	import { clickOutside } from '~/lib/actions'
	import supabaseClient from '~/lib/db'
	import type { PageData } from './$types'

	export let data: PageData

	let designated: Nonprofit[]
	$: designated = data.designated || []

	$: monthlyPercentage = parseFloat(
		(((data.profile?.percentage ?? 0) / 12) * 100).toFixed(3)
	)

	let adding: Record<string, boolean> = {}
	async function addCharity(event: CustomEvent) {
		const charity = event.detail as Nonprofit
		if (designated.find((c) => c.id === charity.id)) return
		designated = [...designated, charity]
		adding[charity.id] = true
		const { error } = await supabaseClient.from('designated').insert({
			change_id: charity.id
		})
		if (error) {
			designated = designated.filter((d) => d.id !== charity.id)
			toast.push(`Couldn't add charity. Please try again later.`, {
				classes: ['error']
			})
		} else {
			adding[charity.id] = false
		}
	}

	let bankOpen = false
</script>

<div
	role="heading"
	aria-level={1}
	class="text-4xl max-w-2xl text-center font-bold"
>
	{#if designated.length > 0}
		We're donating
	{:else}
		We'll donate
	{/if}
	<Form action="?/update-percentage" let:loading let:submit>
		<Percentage value={data.profile?.percentage} {loading} on:change={submit} />
	</Form>
	of your
	<details
		class="group relative inline-block align-baseline"
		bind:open={bankOpen}
		use:clickOutside
		on:outclick={() => (bankOpen = false)}
	>
		<summary
			class="border-current leading-extra-tight border-b-4 mb-2 border-dotted text-bank"
			class:whitespace-nowrap={data.institution?.logo}
			aria-haspopup="menu"
		>
			{#if data.institution?.logo}
				<img
					class="h-9 inline-block -mt-1"
					alt="{data.institution?.name} logo"
					src="data:image/png;base64,{data.institution?.logo}"
				/>
			{:else}
				{data.institution?.name}
			{/if}
			<span class="whitespace-nowrap">
				<span
					class="tracking-tighter leading-none inline-block text-[1.3em] mr-0.5"
					>&bull;&bull;</span
				>{data.profile?.plaid_account_mask}
				<svg
					class="inline-block align-middle h-[0.7em]"
					viewBox="0 13 18 33"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M3 25L9 31L15 25"
						stroke="currentColor"
						vector-effect="non-scaling-stroke"
						stroke-width="4"
						stroke-linecap="square"
						stroke-linejoin="round"
					/>
				</svg>
			</span>
		</summary>
		<div
			class="rounded-2xl text-left font-normal border text-base p-2 z-50 bg-white right-0 absolute top-full min-w-[160px] shadow-md animate-fly-b"
			role="menu"
		>
			<a
				href="/link"
				role="menuitem"
				class="block hover:bg-gray-100 p-3 leading-tight rounded-xl w-full"
				>Replace</a
			>
			<Form
				action="/link?/unlink"
				on:submit={(event) => {
					if (!confirm('Are you sure you want to unlink this account?'))
						event.preventDefault()
				}}
			>
				<Button
					type="submit"
					unstyled
					class="p-3 leading-tight text-left not-disabled:hover:bg-gray-100 text-red-500 rounded-xl block w-full"
					>Unlink</Button
				>
			</Form>
		</div>
	</details>
	account every year.
</div>
<p class="text-xl max-w-xl text-center text-gray-500 mt-5 mb-8">
	{#if designated.length > 0}
		We send
	{:else}
		We'll donate
	{/if}
	{monthlyPercentage}% of your account on the 20th of each month
	{#if designated.length > 0}
		to your selected charities{#if designated.length > 1}, divided evenly{/if}:
	{:else}
		if you select some charities:
	{/if}
</p>
{#if designated.length > 0}
	<div class="space-y-4 w-full max-w-md mb-5">
		{#each designated as item (item.id)}
			<Charity charity={item}>
				<Form action="?/remove-charity">
					<Button
						type="submit"
						unstyled
						name="id"
						value={item.id}
						loading={adding[item.id]}
						class="py-2 pl-2 text-gray-300 hover:text-red-500 {adding[item.id]
							? 'disabled:text-gray-300'
							: 'disabled:text-red-500'} transition-color"
					>
						<X class="h-3.5" />
					</Button>
				</Form>
			</Charity>
		{/each}
	</div>
{/if}
<CharitySearch
	class="max-w-md w-full"
	label={designated.length > 0
		? 'Support another charity'
		: 'Which charity do you want to support?'}
	on:charity={addCharity}
/>
