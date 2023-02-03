import { setupServer } from 'msw/node'
import handlers from './handlers'

export async function mockRequests() {
	const server = setupServer(...handlers)

	server.listen({ onUnhandledRequest: 'bypass' })
	console.info('🔶 Mock server installed')

	process.once('SIGINT', () => server.close())
	process.once('SIGTERM', () => server.close())
}
