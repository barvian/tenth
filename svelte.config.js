import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/kit/vite'
import { mdsvex } from 'mdsvex'
import { defineConfig } from 'ska'

export default defineConfig({
	extensions: ['.svelte', '.md'],
	preprocess: [mdsvex({ extension: '.md' }), vitePreprocess()],
	kit: {
		adapter: adapter(),
		alias: {
			'~/*': './*'
		}
	}
})
