<script lang="ts">
	import { afterNavigate } from '$app/navigation'
	import { page } from '$app/stores'
	import md5 from 'crypto-js/md5'
	import { clickOutside, escape } from '~/lib/actions'
	import Button from './forms/Button.svelte'
	import Caret from './icons/Caret.svelte'

	let cls = ''
	export { cls as class }
	let open = false

	$: active = $page.url.pathname === '/profile'
	let email: string
	$: {
		email = $page.data.session!.user.email!
		const [username, ...emailParts] = email.split('@')
		email = [
			username.length > 9
				? username.charAt(0) + '..' + username.slice(-1)
				: username,
			...emailParts
		].join('@')
	}

	afterNavigate(() => (open = false))
</script>

<details
	class="group relative inline-block {cls}"
	bind:open
	use:clickOutside
	use:escape
	on:outclick={() => (open = false)}
	on:escape={() => (open = false)}
>
	<summary
		class="whitespace-nowrap group-open:text-black {active
			? '!text-black'
			: 'text-gray-500'}"
		aria-haspopup="menu"
	>
		<img
			src="https://www.gravatar.com/avatar/{md5(
				email.toLowerCase().trim()
			)}?d=mp"
			alt="Your avatar"
			class="rounded-full aspect-square object-fill h-6 align-middle inline-block group-open:!opacity-100"
			class:opacity-60={!active}
		/>
		<span class="hidden lg:inline-block lg:ml-1.5">{email}</span>
		<Caret strokeWidth={1} class="inline-block align-middle md:ml-1 h-1.5" />
	</summary>
	<div
		class="rounded-2xl text-left border p-2 z-50 bg-white right-0 absolute top-full mt-4 min-w-[200px] shadow-md animate-fly-b"
		role="menu"
	>
		<span
			class="block lg:hidden border-b border-gray-200 p-3 pt-2.5 mb-2 text-gray-500"
		>
			{email}
		</span>
		<a
			href="/profile"
			role="menuitem"
			class="block hover:bg-gray-100 p-3 leading-tight rounded-xl w-full"
			>Edit profile</a
		>
		<!-- <a href="/donations" role="menuitem" class="block hover:bg-gray-100 p-3 leading-tight rounded-xl w-full">Donation history</a> -->
		<form
			class="border-t border-gray-200 pt-2 mt-2"
			action="/api/auth?/logout"
			method="POST"
		>
			<Button
				unstyled
				class="block hover:bg-gray-100 p-3 w-full leading-tight text-left rounded-xl"
				>Log out</Button
			>
		</form>
	</div>
</details>
