<script lang="ts">
	import { page } from '$app/stores'
	import type { ClassValue } from 'clsx'
	import md5 from 'crypto-js/md5'
	import Divider from './Dropdown/Divider.svelte'
	import Dropdown from './Dropdown/Dropdown.svelte'
	import Item from './Dropdown/Item.svelte'
	import Text from './Dropdown/Text.svelte'
	import Arrow from './icons/Arrow.svelte'
	import Caret from './icons/Caret.svelte'

	let cls: ClassValue = undefined
	export { cls as class }
</script>

{#if $page.data.session}
	{@const active = $page.url.pathname === '/profile'}
	{@const email = $page.data.session.user.email}
	{@const [username, ...emailParts] = email?.split('@') || []}
	{@const truncatedUsername =
		username.length > 9
			? username.charAt(0) + '..' + username.slice(-1)
			: username}
	<Dropdown
		class={cls}
		menuClass="mt-2 min-w-[200px]"
		summaryClass={[
			'whitespace-nowrap group-open:text-black',
			active ? '!text-black' : 'text-gray-500'
		]}
	>
		<svelte:fragment slot="summary">
			<img
				src="https://www.gravatar.com/avatar/{md5(
					email?.toLowerCase().trim() || ''
				)}?d=mp"
				alt="Your avatar"
				class="rounded-full aspect-square object-fill h-6 align-middle inline-block group-open:!opacity-100"
				class:opacity-60={!active}
			/>
			<span class="hidden lg:inline-block lg:ml-1.5"
				>{[truncatedUsername, ...emailParts].join('@')}</span
			>
			<Caret strokeWidth={1} class="inline-block align-middle md:ml-1 h-1.5" />
		</svelte:fragment>
		<Text class="lg:hidden">
			{email}
		</Text>
		<Divider class="lg:hidden" />
		<Item href="/profile">Edit profile</Item>
		<Divider />
		<form
			class="contents border-t border-gray-200 pt-2 mt-2"
			action="/api/auth?/logout"
			method="POST"
		>
			<Item>Log out</Item>
		</form>
	</Dropdown>
{:else}
	{@const active = $page.url.pathname === '/login'}
	<a
		class="font-medium whitespace-nowrap group {active
			? '!text-black'
			: 'text-gray-450'}"
		href="/login"
	>
		Sign in
		<Arrow
			strokeWidth={1}
			class="inline-block align-baseline ml-1.5 h-2.5 -scale-x-100 transition-transform group-hover:translate-x-0.5 {active
				? 'translate-x-0.5'
				: ''}"
		/>
	</a>
{/if}
