import { SECRET_STRIPE_KEY } from '$env/static/private'
import stripe from 'stripe'

export default new stripe(SECRET_STRIPE_KEY, {
	apiVersion: '2022-08-01'
})
