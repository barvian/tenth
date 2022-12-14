<script lang="ts">
	import { enhance, type SubmitFunction } from "$app/forms";
	import { page } from '$app/stores';
	import { toast } from '@zerodevx/svelte-toast';
	import Button from "~/components/Button.svelte";
	import Facebook from "~/components/icons/social/Facebook.svelte";
	import Instagram from "~/components/icons/social/Instagram.svelte";
	import Twitter from "~/components/icons/social/Twitter.svelte";
	import YouTube from "~/components/icons/social/YouTube.svelte";
	import Input from "~/components/inputs/Input.svelte";
	import type { ActionData, PageData } from "./$types";

    export let data: PageData
    export let form: ActionData

    let requesting = false
    const request: SubmitFunction = ({}) => {
        requesting = true
        return async ({ update, result }) => {
            if (result.type === 'invalid') {
                toast.push(`Couldn't submit request. Please try again later.`, { classes: ['error'] })
            }
            await update()
            requesting = false
        }
    }
</script>

{#if form?.values && $page.status === 200}
    <h2 class="text-3xl max-w-xl text-center font-bold mb-5">We received your request!</h2>
    <p class="text-lg max-w-xl leading-snug mb-8 text-gray-500 text-center">
        {#if form.values.email}
            We'll send updates to <span class="text-black">{form.values.email}</span> as we get them.
        {:else}
            Feel free to check back in a few days.
        {/if}
    </p>
    <Button href="/" width="w-min">
        Go home
    </Button>
{:else}
    <header class="text-center max-w-2xl mb-8">
        <h1 class="text-4xl font-bold">Request a charity</h1>
        <p class="text-xl mt-5 text-gray-500">
            Use the form to request that a charity be added to the Change network, which Tenth uses. Please fill out as many fields as possible; missing information may cause processing delays.
        </p>
        <p class="max-w-lg mx-auto mt-12 bg-gray-100 rounded-3xl p-6">
            If you're a member of a charity and wish to accept donations from Tenth, you can <a class="font-medium text-red-400" href="https://getchange.io/nonprofits/">claim your charity on the Change network</a>.
        </p>
    </header>
    <form method="POST" class="max-w-lg w-full grid grid-cols-3 gap-6" use:enhance={request}>
        <Input class="col-span-full" autocomplete="off" type="text" name="name" value={form?.values?.name} label="Charity name" required />
        <Input class="col-span-full" autocomplete="off" type="text" name="ein" value={form?.values?.ein} label="EIN" placeholder="e.g. 41-1627391" required
            description={`Not sure where to find this? Search for your charity on <a rel="external" href="http://www.guidestar.org/" target="_blank">Guidestar</a>.`}
        />
        <Input class="col-span-full" autocomplete="off" type="text" name="address_line" value={form?.values?.address_line} label="Address line" placeholder="e.g. 1452 DoGood Lane" />
        <Input class="col-span-2" autocomplete="off" type="text" name="city" value={form?.values?.city} label="City" />
        <Input class="col-span-1 uppercase" autocomplete="off" maxlength={2} type="text" name="state" value={form?.values?.state} label="State" placeholder="e.g. IL" />
        <Input class="col-span-full" autocomplete="off" type="url" name="website" value={form?.values?.website} label="Website" placeholder="e.g. http://mycharity.org" />
        <fieldset class="col-span-full">
            <!-- <h2 class="text-xl mb-5 mt-2 font-medium">Social media handles</h2> -->
            <div class="grid grid-cols-2 gap-6">
                <Input type="text" name="facebook" value={form?.values?.facebook} autocomplete="off" spellcheck={false} placeholder="mycharity" icon={Facebook} />
                <Input type="text" name="twitter" value={form?.values?.twitter} autocomplete="off" spellcheck={false} placeholder="mycharity" icon={Twitter} />
                <Input type="text" name="instagram" value={form?.values?.instagram} autocomplete="off" spellcheck={false} placeholder="mycharity" icon={Instagram} />
                <Input type="text" name="youtube" value={form?.values?.youtube} autocomplete="off" spellcheck={false} placeholder="mycharity" icon={YouTube} />
            </div>
        </fieldset>
        {#if !data?.session}
            <Input class="col-span-full mt-2" type="email" name="email" value={form?.values?.email} label="Your email"
                description="If provided, we'll email you updates about your request."
            />
        {/if}
        <Button class="col-span-full mt-2" loading={requesting} type="submit">Request</Button>
    </form>
{/if}