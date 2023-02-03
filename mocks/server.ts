import handlers from './handlers'

export async function mockRequests() {
	const msw = await import('msw/lib/node/index.js')
	console.log('handlers', handlers, msw)
	const server = msw.setupServer(...handlers)

	server.listen({ onUnhandledRequest: 'bypass' })
	console.info('🔶 Mock server installed')

	process.once('SIGINT', () => server.close())
	process.once('SIGTERM', () => server.close())
}
