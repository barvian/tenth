import { PLAID_CLIENT_ID, SECRET_PLAID_KEY } from '$env/static/private'
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid'

const configuration = new Configuration({
	basePath: PlaidEnvironments.sandbox,
	baseOptions: {
		headers: {
			'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
			'PLAID-SECRET': SECRET_PLAID_KEY
		}
	}
})

export default new PlaidApi(configuration)
