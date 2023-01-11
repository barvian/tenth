import { setupWorker } from 'msw'
import handlers from './handlers'

export function mockRequests() {
	const worker = setupWorker(...handlers)
	worker.start()
}
