<script context="module" lang="ts">
	import env from '$env'
	import { getSupabase } from '@supabase/auth-helpers-sveltekit'
	import { error, redirect } from '@sveltejs/kit'
	import { withLoadAuth } from '~/lib/auth'
	import type { Designation } from '~/lib/db'
	import { parseJSON } from '~/lib/fetch'
	import type { Organization, OrganizationSearchResults } from '~/lib/pledge'
	import { getValues, success } from '~/lib/actions'
	import type * as $types from './dashboard/$types'

	export const getData = withLoadAuth(async (event) => {
		const { supabaseClient } = await getSupabase(event)
		const parent = await event.parent()

		// Redirect if linking process isn't complete
		if (!parent.profile?.plaid_access_token) throw redirect(303, '/link')

		const { data } = await supabaseClient
			.from('designated')
			.select('pledge_id, weight')
			.order('created_at', { ascending: true })

		let designated: Designation[] = []
		if (data?.length) {
			designated = await Promise.all(
				data.map(async (row) => ({
					organization: await event
						.fetch(`/api/pledge/organizations/${row.pledge_id}.json`)
						.then((r) => parseJSON<Organization>(r)),
					weight: row.weight
				}))
			)
		}

		return {
			meta: {
				title: 'Dashboard',
				description: `Manage your donation amount, designated charities, and bank account on Tenth`
			},
			designated
		}
	}) satisfies $types.PageLoad

	const SEARCH_RESULTS_LIMIT = 10

	const updatePercentage = (async (event) => {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		const { error: updateError } = await supabaseClient
			.from('users')
			.update({
				percentage: +(formData.get('percentage') as string)
			})
			.eq('user_id', session.user.id)
		if (updateError) throw updateError

		return success(formData)
	}) satisfies $types.Action

	const updateSplit = (async (event) => {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		// omit the internal fields and convert the form data to an object
		const split = getValues(formData)
		const length = Object.keys(split).length

		const { error: updateError } = await supabaseClient
			.from('designated')
			.upsert(
				Object.keys(split).map((pledge_org_id) => ({
					user_id: session.user.id,
					pledge_org_id,
					weight: (+split[pledge_org_id] / 100) * length
				}))
			)
		if (updateError) throw updateError

		// Don't return the split values, they'll get updated by the load
		return success(formData, null, { omit: Object.keys(split) })
	}) satisfies $types.Action

	const searchCharities = (async (event) => {
		const { request } = event
		const formData = await request.formData()

		const q = formData.get('q') as string
		// Ignore empty queries
		if (!q.trim()) return success(formData)

		const response = await fetch(
			`https://api.pledge.to/v1/organizations?` +
				new URLSearchParams({
					q,
					per_page: SEARCH_RESULTS_LIMIT.toString()
				}),
			{
				headers: { Authorization: `Bearer ${env.PLEDGE_KEY}` }
			}
		).then((r) => parseJSON<OrganizationSearchResults>(r))

		return success(formData, response.results)
	}) satisfies $types.Action

	const addCharity = (async (event) => {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()

		const { error: insertError } = await supabaseClient
			.from('designated')
			.insert({
				pledge_id: formData.get('pledge_id') as string
			})
		if (insertError) throw insertError

		// Clear the query if success, but not with omit
		// because then the Input wouldn't show it
		formData.set('q', '')
		return success(formData)
	}) satisfies $types.Action

	const removeCharity = (async (event) => {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')
		const formData = await request.formData()
		const id = formData.get('id') as string

		const { error: deleteError } = await supabaseClient
			.from('designated')
			.delete()
			.eq('pledge_id', id)
		if (deleteError) throw deleteError

		return success(formData)
	}) satisfies $types.Action

	export const serverActions = {
		'update-percentage': updatePercentage,
		'update-split': updateSplit,
		'search-charities': searchCharities,
		'add-charity': addCharity,
		'remove-charity': removeCharity
	} satisfies $types.Actions
</script>

<script lang="ts">
	import { fade } from 'svelte/transition'
	import Charity from '~/components/Charity/Charity.svelte'
	import CharitySearch from '~/components/Charity/CharitySearch.svelte'
	import Designated from '~/components/Charity/Designated.svelte'
	import Dropdown from '~/components/Dropdown/Dropdown.svelte'
	import DropdownItem from '~/components/Dropdown/Item.svelte'
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Percentage from '~/components/forms/Percentage.svelte'

	export let data: $types.PageData

	$: monthlyPercentage = parseFloat(
		(((data.profile?.percentage ?? 0) / 12) * 100).toFixed(3)
	)

	let adding: Organization[] = []
	// Remove them when they're in designated
	$: adding = adding.filter(
		(c) => !data.designated.find((d: Designation) => d.organization.id === c.id)
	)

	// Silently fail if they try to re-add a charity
	function handleCharitySelect(event: CustomEvent<Organization>) {
		if (
			adding.find((c) => event.detail.id === c.id) ||
			data.designated.find(
				(d: Designation) => d.organization.id === event.detail.id
			)
		)
			event.preventDefault()
		else adding = [...adding, event.detail]
	}
</script>

<Form id="search-charities" action="?/search-charities" />

<div role="heading" aria-level={1} class="text-4xl max-w-2xl text-center">
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
			<Button width="w-min" class="h-[3em] align-middle ml-1" padding="px-5"
				>Save</Button
			>
		</noscript>
	</Form>
	of
	<Dropdown
		class="align-baseline"
		menuClass="min-w-[160px]"
		summaryClass={[
			'border-current leading-extra-tight border-b-4 mb-2 border-dotted text-orange-500',
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
	every year.
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
					const pledge_id = formData.get('pledge_id')
					adding = adding.filter((c) => c.id !== pledge_id)
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
					form="search-charities"
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
