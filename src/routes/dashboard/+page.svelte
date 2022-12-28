<script lang="ts">
	import { fade } from 'svelte/transition'
	import type { Nonprofit } from '~/lib/change'
	import Charity from '~/components/Charity/Charity.svelte'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Designated from '~/components/Charity/Designated.svelte'
	import Dropdown from '~/components/Dropdown/Dropdown.svelte'
	import DropdownItem from '~/components/Dropdown/Item.svelte'
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'
	import type { Designation } from '~/lib/db'
	import type { PageData } from './$types'

	export let data: PageData

	$: monthlyPercentage = parseFloat(
		(((data.profile?.percentage ?? 0) / 12) * 100).toFixed(3)
	)

	let adding: Nonprofit[] = []
	// Remove them when they're in designated
	$: adding = adding.filter(
		(c) => !data.designated.find((d: Designation) => d.nonprofit.id === c.id)
	)

	// Silently fail if they try to re-add a charity
	function handleCharitySelect(event: CustomEvent<Nonprofit>) {
		if (
			adding.find((c) => event.detail.id === c.id) ||
			data.designated.find(
				(d: Designation) => d.nonprofit.id === event.detail.id
			)
		)
			event.preventDefault()
		else adding = [...adding, event.detail]
	}
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
		class="js:contents no-js:inline no-js:whitespace-nowrap"
		let:loading
		let:submit
	>
		<Percentage
			value={data.profile?.percentage}
			{loading}
			on:change={() => submit()}
		/>
		<noscript class="inline">
			<Button
				width="w-min"
				class="h-[3em] align-middle ml-1 shadow-bank/10"
				padding="px-5"
				bg="bg-bank"
				color="text-bank-readable">Save</Button
			>
		</noscript>
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
		organization{#if data.designated.length > 1}s{/if}:
	{:else}
		We'll donate {monthlyPercentage}% of your account each month if you select
		some organizations:
	{/if}
</p>

<Form id="update-split" action="?/update-split" />
<div class="flex flex-col gap-5 w-full max-w-md">
	<Designated
		designated={data.designated}
		form="update-split"
		removeAction="?/remove-charity"
		let:dirty
		let:valid
		let:editing
	>
		<svelte:fragment slot="editor">
			<!-- Optimistic UI for updates -->
			<Form
				id="add-charity"
				action="?/add-charity"
				on:error={(event) => {
					const { formData } = event.detail
					const change_id = formData.get('change_id')
					adding = adding.filter((c) => c.id !== change_id)
				}}
			>
				{#each adding as charity (charity.id)}
					<Charity {charity}>
						<!-- Loading indicator -->
						<Button unstyled disabled type="button" class="text-gray-300" />
					</Charity>
				{/each}
			</Form>
			{#if editing}
				<div in:fade|local={{ duration: 250 }}>
					<Button form="update-split" disabled={!dirty || !valid}
						>Update split</Button
					>
				</div>
			{/if}
			{#if data.designated.length > 1}
				<noscript>
					<Button form="update-split">Update split</Button>
				</noscript>
			{/if}
		</svelte:fragment>
		{#if !editing}
			<div in:fade|local={{ duration: 250 }}>
				<CharitySearch
					form="search-charity"
					addForm="add-charity"
					on:select={handleCharitySelect}
					label={data.designated.length > 0
						? 'Support another charity'
						: 'Which charity do you want to support?'}
				/>
			</div>
		{/if}
	</Designated>
</div>
