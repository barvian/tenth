import adapter from '@sveltejs/adapter-auto'
import { mdsvex } from 'mdsvex'
import preprocess from 'svelte-preprocess'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],

	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		mdsvex({
			extension: '.md'
		}),
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter(),
		alias: {
			'~': './src'
		}
	}
}

export default config
