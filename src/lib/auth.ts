import { redirect, type Load } from '@sveltejs/kit';
import { page } from '$app/stores'

// Wait for login to be synced with server (i.e. before redirect)
export const waitForSessionUser = () => new Promise((resolve, reject) => {
  const unsubscribe = page.subscribe(p => {
    if (p.data?.session?.user?.id) {
      unsubscribe()
      resolve(p.data.session.user)
    }
  })
})

// Redirect if not logged in
export function withLoadAuth<L extends Load>(fn?: L): Load {
    return async (event) => {
        const data = await event.parent()
        
        if (!data.user) {
          throw redirect(303, `/login?next=${encodeURIComponent(event.url.pathname)}`)
        }
        
        if (fn instanceof Function) return fn(event)
    }
}

// Redirect if already logged in
export function withLoadNoAuth<L extends Load>(fn?: L): Load {
  return async (event) => {
      const data = await event.parent()

      if (data.user) {
        throw redirect(303, event.url.searchParams.get('next') ?? '/dashboard')
      }
      
      if (fn instanceof Function) return fn(event)
  }
}