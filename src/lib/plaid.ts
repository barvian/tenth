import { dev } from '$app/environment'
import { PLAID_CLIENT_ID, SECRET_PLAID_KEY } from '$env/static/private'
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const configuration = new Configuration({
	basePath: dev ? PlaidEnvironments.sandbox : PlaidEnvironments.production,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': SECRET_PLAID_KEY
		}
	}
})

export default new PlaidApi(configuration)
