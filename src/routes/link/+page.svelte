<script lang="ts">
	import { invalidateAll } from "$app/navigation";
	import { toast } from "@zerodevx/svelte-toast";
	import { onDestroy } from "svelte";
	import Button from "~/components/Button.svelte";
	import Change from "~/components/icons/Change.svelte";
	import Spinner from "~/components/icons/Spinner.svelte";
	import X from "~/components/icons/X.svelte";
	import MultiStep from "~/components/MultiStep/MultiStep.svelte";
	import Step from "~/components/MultiStep/Step.svelte";
	import { loadScript } from "~/lib/component";
	import supabaseClient from '~/lib/db';
	import type { PageData } from "./$types";

    export let data: PageData
    
    let multiStep: MultiStep
    
    let plaidLoading = loadScript('https://cdn.plaid.com/link/v2/stable/link-initialize.js')
    let plaidHandler: ReturnType<typeof window.Plaid.create>
    const openPlaid = (token: string) => new Promise<[string, Plaid.OnSuccessMetadata]>((resolve, reject) => {
        plaidHandler?.destroy()
        plaidHandler = window.Plaid.create({
            token,
            onSuccess(public_token, metadata) {
                resolve([public_token, metadata])
            },
            onExit(error) {
                reject(error)
            },
            // I really wish Plaid let you filter institutions
            onEvent(eventName, metadata) {
                if (eventName === 'SELECT_INSTITUTION' && data.profile?.institution_id && metadata.institution_id !== data.profile.institution_id) {
                    plaidHandler.exit({ force: true })
                    toast.push(`Please select your ${data.institution.name} account`, { classes: ['error'] })
                // @ts-ignore TODO: remove if Plaid Link types get updated
                } else if (eventName === 'SUBMIT_ACCOUNT_NUMBER' && data.profile?.plaid_account_mask && metadata.account_number_mask !== data.profile.plaid_account_mask) {
                    plaidHandler.exit({ force: true })
                    toast.push(`Please select your account ending in ${data.profile.plaid_account_mask}`, { classes: ['error'] })
                }
            }
        })
        plaidHandler.open()
    })

    let linking = false
    async function linkChange() {
        linking = true
        try {
            const link_token = await fetch('/api/change/link-token', { method: 'POST' }).then(r => r.ok ? r.json() : Promise.reject(r))
            const [plaid_public_token, metadata] = await openPlaid(link_token)

            await fetch('/api/change/attach', {
                method: 'POST',
                body: JSON.stringify({
                    link_token,
                    plaid_public_token,
                    bank_account_id: metadata.accounts[0].id,
                    plaid_institution_id: metadata.institution.institution_id,
                    plaid_account_mask: metadata.accounts[0].mask,
                    plaid_account_type: metadata.accounts[0].type,
                    plaid_account_subtype: metadata.accounts[0].subtype
                })
            }).then(r => r.ok ? r.json() : Promise.reject(r))
            await invalidateAll()
            multiStep.next()
        } catch (e) {
            if (e) toast.push(e.display_message ?? 'Could not link bank account', { classes: ['error'] })
        }
        linking = false
    }

    async function linkStripe() {
        linking = true
        try {
            const link_token = await fetch('/api/plaid/link-token', { method: 'POST' }).then(r => r.ok ? r.json() : Promise.reject(r))
            const [plaid_public_token, metadata] = await openPlaid(link_token)

            await fetch('/api/stripe/add-bank-account', {
                method: 'POST',
                body: JSON.stringify({
                    plaid_public_token,
                    bank_account_id: metadata.accounts[0].id
                })
            }).then(r => r.ok ? r.json() : Promise.reject(r))
            multiStep.complete()
            await invalidateAll()
        } catch (e) {
            if (e) toast.push(e.display_message ?? 'Could not link bank account', { classes: ['error'] })
        }
        linking = false
    }

    let unlinking = false
    async function unlink() {
        if (!confirm('Are you sure you want to unlink this account?')) return

        unlinking = true
        const { error } = await supabaseClient.from('profiles').update({
            plaid_institution_id: null,
            plaid_account_mask: null,
            plaid_account_type: null,
            plaid_account_subtype: null
        }).eq('user_id', data.session?.user.id)
        if (error) {
            toast.push(`Couldn't unlink bank account. Please try again later.`, { classes: ['error'] })
        } else {
            multiStep.reset()
            await invalidateAll()
        }
        unlinking = false
    }

    onDestroy(() => {
        plaidHandler?.destroy()
    })
</script>

<MultiStep bind:this={multiStep} let:next inconspicuous={false}>
    <Step>
        <h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
            Link your checking account with <Change class="inline-block align-baseline h-5" />
        </h2>
        <p class="text-lg max-w-xl leading-snug mb-10 text-gray-500 text-center">
            Giving our donation partner <a href="https://getchange.io">Change</a> access to your account lets them withdraw your donations directly, saving you <mark>~1% in processing fees</mark>.
        </p>
        {#if data.profile?.plaid_institution_id && !data.stripe_linked}
            <div class="w-full max-w-xs bg-white rounded-2xl flex gap-x-3 items-center border px-4 pt-2 pb-2.5 mb-8 shadow">
                <div class="flex-1 pt-0.5">
                    <h3 class="text-gray-450 text-[0.62rem] mb-1">Linked account</h3>
                    {#if data.institution?.logo}
                        <img class="w-5 float-left mr-1.5" alt="{data.institution?.name} logo" src="data:image/png;base64,{data.institution?.logo}" />
                    {/if}
                    <div class="overflow-hidden font-medium">
                        <span style:color={data.institution?.primary_color}>{data.institution?.name}</span>
                        <span class="inline-block">
                            <span class="tracking-tighter text-xs inline-block -translate-y-0.5 mr-0.5">⚫︎⚫︎</span>{data.profile?.plaid_account_mask}
                        </span>
                    </div>
                </div>
                {#if unlinking}
                    <Spinner class="text-red-500 h-5" />
                {:else}
                    <button type="button" on:click={unlink} class="py-2 pl-2 transition-colors text-gray-300 hover:text-red-500">
                        <X class="h-3.5" />
                    </button>
                {/if}
            </div>
            <Button class="max-w-xs" on:click={next}>
                Continue
            </Button>
        {:else}
            <Button class="max-w-xs" loading={!$plaidLoading || linking} on:click={linkChange}>
                Link with Change
            </Button>
        {/if}
    </Step>
    <Step>
        <h2 class="text-3xl max-w-2xl font-bold mb-8 text-center">
            Link your {data.institution?.name ?? 'checking'} account with Tenth
        </h2>
        <p class="text-lg max-w-xl leading-snug mb-10 text-gray-500 text-center">
            Tenth also needs access to your account to check your balance and tell Change how much to donate each month.
        </p>
        <Button class="max-w-xs" loading={!$plaidLoading || linking} on:click={linkStripe}>
            Link with Tenth
        </Button>
    </Step>
</MultiStep>
