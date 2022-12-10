import stripe from 'stripe';
import { SECRET_STRIPE_KEY } from '$env/static/private';

export default new stripe(SECRET_STRIPE_KEY, {
    apiVersion: '2022-08-01'
})