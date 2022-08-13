import type { Load } from '@sveltejs/kit';
import { browser } from '$app/env';
import { session } from '$app/stores';

// Wait for login to be synced with server (i.e. before redirect)
export const waitForSessionUser = () => new Promise((resolve, reject) => {
  const unsubscribe = session.subscribe(s => {
    if (s.user?.id && browser) {
      unsubscribe()
      resolve(s.user)
    }
  })
})

// Redirect if not logged in
export function withLoadAuth<L extends Load>(fn?: L): Load {
    return async (event) => {
        if (!event.session.user) {
          return {
            redirect: `/login?next=${encodeURIComponent(event.url.pathname)}`,
            status: 303
          }
        }
        
        if (fn instanceof Function) return fn(event)
        return {
          status: 200
        }
    }
}

// Redirect if already logged in
export function withLoadNoAuth<L extends Load>(fn?: L): Load {
  return async (event) => {
      if (event.session.user) {
        return {
          redirect: event.url.searchParams.get('next') ?? '/dashboard',
          status: 303
        }
      }
      
      if (fn instanceof Function) return fn(event)
      return {
        status: 200
      }
  }
}