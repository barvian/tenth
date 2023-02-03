import rollupYaml from '@rollup/plugin-yaml'
import { sveltekit } from '@sveltejs/kit/vite'
import ska from 'ska'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [ska(), sveltekit(), rollupYaml()]
}
