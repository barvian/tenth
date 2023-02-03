// This could be running from the preview server
import env from '$env'

export default function path(p: string) {
	if (!p.startsWith('/')) return p
	if (env.VERCEL_URL) return `https://${env.VERCEL_URL}${p}`

	return `http://localhost:${env.DEV_SERVER_PORT}${p}`
}