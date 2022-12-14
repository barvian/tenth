<script lang="ts">
	import { page } from '$app/stores';
	import Charity from '~/components/Charity/Charity.svelte';
	import CharitySearch from '~/components/Charity/CharitySearch.svelte';
	import X from '~/components/icons/X.svelte';
	import Percentage from "~/components/inputs/Percentage.svelte";
    import type { Nonprofit } from 'types/change';
	import Button from '~/components/Button.svelte';
    import supabaseClient from '~/lib/db';
	import { toast } from '@zerodevx/svelte-toast';
	import { afterUpdate } from '~/lib/component';
	import { sleep } from '~/lib/promises';
	import { clickOutside } from '~/lib/actions';
	import { applyAction, enhance, type SubmitFunction } from '$app/forms';
	import { update } from 'lodash';

    let designated: Nonprofit[] = $page.data.designated ?? []
    afterUpdate(() => { if ($page.data.designated) designated = $page.data.designated }, () => [$page.data.designated])
    let percentage: number = $page.data.profile?.percentage
    afterUpdate(() => { if ($page.data.profile?.percentage) percentage = $page.data.profile?.percentage }, () => [$page.data.profile?.percentage])

    let adding: Record<string, boolean> = {}, deleting: Record<string, boolean> = {}
    async function addCharity(event: CustomEvent) {
        const charity = event.detail as Nonprofit
        if (designated.find(c => c.id === charity.id)) return
        designated = [...designated, charity]
        adding[charity.id] = true
        const { error } = await supabaseClient.from('designated').insert({
            change_id: charity.id
        })
        if (error) {
            designated = designated.filter(d => d.id !== charity.id)
            toast.push(`Couldn't add charity. Please try again later.`, { classes: ['error'] })
        } else {
            adding[charity.id] = false
        }
    }
    async function removeCharity(charity: Nonprofit) {
        deleting[charity.id] = true
        const { error } = await supabaseClient.from('designated').delete().eq('change_id', charity.id)
        if (error) {
            toast.push(`Couldn't remove charity. Please try again later.`, { classes: ['error'] })
        } else {
            designated = designated.filter(d => d.id !== charity.id)
        }
        deleting[charity.id] = false
    }

    let updatingPercentage = false
    async function onPercentageChange(event: Event) {
        const newPercentage = event.currentTarget?.value
        if (newPercentage == null) return
        
        updatingPercentage = true
        const [{ error }] = await Promise.all([
            supabaseClient.from('profiles').update({
                percentage: newPercentage
            }).eq('user_id', $page.data.session!.user.id),
            sleep(500) // Give them time to see the spinner
        ])
        if (error) {
            toast.push(`Couldn't update yearly percentage. Please try again later.`, { classes: ['error'] })
            // TODO: find a better way to force an update despite a numeric value not changing
            const prevPercentage = percentage
            percentage = newPercentage
            percentage = prevPercentage
        } else {
            percentage = newPercentage
        }
        updatingPercentage = false
    }

    let unlinking = false
    const unlink: SubmitFunction = () => {
        unlinking = true
        return async ({ result, update }) => {
            if (result.type === 'error' || result.type === 'invalid') {
                toast.push(`Couldn't unlink your account. Please try again later.`, { classes: ['error'] })
            }  
            await update()
            unlinking = false
        }
    }

    let bankOpen = false
</script>

<div role="heading" aria-level={1} class="text-4xl max-w-2xl leading-snug text-center font-bold">
    {#if designated.length > 0}
        We're donating
    {:else}
        We'll donate
    {/if}
    <Percentage value={percentage} loading={updatingPercentage} on:change={onPercentageChange} />
    of your
    <details class="group relative inline-block align-middle" bind:open={bankOpen} use:clickOutside on:outclick={() => bankOpen = false}>
        <summary class="whitespace-nowrap border-current leading-extra-tight border-b-4 border-dotted text-bank" aria-haspopup="menu">
            {#if $page.data.institution?.logo}
                <img class="h-9 inline-block -mt-1" alt="{$page.data.institution?.name} logo" src="data:image/png;base64,{$page.data.institution?.logo}" />
            {:else}
                {$page.data.institution?.name}
            {/if}
            <span class="tracking-tighter leading-none text-3xl inline-block -translate-y-1/4 mr-0.5">⚫︎⚫︎</span>{$page.data.profile?.plaid_account_mask}
            <svg class="inline-block align-middle h-[0.7em]" viewBox="0 13 18 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 25L9 31L15 25" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/>
            </svg>
        </summary>
        <div class="rounded-2xl text-left font-normal border text-base p-2 z-50 bg-white right-0 absolute top-full mt-2 min-w-[160px] shadow-md animate-fly-b" role="menu">
            <a href="/link" role="menuitem" class="block hover:bg-gray-100 p-3 leading-tight rounded-xl w-full">Replace</a>
            <form action="/link?/unlink" method="POST" use:enhance={unlink}>
                <Button loading={unlinking} type="submit" unstyled class="p-3 leading-tight text-left not-disabled:hover:bg-gray-100 text-red-500 rounded-xl block w-full">Unlink</Button>
            </form>
        </div>
    </details> account every year.
</div>
<p class="text-xl max-w-xl text-center text-gray-500 mt-5 mb-8">
    {#if designated.length > 0}
        We're donating
    {:else}
        We'll donate
    {/if}
    {(percentage / 12 * 100).toFixed(3)}%
    of your account on the 20th of each month
    {#if designated.length > 0}
        to your selected charities{#if designated.length > 1}, divided evenly{/if}:
    {:else}
        once you select some charities:
    {/if}
</p>
{#if designated.length > 0}
    <div class="space-y-4 w-full max-w-md mb-5">
        {#each designated as item (item.id)}
            <Charity charity={item}>
                <Button slot="tools" unstyled on:click={() => removeCharity(item)} loading={deleting[item.id] || adding[item.id]} class="py-2 pl-2 text-gray-300 hover:text-red-500 {adding[item.id] ? 'disabled:text-gray-300' : 'disabled:text-red-500'} transition-color">
                    <X class="h-3.5" />
                </Button>
            </Charity>
        {/each}
    </div>
{/if}
<CharitySearch class="max-w-md w-full" label={designated.length > 0 ? 'Support another charity' : 'Which charity do you want to support?'} on:charity={addCharity}  />