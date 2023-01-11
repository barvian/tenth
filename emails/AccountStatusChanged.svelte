<script lang="ts">
	import Bank from './components/Bank.svelte'
	import Layout from './components/Layout.svelte'

	export let event: 'deactivated' | 'reactivated' | 'disconnected'
	export let institution: string
	export let last4: string

	export const subject =
		event === 'disconnected'
			? 'Your bank account has been disconnected'
			: event === 'reactivated'
			? 'Your bank account was reactivated'
			: event === 'deactivated'
			? 'Your bank account was deactivated'
			: 'Your bank account status changed'
</script>

<Layout {subject}>
	<svelte:fragment slot="lead">
		<Bank {institution} {last4} />
	</svelte:fragment>
</Layout>
