import type { TemplateProps } from 'sveltemail'
import type VerifyOTP from '../VerifyOTP.svelte'

export const normal: TemplateProps<VerifyOTP> = {
	otp: '123456'
}
