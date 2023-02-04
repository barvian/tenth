import type { TemplateProps } from 'sveltemail'
import type RecurringDonation from '../RecurringDonation.svelte'

export const normal = {
	institution: 'Ally Bank',
	last4: '2050'
} satisfies TemplateProps<RecurringDonation>
