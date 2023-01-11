import { SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from '$env/static/private'
import nodemailer from 'nodemailer'
import { createSendMail } from 'sveltemail'

export const sendMail = createSendMail({
	transport: nodemailer.createTransport({
		host: SMTP_HOST,
		port: SMTP_PORT,
		auth:
			SMTP_USER && SMTP_PASS
				? {
						user: SMTP_USER,
						pass: SMTP_PASS
				  }
				: undefined
	}),
	defaultFrom: 'noreply@tenth.to'
})
