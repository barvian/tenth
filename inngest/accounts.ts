import env from '$env'
import { createScheduledFunction, createStepFunction, Inngest } from 'inngest'
import type Stripe from 'stripe'
import AccountStatusChanged from '~/emails/AccountStatusChanged.svelte'
import serviceRoleClient, { getUserForStripeCustomerId } from '~/lib/db.server'
import { sendMail } from '~/lib/mail.server'
import stripeClient from '~/lib/stripe.server'
import type { Events } from '~/types/inngest'
import type { Database } from '~/types/supabase'

export const setup = createStepFunction(
	'Setup account',
	'stripe/financial_connections.account.created',
	({ event, tools }) => {
		const customer = event.data.object?.account_holder?.customer
		if (!customer)
			throw new Error(
				`Received a financial connections account created event without a customer, id: ${event.data.object?.id}`
			)

		const user = tools.run('Get user data', () =>
			getUserForStripeCustomerId(
				customer,
				'id, first_name, last_name, stripe_cus_id, last_acceptance'
			)
		)

		const pi = tools.run('Create payment intent', () =>
			stripeClient.paymentIntents.create({
				confirm: true,
				customer: user.stripe_cus_id,
				description: 'Tenth setup fee',
				statement_descriptor: 'Setup fee',
				payment_method_types: ['us_bank_account'],
				payment_method_data: {
					us_bank_account: {
						financial_connections_account: event.data.object.id
					},
					type: 'us_bank_account',
					billing_details: {
						name: `${user.first_name} ${user.last_name}`
					}
				},
				amount: 155, // TODO: use env variable?
				currency: 'usd',
				mandate_data: {
					customer_acceptance:
						user.last_acceptance as unknown as Stripe.PaymentIntentCreateParams.MandateData.CustomerAcceptance
				},
				setup_future_usage: 'off_session'
			})
		)

		tools.run('Insert into accounts', async () => {
			const { error } = await serviceRoleClient.from('accounts').insert({
				user_id: user.id,
				stripe_pm_id: pi.payment_method as string,
				stripe_fca_id: event.data.object.id,
				institution_name: event.data.object.institution_name,
				last4: event.data.object.last4
			})
			if (error) throw error
		})
	}
)

// app/donation_group.retry.submitted

const inngest = new Inngest<Events>({
	name: 'Scheduling Backend',
	eventKey: env.INNGEST_EVENT_KEY
})

export const dispatchRecurs = createScheduledFunction(
	'Dispatch account.recur events',
	'0 0 20 * *',
	async () => {
		const { data: accounts, error } = await serviceRoleClient.from('accounts')
			.select(`
				stripe_fca_id,
				users (
					stripe_cus_id,
					email
				)
			`)
		if (error || !accounts) throw error

		const events = accounts.map(({ users, ...data }) => ({
			name: 'app/account.recur',
			data,
			user: Array.isArray(users) ? users[0] : users
		}))
		if (events.length > 0) await inngest.send(events)
		return `${accounts.length} events dispatched`
	}
)

export const createTransaction = createStepFunction(
	'New recurring donation',
	'app/account.recur',
	({ event, tools }) => {
		const customer_id = event.user?.stripe_cus_id
		if (!customer_id)
			throw new Error(
				`No user.stripe_cus_id passed in to app/account.recur for account ID ${event.data.id}`
			)

		tools.run('Trigger account refresh', () =>
			stripeClient.financialConnections.accounts.refresh(
				event.data.stripe_fca_id,
				{ features: ['balance'] }
			)
		)

		const refreshedAcc = tools.waitForEvent(
			'stripe/financial_connections.account.refreshed_balance',
			{
				if: `data.object.id == '${event.data.stripe_fca_id}'`,
				timeout: '1 day'
			}
		)

		const dispute = tools.waitForEvent('stripe/charge.dispute.created', {
			if: `data.object.payment_intent == '${transaction.stripe_pi_id}'`,
			timeout: '60 days'
		})
		if (!dispute) {
			tools.run('Create donation PI', () =>
				stripeClient.paymentIntents.create({
					payment_method_types: ['us_bank_account'],
					payment_method: event.data.stripe_pm_id,
					customer: customer_id,
					confirm: true,
					amount: 100,
					currency: 'usd'
				})
			)
		}
	}
)

const updateAccountStatus = async (
	stripe_fca_id: string,
	status: Database['public']['Enums']['account_status']
) => {
	const { error } = await serviceRoleClient
		.from('accounts')
		.update({ status })
		.eq('stripe_fca_id', stripe_fca_id)
	if (error) throw error
}

export const deactivate = createStepFunction(
	'Deactivate account',
	'stripe/financial_connections.account.deactivated',
	({ event, tools }) => {
		tools.run('Update account status', () =>
			updateAccountStatus(event.data.object.id, event.data.object.status)
		)
		// TODO: send notification email
	}
)

export const reactivate = createStepFunction(
	'Reactivate account',
	'stripe/financial_connections.account.reactivated',
	({ event, tools }) => {
		tools.run('Update account status', () =>
			updateAccountStatus(event.data.object.id, event.data.object.status)
		)
		// TODO: send notification email
	}
)

export const disconnect = createStepFunction(
	'Disconnect account',
	'stripe/financial_connections.account.disconnected',
	({ event, tools }) => {
		tools.run('Update account status', () =>
			updateAccountStatus(event.data.object.id, event.data.object.status)
		)

		const customer = event.data.object?.account_holder?.customer
		if (!customer)
			throw new Error(
				`Received a financial connections account disconnected event without a customer, id: ${event.data.object?.id}`
			)

		const user = tools.run('Get user data', () =>
			getUserForStripeCustomerId(customer, 'email')
		)

		tools.run('Send mail', () =>
			sendMail(
				AccountStatusChanged,
				{
					event: 'disconnected',
					last4: event.data.object?.last4,
					institution: event.data.object?.institution_name
				},
				{ to: user.email }
			)
		)
	}
)

export default [
	setup,
	dispatchRecurs,
	createTransaction,
	deactivate,
	reactivate,
	disconnect
]
