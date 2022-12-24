<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import { toast } from '@zerodevx/svelte-toast'
	import type { Plaid } from 'plaid-link'
	import { onDestroy } from 'svelte'
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Change from '~/components/icons/Change.svelte'
	import X from '~/components/icons/X.svelte'
	import MultiStep from '~/components/MultiStep/MultiStep.svelte'
	import Step from '~/components/MultiStep/Step.svelte'
	import { loadScript } from '~/lib/component'
	import { parseJSON } from '~/lib/fetch'
	import type { PageData } from './$types'

	export let data: PageData

	let multiStep: MultiStep

	let plaidLoaded = loadScript(
		'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
	)
	let plaidHandler: Plaid.LinkHandler
	const openPlaid = (token: string, opts: Partial<Plaid.CreateConfig> = {}) =>
		new Promise<[string, Plaid.OnSuccessMetaData]>((resolve, reject) => {
			plaidHandler?.destroy()
			plaidHandler = window.Plaid.create({
				...opts,
				token,
				onSuccess(public_token, metadata) {
					resolve([public_token, metadata])
				},
				onExit(error) {
					reject(error)
				}
			})
			plaidHandler.open()
		})

	let linking = false

	async function linkChange() {
		linking = true

		try {
			const link_token = await fetch('/api/change/link-token', {
				method: 'POST'
			}).then(parseJSON)

			let [plaid_public_token, metadata] = await openPlaid(link_token)
			await fetch('/api/change/attach', {
				method: 'POST',
				body: JSON.stringify({
					link_token,
					plaid_public_token,
					bank_account_id: metadata.accounts[0].id,
					plaid_institution_id: metadata.institution.institution_id,
					plaid_account_mask: metadata.accounts[0].mask,
					plaid_account_type: metadata.accounts[0].type,
					plaid_account_subtype: metadata.accounts[0].subtype
				})
			}).then(parseJSON)

			await invalidateAll() // This messes up the history stack, so do it first
			multiStep?.next()
		} catch (e) {
			if (e)
				toast.push(
					(e as any).display_message ?? 'Could not link bank account',
					{
						classes: ['error']
					}
				)
		}

		linking = false
	}

	async function linkStripe() {
		linking = true

		try {
			const link_token = await fetch('/api/plaid/link-token', {
				method: 'POST'
			}).then(parseJSON)

			let [plaid_public_token, metadata] = await openPlaid(link_token, {
				// I really wish Plaid let you filter institutions instead of just
				// by routing numbers
				onEvent(_, metadata) {
					if (
						data.profile?.institution_id &&
						metadata?.institution_id &&
						metadata.institution_id !== data.profile.institution_id
					) {
						plaidHandler.exit({ force: true })
						toast.push(`Please select your ${data.institution.name} account`, {
							classes: ['error']
						})
					} else if (
						data.profile?.plaid_account_mask &&
						metadata?.account_number_mask &&
						metadata.account_number_mask !== data.profile.plaid_account_mask
					) {
						plaidHandler.exit({ force: true })
						toast.push(
							`Please select your account ending in ${data.profile.plaid_account_mask}`,
							{ classes: ['error'] }
						)
					}
				}
			})

			await fetch('/api/stripe/add-bank-account', {
				method: 'POST',
				body: JSON.stringify({
					plaid_public_token,
					bank_account_id: metadata.accounts[0].id
				})
			}).then(parseJSON)

			multiStep?.complete()
			await invalidateAll()
			await goto('/dashboard')
		} catch (e) {
			if (e)
				toast.push(
					(e as any).display_message ?? 'Could not link bank account',
					{
						classes: ['error']
					}
				)
		}

		linking = false
	}

	onDestroy(() => {
		plaidHandler?.destroy()
	})
</script>

<MultiStep bind:this={multiStep} let:next let:reset inconspicuous={false}>
	<Step>
		<h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
			Link your bank account with <Change
				class="inline-block align-baseline ml-[0.15em] h-[0.7em]"
			/>
		</h2>
		<p class="text-lg max-w-xl leading-snug mb-10 text-gray-500 text-center">
			Giving our donation partner <a href="https://getchange.io">Change</a>
			access to your account lets them withdraw your donations directly, saving you
			<mark>~1% in processing fees</mark>.
		</p>
		{#if data.profile?.plaid_institution_id && !data.profile.stripe_linked}
			<div
				class="w-full max-w-xs bg-white rounded-2xl flex gap-x-3 items-center border px-4 pt-2 pb-2.5 mb-8 shadow"
			>
				<div class="flex-1 pt-0.5">
					<h3 class="text-gray-450 text-[0.62rem] mb-1">Linked account</h3>
					{#if data.institution?.logo}
						<img
							class="w-5 float-left mr-1.5"
							alt="{data.institution?.name} logo"
							src="data:image/png;base64,{data.institution?.logo}"
						/>
					{/if}
					<div class="overflow-hidden font-medium text-lg">
						{data.institution?.name}
						<span class="inline-block">
							<span
								class="tracking-tighter leading-none inline-block text-[1.3em] mr-0.5"
								>&bull;&bull;</span
							>{data.profile?.plaid_account_mask}
						</span>
					</div>
				</div>
				<Form
					id="unlink"
					action="?/unlink"
					on:submit={(event) => {
						if (!confirm('Are you sure you want to unlink this account?'))
							event.preventDefault()
					}}
					on:load={reset}
				>
					<Button
						unstyled
						class="text-gray-300 hover:text-red-500 disabled:text-red-500 transition-color py-2 pl-2"
					>
						<X class="h-4" />
					</Button>
				</Form>
			</div>
			<Button class="max-w-xs" on:click={next}>Continue</Button>
		{:else}
			<Button
				name="link"
				class="max-w-xs"
				on:click={linkChange}
				loading={!$plaidLoaded || linking}
			>
				Link with Change
			</Button>
		{/if}
	</Step>
	<Step>
		<h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
			Link your {data.institution?.name ?? 'bank'} account with Tenth
		</h2>
		<p class="text-lg max-w-xl leading-snug mb-10 text-gray-500 text-center">
			Tenth also needs access to your account to check your balance and tell
			Change how much to donate each month.
		</p>
		<Button
			name="link"
			class="max-w-xs"
			on:click={linkStripe}
			loading={!$plaidLoaded || linking}
		>
			<span class="flex w-full"
				><span>Link with Tenth</span><span
					class="font-bold inline-block ml-auto">$1.55</span
				></span
			>
		</Button>
		<p class="text-gray-450 text-center max-w-xl leading-snug mt-10">
			We’ll charge you a one-time verification fee of $1.55 after successfully
			linking.
		</p>
	</Step>
</MultiStep>
