<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation'
	import { PUBLIC_STRIPE_KEY } from '$env/static/public'
	import { loadStripe } from '@stripe/stripe-js'
	import { toast } from '@zerodevx/svelte-toast'
	import Button from '~/components/forms/Button.svelte'
	import { parseJSON } from '~/lib/fetch'

	let stripeClient = loadStripe(PUBLIC_STRIPE_KEY)

	let linking = false

	async function link() {
		linking = true

		try {
			const clientSecret = await fetch(
				'/api/stripe/financial-connections/session',
				{
					method: 'POST'
				}
			).then(parseJSON)

			const financialConnectionsSessionResult = await (
				await stripeClient
			)?.collectFinancialConnectionsAccounts({ clientSecret })
			if (!financialConnectionsSessionResult) throw undefined
			else if (financialConnectionsSessionResult.error)
				throw financialConnectionsSessionResult.error

			// TODO: wait for accounts
			const fcSession =
				financialConnectionsSessionResult.financialConnectionsSession

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
</script>

<h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
	Link your bank account with Tenth
</h2>
<p class="max-w-xl leading-snug mb-10 text-gray-500 text-center">
	By clicking Link with Tenth, you authorize Tenth to debit the bank account
	specified for any amount owed for charges arising from your use of Tenth’s
	services, pursuant to Tenth's website and terms, until this authorization is
	revoked. You may amend or cancel this authorization at any time by unlinking
	your bank account from the Tenth dashboard. If you use Tenth's services
	pursuant to Tenth's terms, you authorize Tenth to debit your bank account
	periodically. Payments that fall outside of the regular debits authorized
	above will only be debited after your authorization is obtained.
</p>
{#await stripeClient}
	<Button name="link" class="max-w-xs" on:click={link} loading>
		Link with Tenth
	</Button>
{:then}
	<Button name="link" class="max-w-xs" on:click={link} loading={linking}>
		Link with Tenth
	</Button>
{/await}
