import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [sveltekit(), rollupYaml()]
}
