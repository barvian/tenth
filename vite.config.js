import rollupYaml from '@rollup/plugin-yaml'
import ska from 'ska'

/** @type {import('vite').UserConfig} */
export default {
	plugins: [ska(), rollupYaml()]
}
