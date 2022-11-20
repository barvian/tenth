import { dev } from '$app/environment';
import { setupServer } from 'msw/node';
import changeHandlers from './change';

if (dev) {
  const server = setupServer(
    ...changeHandlers
  )
  
  server.listen({onUnhandledRequest: 'bypass'})
  console.info('🔶 Mock server installed')
  
  process.once('SIGINT', () => server.close())
  process.once('SIGTERM', () => server.close())
}