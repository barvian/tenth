<script lang="ts">
	import Input from './Input.svelte'
	import Button from './Button.svelte'
	import DollarSign from '../icons/DollarSign.svelte'

	let cls = ''
	export { cls as class }
	export let amount: number | null | undefined = undefined
	export let name: string
	export let buttonLabel = 'Tip'
	export let disabled = false
</script>

<Input
	type="number"
	inputmode="numeric"
	step="0.01"
	{disabled}
	{name}
	autocomplete="off"
	spellcheck={false}
	placeholder="0"
	class={cls}
	border="border-black focus:border-rose-400"
	shadow="not-disabled:shadow focus:shadow-rose-400/10"
	description={disabled
		? `You need a <a href="/link">linked bank account</a> to leave a tip.`
		: 'Tips are not tax-deductible.'}
	descriptionAlign="text-center"
	icon={DollarSign}
	labelColor="text-gray-500 peer-focus:text-rose-500"
	value={amount ? amount / 100 + '' : null}
>
	<Button
		type={disabled ? 'button' : 'submit'}
		width="w-min"
		class="absolute inset-y-2 right-2"
		rounded="rounded-xl"
		shadow="not-disabled:hover:shadow not-disabled:hover:-translate-y-1 not-disabled:active:translate-y-0 not-disabled:active:shadow-transparent"
		padding="px-6"
		{disabled}
	>
		{buttonLabel}
	</Button>
</Input>
