import { redirect, type Load } from '@sveltejs/kit';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { page } from '$app/stores'

// Wait for login to be synced with server (i.e. before redirect)
export const waitForSession = () => new Promise(resolve => {
  const unsubscribe = page.subscribe(p => {
    if (p.data?.session) {
      // unsubscribe()
      resolve(true)
    }
  })
})

// Redirect if not logged in
export function withLoadAuth<L extends Load>(fn?: L): Load {
    return async (event) => {
        const { session } = await getSupabase(event)
        if (!session) {
          throw redirect(303, `/login?next=${encodeURIComponent(event.url.pathname)}`)
        }
        
        if (fn instanceof Function) return fn(event)
      }
    }
    
// Redirect if already logged in
export function withLoadNoAuth<L extends Load>(fn?: L): Load {
  return async (event) => {
    const { session } = await getSupabase(event)
    if (session) {
        throw redirect(303, event.url.searchParams.get('next') ?? '/')
      }
      
      if (fn instanceof Function) return fn(event)
  }
}