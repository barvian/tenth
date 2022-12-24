<script lang="ts">
	import { browser } from '$app/environment'
	import { getFormByIdOrContext } from './Form.svelte'

	export let name: string
	export let value: any
	export let checked = false
	let cls = ''
	export { cls as class }
	export let inputClass = ''
	export let disabled = false
	export let bg =
		'bg-white sibling-not-disabled:sibling-checked:bg-orange-500/10'
	export let border =
		'border border-gray-200 sibling-not-disabled:sibling-checked:border-orange-500'
	export let color = 'sibling-checked:text-orange-500'
	export let rounded = 'rounded-2xl'

	let formId: string | undefined = undefined
	export { formId as form }
	$: form = getFormByIdOrContext(formId)
	$: formValues = form?.values

	const handleFormValuesUpdate = () => {
		// In SSR, check when the values come back from form submission
		if (!browser && $formValues && name && $formValues[name] != null)
			checked = true
	}
	$: $formValues, handleFormValuesUpdate()
</script>

<input
	type="radio"
	{name}
	{value}
	{checked}
	{disabled}
	id="radio-{name}-{value}"
	class="{inputClass} invisible absolute pointer-events-none sibling"
	on:change
/>
<label
	for="radio-{name}-{value}"
	class="{cls} {bg} {border} sibling-disabled:border-gray-200 {color} sibling-disabled:text-gray-450 {rounded} flex-1 px-2 py-3 cursor-pointer font-medium text-center"
>
	<slot />
</label>
