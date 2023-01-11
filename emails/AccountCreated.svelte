<script lang="ts">
	import Bank from './components/Bank.svelte'
	import Layout from './components/Layout.svelte'

	export let institution: string
	export let last4: string

	export const subject = `You added a bank account`
</script>

<Layout {subject}>
	<svelte:fragment slot="lead">
		<Bank {institution} {last4} />
	</svelte:fragment>
</Layout>
