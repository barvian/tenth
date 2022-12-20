import { invalid as svelteInvalid } from '@sveltejs/kit'

// Page actions

export const getValues = (
	data: FormData,
	{ omit = ['$$id'] }: { omit?: string[] } = {}
) => {
	const values: Record<string, string> = {}
	data.forEach((value, key) => {
		if (!omit.includes(key)) values[key] = value as string
	})
	return values
}

// These standardize output from actions, including the custom $$id field to keep
// track of which form they refer to

export const invalid = (
	status: number,
	data: FormData,
	fields: Record<string, string>
) => {
	return svelteInvalid(status, {
		id: data.get('$$id') as string,
		invalid: fields,
		values: getValues(data)
	})
}

export const success = (data: FormData) => ({
	id: data.get('$$id') as string,
	values: getValues(data)
})

// Component actions

export function clickOutside(node: HTMLElement) {
	const handleClick = (event: Event) => {
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
