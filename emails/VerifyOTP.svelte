<script lang="ts">
	import Layout from './components/Layout.svelte'
	import { colors, fontFamily } from './theme'

	export let otp: string

	export const subject = `Your verification code is ${otp}`
</script>

<Layout {subject}>
	<svelte:fragment slot="heading">
		Your verification code is <span
			style="color: {colors.primary}; white-space: nowrap; letter-spacing: 0.05em;"
			>{otp}</span
		>
	</svelte:fragment>
	<mj-section>
		<mj-column>
			<mj-text
				>Tenth will never ask you for this code. Don't share this code with
				anyone. This code will expire in a few minutes.</mj-text
			>
		</mj-column>
	</mj-section>
</Layout>
