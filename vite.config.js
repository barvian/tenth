import { sveltekit } from '@sveltejs/kit/vite'
import rollupYaml from '@rollup/plugin-yaml'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [sveltekit(), rollupYaml()],
	server: {
		fs: {
			allow: ['..']
		}
	}
}
