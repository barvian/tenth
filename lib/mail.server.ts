import env from '$env'
import nodemailer from 'nodemailer'
import { createSendMail } from 'sveltemail'

export const sendMail = createSendMail({
	transport: nodemailer.createTransport({
		host: env.SMTP_HOST,
		port: env.SMTP_PORT,
		auth:
			env.SMTP_USER && env.SMTP_PASS
				? {
						user: env.SMTP_USER,
						pass: env.SMTP_PASS
				  }
				: undefined
	}),
	defaultFrom: 'noreply@tenth.to'
})
