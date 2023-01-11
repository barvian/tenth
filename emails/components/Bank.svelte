<script lang="ts">
	import path from '../util'

	export let institution: string
	export let last4: string
</script>

<img
	style="display: inline-block; vertical-align: middle; margin-top: -8px; margin-right: 8px;"
	width="28"
	src={path('/img/bank.png')}
	alt="Bank icon"
	role="presentation"
/>
{institution} &bull;&bull;{last4}
