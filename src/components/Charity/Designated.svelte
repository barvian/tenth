<script lang="ts">
	import { createEventDispatcher } from 'svelte'
	import { clickOutside } from '~/lib/actions'
	import type { Designation } from '~/lib/db'
	import Button from '../forms/Button.svelte'
	import Form from '../forms/Form.svelte'
	import Input from '../forms/Input.svelte'
	import X from '../icons/X.svelte'
	import Charity from './Charity.svelte'

	const dispatch = createEventDispatcher()

	export let designated: Designation[] = []
	export let form: string | undefined = undefined
	export let removeAction = 'javascript:void(0);'

	let editing = false

	$: totalWeight = designated.reduce(
		(acc: number, cur: { weight: number }) => acc + cur.weight,
		0
	)

	let percentages: string[], initialPercentages: string[]
	const handleDesignatedUpdate = () => {
		editing = false
		percentages = designated.map(
			(d) => parseFloat(((d.weight / totalWeight) * 100).toFixed(1)) + ''
		)
		initialPercentages = [...percentages] // make a copy
	}
	$: designated, handleDesignatedUpdate()

	$: dirty = percentages.some((p, i) => p != initialPercentages[i])
	$: totalPercentages = percentages.reduce(
		(total, p) => total + parseFloat(p),
		0
	)

	function stopEditing() {
		editing = false
		percentages = [...initialPercentages]
		if (document.activeElement?.classList.contains('designation-percentage')) {
			;(document.activeElement as HTMLInputElement).blur()
		}
	}

	$: valid = totalPercentages === 100 && !percentages.some((p) => !+p)

	$: if (valid && dirty) dispatch('valid', percentages)
</script>

<div
	class="contents [&:focus-within_.charity]:border-gray-200 [&:focus-within_.charity]:shadow-transparent [&:focus-within_.designation-percentage_input]:shadow [&:focus-within_.designation-percentage_input]:border-black"
	use:clickOutside
	on:outclick={stopEditing}
>
	{#each designated as item, i (item.organization.id)}
		<Charity
			charity={item.organization}
			class={[
				'charity transition-all',
				editing && '!border-gray-200 !shadow-transparent'
			]}
		>
			{#if designated.length > 1}
				<Input
					name={item.organization.id}
					type="number"
					step="0.1"
					bind:value={percentages[i]}
					on:focus={() => (editing = true)}
					class="designation-percentage"
					{form}
					shadow={[
						editing && '!shadow',
						'shadow-shadow focus:shadow-orange-500/10'
					]}
					border={[
						editing && '!border-black',
						'border-transparent hover:border-gray-300 focus:!border-orange-500'
					]}
					padding="pl-0 pr-5 pb-2 pt-2.5"
					rounded="rounded-lg"
					align="text-right"
					width="w-17"
					min="0"
					max="100"
				>
					<span
						class="absolute top-1/2 right-2 -translate-y-1/2 font-medium text-gray-450"
						>%</span
					>
				</Input>
			{/if}
			<Form id="remove-designation" action={removeAction}>
				<Button
					unstyled
					name="id"
					value={item.organization.id}
					on:click={(event) => {
						if (!dispatch('remove', item, { cancelable: true }))
							event.preventDefault()
					}}
					class="py-2 pl-2 text-gray-300 hover:text-red-500 transition-colors"
				>
					<X class="h-5" />
				</Button>
			</Form>
		</Charity>
	{/each}
	<slot name="editor" {valid} {dirty} {editing} />
</div>
<slot {valid} {dirty} {editing} />
