import { fail } from '@sveltejs/kit'

// Page actions
// ===

type GetValuesOptions = { omit?: string[] }

// Return the values of the form as an object, excluding the internal IDs
export const getValues = (
	formData: FormData,
	{ omit = [] }: GetValuesOptions = {}
) => {
	const values: Record<string, string> = {}
	formData.forEach((value, key) => {
		if (key !== '$$id' && !omit.includes(key)) values[key] = value as string
	})
	return values
}

// These standardize output from actions, including the custom $$id field to keep
// track of which form they refer to

export const invalid = (
	status: number,
	formData: FormData,
	fields: Record<string, string>,
	opts?: GetValuesOptions
) => {
	return fail(status, {
		id: formData.get('$$id') as string,
		invalid: fields,
		values: getValues(formData, opts)
	})
}

export const success = <D>(
	formData: FormData,
	data?: D,
	opts?: GetValuesOptions
) => ({
	id: formData.get('$$id') as string,
	values: getValues(formData, opts),
	data
})

// Component actions
// ===

export function clickOutside(node: HTMLElement) {
	function handleClick(event: Event) {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'))
		}
	}

	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true)
		}
	}
}

export function escape(node: HTMLElement) {
	function handleWindowKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') node.dispatchEvent(new CustomEvent('escape'))
	}

	window.addEventListener('keydown', handleWindowKeyDown, true)

	return {
		destroy() {
			window.removeEventListener('keydown', handleWindowKeyDown, true)
		}
	}
}
