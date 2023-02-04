import type { TemplateProps } from 'sveltemail'
import type VerifyOTP from '../VerifyOTP.svelte'

export const normal = {
	otp: '123456'
} satisfies TemplateProps<VerifyOTP>
