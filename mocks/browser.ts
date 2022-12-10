import { dev } from '$app/environment';
import { setupWorker } from 'msw';
import handlers from './handlers';

if (dev) {
  const worker = setupWorker(...handlers)
  worker.start()
}