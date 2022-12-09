<script lang="ts">
	import { enhance } from "$app/forms";
    import { page } from '$app/stores';
	import Caret from "./icons/Caret.svelte";
    import md5 from 'crypto-js/md5'
	import { clickOutside } from "~/lib/actions";

    let open = false

    $: active = $page.url.pathname === '/profile'
    $: email = $page.data.session!.user.email!
    $: [username, domain] = email.split('@')

    function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false
	}
</script>

<svelte:window on:keydown={handleWindowKeyDown} />

<details class="group relative inline-block" bind:open use:clickOutside on:outclick={() => open = false}>
    <summary class="cursor-pointer whitespace-nowrap select-none group-open:text-black {active ? '!text-black' : 'text-gray-500'}" aria-haspopup="menu">
        <img src="https://www.gravatar.com/avatar/{md5(email.toLowerCase().trim())}?d=mp" alt="Your avatar" class="rounded-full aspect-square object-fill mr-1.5 h-6 align-middle inline-block group-open:!opacity-100" class:opacity-60={!active} />
        <span class="hidden lg:inline">{username.length > 9 ? username.charAt(0) + '..' + username.slice(-1) : username}@{domain}</span>
        <Caret strokeWidth={1} class="inline-block align-middle md:ml-1 h-1.5" />
    </summary>
    <div class="rounded-2xl text-left border p-2 z-50 bg-white right-0 absolute top-full mt-2 min-w-[240px] shadow animate-fly-t" role="menu">
        <a href="/profile" role="menuitem" class="block hover:bg-gray-100 p-3 rounded-xl w-full">Edit profile</a>
        <form action="/logout" method="POST" use:enhance>
            <button type="submit" class="block hover:bg-gray-100 p-3 w-full text-left rounded-xl">Log out</button>
        </form>
    </div>
</details>