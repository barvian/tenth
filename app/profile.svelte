<script context="module" lang="ts">
	import { getSupabase } from '@supabase/auth-helpers-sveltekit'
	import { withLoadAuth } from '~/lib/auth'
	import type { PageLoad, Action, Actions } from './profile/$types'
	import { error, redirect } from '@sveltejs/kit'
	import { invalid, success } from '~/lib/actions'
	import serviceRoleClient from '~/lib/db.server'
	import stripeClient from '~/lib/stripe.server'

	export const getData = withLoadAuth(async (event) => {
		const { supabaseClient } = await getSupabase(event)
		const { data, error } = await supabaseClient
			.from('users')
			.select('first_name, last_name')
			.single()
		if (error) throw error

		return {
			first_name: data.first_name,
			last_name: data.last_name,
			meta: {
				title: 'Your profile',
				description: `Manage your profile on Tenth`
			}
		}
	}) satisfies PageLoad

	const update = (async (event) => {
		const { request } = event
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		const data = await request.formData()
		const email = data.get('email') as string

		const { error: updateError } = await supabaseClient
			.from('users')
			.update({
				first_name: data.get('first') as string,
				last_name: data.get('last') as string
			})
			.eq('id', session.user.id)
		if (updateError) throw updateError

		if (session.user.email && session.user.email !== email) {
			const { error: updateError } = await supabaseClient.auth.updateUser({
				email
			})
			// TODO: more precise error handling here
			if (updateError)
				return invalid(422, data, {
					email: `Couldn't update email. Please try again later.`
				})
			else return success(data, { email_changed: true })
		}

		return success(data)
	}) satisfies Action

	const del = (async (event) => {
		const { session, supabaseClient } = await getSupabase(event)
		if (!session) throw error(403, 'No user logged in')

		const { data: profile, error: profileError } = await supabaseClient
			.from('users')
			.select('stripe_cus_id')
			.single()
		if (profileError) throw profileError

		await stripeClient.customers.del(profile.stripe_cus_id)

		await supabaseClient.auth.signOut() // don't handle errors I guess

		const { error: deleteError } =
			await serviceRoleClient.auth.admin.deleteUser(session.user.id)
		if (deleteError) throw deleteError

		throw redirect(303, '/')
	}) satisfies Action

	export const serverActions = {
		update,
		delete: del
	} satisfies Actions
</script>

<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import type { PageData } from './profile/$types'

	export let data: PageData

	let email = data.session?.user.email
</script>

<h1 class="text-4xl text-center mb-8 max-w-2xl">Your profile</h1>
<Form
	id="update"
	action="?/update"
	class="grid grid-cols-2 gap-6 max-w-md w-full"
	let:data={response}
>
	<Input name="first" label="First name" required value={data.first_name} />
	<Input name="last" label="Last name" required value={data.last_name} />
	{#if response?.email_changed}
		<p
			class="bg-gray-100 rounded-2xl p-6 text-center col-span-full"
			role="alert"
		>
			Click the link we sent to your new and old email addresses to confirm your
			change.
		</p>
	{:else}
		<Input
			type="email"
			label="Email"
			name="email"
			class="col-span-full"
			bind:value={email}
			showDescription={email !== data.session?.user.email}
			description="We'll send you a confirmation to complete your email change."
		/>
	{/if}
	<Button class="mt-2 col-span-full">Save profile</Button>
</Form>
<Form
	id="delete"
	action="?/delete"
	on:submit={(event) => {
		if (!confirm('Are you sure you want to delete your account?'))
			event.preventDefault()
	}}
>
	<Button
		unstyled
		class="text-red-400 font-medium text-lg mt-8 max-w-md w-full text-center"
	>
		Delete account
	</Button>
</Form>
