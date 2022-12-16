import { dev } from '$app/environment'
import { setupServer } from 'msw/lib/node/index.js'
import handlers from './handlers'

if (dev) {
	const server = setupServer(...handlers)

	server.listen({ onUnhandledRequest: 'bypass' })
	console.info('🔶 Mock server installed')

	process.once('SIGINT', () => server.close())
	process.once('SIGTERM', () => server.close())
}
