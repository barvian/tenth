import type { TemplateProps } from 'sveltemail'
import type AccountStatusChanged from '../AccountStatusChanged.svelte'

export const deactivated: TemplateProps<AccountStatusChanged> = {
	event: 'deactivated',
	institution: 'Ally Bank',
	last4: '2036'
}

export const reactivated: TemplateProps<AccountStatusChanged> = {
	event: 'reactivated',
	institution: 'Chase',
	last4: '1234'
}

export const disconnected: TemplateProps<AccountStatusChanged> = {
	event: 'disconnected',
	institution: 'Wells Fargo',
	last4: '2050'
}
