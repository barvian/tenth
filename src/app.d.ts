/// <reference types="@sveltejs/kit" />

// See https://kit.svelte.dev/docs/typescript
// for information about these interfaces
declare namespace App {
	interface Supabase {
		Database: import('../types/supabase').Database
		SchemaName: 'public'
	}
	interface PageData {
		meta: {
			title: string
			description?: string
		}
		session?: import('@supabase/supabase-js').Session
		profile?: {
			plaid_institution_id: string | null
			plaid_account_mask: string | null
			percentage: number
			first_name: string | null
			last_name: string | null
			stripe_linked: boolean
		}
	}
	// interface Error {}
	// interface Platform {}
}

declare namespace svelte.JSX {
	interface HTMLAttributes<T> {
		onoutclick: () => void
	}
}
