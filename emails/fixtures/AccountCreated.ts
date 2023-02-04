import type { TemplateProps } from 'sveltemail'
import type AccountCreated from '../AccountCreated.svelte'

export const normal = {
	institution: 'Bank With A Super Long Name',
	last4: '2050'
} satisfies TemplateProps<AccountCreated>
