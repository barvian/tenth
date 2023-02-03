// This could be running from the preview server, so don't use $env
import * as env from '$env/static/private'

export default function path(p: string) {
	if (!p.startsWith('/')) return p
	if (env.VERCEL_URL) return `https://${env.VERCEL_URL}${p}`

	return `http://localhost:${env.DEV_SERVER_PORT}${p}`
}
