import env from '$env'
import stripe from 'stripe'

export const stripeClient = new stripe(env.SECRET_STRIPE_KEY, {
	apiVersion: '2022-08-01'
})

export async function deleteDefaultSource(customerId: string) {
	const stripeCustomer = await stripeClient.customers.retrieve(customerId)
	if (!stripeCustomer.deleted && stripeCustomer.default_source) {
		await stripeClient.customers.deleteSource(
			stripeCustomer.id,
			stripeCustomer.default_source as string
		)
	}
}

export default stripeClient
