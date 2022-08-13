<script lang="ts" context="module">
	import { withLoadAuth } from '~/lib/auth';
	import type { Load } from './__types/index';

	export const load = withLoadAuth<Load>(); // could this go in the layout?
</script>