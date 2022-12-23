<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { Nonprofit } from 'types/change'
	import Charity from '~/components/Charity/Charity.svelte'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Dropdown from '~/components/Dropdown/Dropdown.svelte'
	import DropdownItem from '~/components/Dropdown/Item.svelte'
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'
	import X from '~/components/icons/X.svelte'
	import { clickOutside, escape } from '~/lib/actions'
	import type { Designation } from '~/lib/db'
	import type { PageData } from './$types'

	export let data: PageData

	$: monthlyPercentage = parseFloat(
		(((data.profile?.percentage ?? 0) / 12) * 100).toFixed(3)
	)

	$: totalWeight = data.designated.reduce(
		(acc: number, cur: { weight: number }) => acc + cur.weight,
		0
	)

	let adding: Nonprofit[] = []
	$: adding = adding.filter(
		(c) => !data.designated.find((d: Designation) => d.nonprofit.id === c.id)
	)

	let editingPercentages = false

	let percentages: string[], initialPercentages: string[]
	const handlePageUpdate = () => {
		editingPercentages = false
		percentages = data.designated.map(
			(d: Designation) =>
				parseFloat(((d.weight / totalWeight) * 100).toFixed(1)) + ''
		)
		initialPercentages = [...percentages] // make a copy
	}
	$: data.designated, handlePageUpdate()

	$: percentagesDirty = percentages.some((p, i) => p != initialPercentages[i])
	$: totalPercentages = percentages.reduce(
		(total, p) => total + parseFloat(p),
		0
	)

	function stopEditingPercentages() {
		editingPercentages = false
		percentages = [...initialPercentages]
		if (document.activeElement?.getAttribute('form') === 'update-split')
			(document.activeElement as HTMLInputElement | HTMLButtonElement).blur()
	}

	let bankOpen = false
</script>

<Form id="search-charity" action="?/search-charity" />

<div
	role="heading"
	aria-level={1}
	class="text-4xl max-w-2xl text-center font-bold"
>
	{#if data.designated.length > 0}
		We're donating
	{:else}
		We'll donate
	{/if}
	<Form
		id="update-percentage"
		action="?/update-percentage"
		let:loading
		let:submit
	>
		<Percentage
			value={data.profile?.percentage}
			{loading}
			on:change={() => submit()}
		/>
	</Form>
	of your
	<Dropdown
		class="align-baseline"
		menuClass="min-w-[160px]"
		summaryClass={[
			'border-current leading-extra-tight border-b-4 mb-2 border-dotted text-bank',
			data.institution?.logo && 'whitespace-nowrap'
		]}
	>
		<svelte:fragment slot="summary">
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
		</svelte:fragment>
		<DropdownItem href="/link">Replace</DropdownItem>
		<Form
			id="unlink"
			action="/link?/unlink"
			on:submit={(event) => {
				if (!confirm('Are you sure you want to unlink this account?'))
					event.preventDefault()
			}}
		>
			<DropdownItem class="text-red-500">Unlink</DropdownItem>
		</Form>
	</Dropdown>
	account every year.
</div>
<p class="text-xl max-w-xl text-center text-gray-500 mt-5 mb-8">
	{#if data.designated.length > 0}
		Each month, we send {monthlyPercentage}% of your account to your selected
		charit{#if data.designated.length > 1}ies{:else}y{/if}:
	{:else}
		We'll donate {monthlyPercentage}% of your account each month if you select
		some charities:
	{/if}
</p>

<Form id="update-split" action="?/update-split" />
<div class="flex flex-col gap-5 w-full max-w-md">
	<div
		class="contents [&:focus-within_.charity]:border-gray-200 [&:focus-within_.charity]:shadow-transparent [&:focus-within_input]:shadow [&:focus-within_input]:border-black"
		use:clickOutside
		use:escape
		on:outclick={stopEditingPercentages}
		on:escape={stopEditingPercentages}
	>
		{#each data.designated as item, i (item.nonprofit.id)}
			<Charity
				charity={item.nonprofit}
				class={[
					'charity transition-all',
					editingPercentages && '!border-gray-200 !shadow-transparent'
				]}
			>
				{#if data.designated.length > 1}
					<Input
						name={item.nonprofit.id}
						type="number"
						step="0.1"
						bind:value={percentages[i]}
						on:focus={() => (editingPercentages = true)}
						form="update-split"
						shadow={[
							editingPercentages && '!shadow',
							'shadow-shadow focus:shadow-orange-500/10'
						]}
						border={[
							editingPercentages && '!border-black',
							'border-transparent hover:border-gray-300 focus:!border-orange-500'
						]}
						padding="pl-0 pr-5 pb-2 pt-2.5"
						rounded="rounded-lg"
						align="text-right"
						width="w-16"
						min="0"
						max="100"
					>
						<span
							class="absolute top-1/2 right-2 -translate-y-1/2 font-medium text-gray-450"
							>%</span
						>
					</Input>
				{/if}
				<Form id="remove-charity" action="?/remove-charity">
					<Button
						unstyled
						name="id"
						value={item.nonprofit.id}
						class="py-2 pl-2 text-gray-300 hover:text-red-500 transition-colors"
					>
						<X class="h-4" />
					</Button>
				</Form>
			</Charity>
		{/each}
		<!-- Optimistic UI for updates -->
		<Form id="add-charity" action="?/add-charity">
			{#each adding as charity (charity.id)}
				<Charity {charity}>
					<!-- Loading indicator -->
					<Button unstyled disabled type="button" class="text-gray-300" />
				</Charity>
			{/each}
		</Form>
		{#if editingPercentages}
			<div in:fade|local={{ duration: 250 }}>
				<Button
					form="update-split"
					disabled={!percentagesDirty || totalPercentages != 100}
					>Update split</Button
				>
			</div>
		{/if}
		{#if data.designated.length > 1}
			<noscript>
				<Button form="update-split">Update split</Button>
			</noscript>
		{/if}
	</div>
	{#if !editingPercentages}
		<div in:fade|local={{ duration: 250 }}>
			<CharitySearch
				form="search-charity"
				addForm="add-charity"
				on:select={(event) => (adding = [...adding, event.detail])}
				label={data.designated.length > 0
					? 'Support another charity'
					: 'Which charity do you want to support?'}
			/>
		</div>
	{/if}
</div>
