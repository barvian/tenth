/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare global {
	namespace App {
		interface Supabase {
			Database: import('/types/supabase').Database
			SchemaName: 'public'
		}
		interface PageData {
			meta?: {
				title: string
				description?: string
				last_updated?: string
			}
			session?: import('@supabase/supabase-js').Session
		}
		// interface Error {}
		// interface Platform {}
	}

	namespace svelte.JSX {
		interface HTMLAttributes<T> {
			onoutclick?: () => void
			onescape?: () => void
		}
	}
}

export {}
