import type { TemplateProps } from 'sveltemail'
import type AccountStatusChanged from '../AccountStatusChanged.svelte'

export const deactivated = {
	event: 'deactivated',
	institution: 'Ally Bank',
	last4: '2036'
} satisfies TemplateProps<AccountStatusChanged>

export const reactivated = {
	event: 'reactivated',
	institution: 'Chase',
	last4: '1234'
} satisfies TemplateProps<AccountStatusChanged>

export const disconnected = {
	event: 'disconnected',
	institution: 'Wells Fargo',
	last4: '2050'
} satisfies TemplateProps<AccountStatusChanged>
