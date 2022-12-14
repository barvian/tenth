<script lang="ts">
    import Input from "./Input.svelte";

	export let name: string
    export let amount = 0 // integer
	export let maxlength = 7 // length of amount
    
    const formatter = new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'usd'
	})

    // Wish NumberFormat just exposed these directly:
	const parts = formatter.formatToParts(0)
	const precision = Math.pow(10, parts.find(p => p.type === 'fraction')?.value?.length ?? 0)

    $: floatingAmount = amount / precision
    $: value = amount > 0 ? formatter.format(floatingAmount) : ''

    function handleKeyDown(event: KeyboardEvent) {
		const str = amount.toString(10)
		if (event.code === "Enter") return 
		if (event.code === "Backspace") {
			amount = str.length <= 1 ? 0 : parseInt(str.slice(0, -1), 10)
		} else if (/^Digit[0-9]$/.test(event.code) && str.length < maxlength) {
			amount = parseInt(str+event.key, 10)
		}
		event.preventDefault()
		return false
	}
</script>

<Input name={name+'-formatted'} autocomplete="off" spellcheck={false} {...$$restProps} on:keydown={handleKeyDown} {value}>
	<slot />
</Input>
<input type="hidden" {name} value={amount} />