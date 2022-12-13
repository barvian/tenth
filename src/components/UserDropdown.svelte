<script lang="ts">
	import { afterNavigate } from "$app/navigation";
	import { page } from '$app/stores';
	import md5 from 'crypto-js/md5';
	import { clickOutside } from "~/lib/actions";
	import Button from "./Button.svelte";
	import Caret from "./icons/Caret.svelte";

    let open = false

    $: active = $page.url.pathname === '/profile'
    let email: string
    $: {
        email = $page.data.session!.user.email!
        const [username, ...emailParts] = email.split('@')
        email = [username.length > 9 ? username.charAt(0)+'..'+username.slice(-1) : username, ...emailParts].join('@')
    }

    afterNavigate(() => open = false)

    function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') open = false
	}
</script>

<svelte:window on:keydown={handleWindowKeyDown} />

<details class="group relative inline-block" bind:open use:clickOutside on:outclick={() => open = false}>
    <summary class="cursor-pointer whitespace-nowrap select-none group-open:text-black {active ? '!text-black' : 'text-gray-500'}" aria-haspopup="menu">
        <img src="https://www.gravatar.com/avatar/{md5(email.toLowerCase().trim())}?d=mp" alt="Your avatar" class="rounded-full aspect-square object-fill mr-1.5 h-6 align-middle inline-block group-open:!opacity-100" class:opacity-60={!active} />
        <span class="hidden lg:inline">{email}</span>
        <Caret strokeWidth={1} class="inline-block align-middle md:ml-1 h-1.5" />
    </summary>
    <div class="rounded-2xl text-left border p-2 z-50 bg-white right-0 absolute top-full mt-4 min-w-[200px] shadow-md animate-fly-t" role="menu">
        <span class="block lg:hidden border-b border-gray-200 p-3 mb-2 text-gray-500">
            {email}
        </span>
        <a href="/profile" role="menuitem" class="block hover:bg-gray-100 p-3 leading-tight rounded-xl w-full">Edit profile</a>
        <a href="/donations" role="menuitem" class="block hover:bg-gray-100 p-3 leading-tight rounded-xl w-full">Donation history</a>
        <form class="border-t border-gray-200 pt-2 mt-2" action="/logout" method="POST">
            <Button unstyled type="submit" class="block hover:bg-gray-100 p-3 w-full leading-tight text-left rounded-xl">Log out</Button>
        </form>
    </div>
</details>