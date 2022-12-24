<script lang="ts">
	import clsx from 'clsx'
	import Spinner from '../icons/Spinner.svelte'

	const options = [0.33, 0.25, 0.2, 0.15, 0.1, 0.05, 0.03, 0.02, 0.01]

	export let loading = false
	export let value = 0.1
</script>

<div class="relative inline-block">
	<select
		name="percentage"
		disabled={loading}
		class={clsx(
			'peer',
			'appearance-none bg-transparent',
			'no-js:text-bank no-js:text-inherit no-js:border-current no-js:leading-none no-js:border-0 no-js:border-b-4 no-js:mb-2 no-js:border-dotted no-js:disabled:text-gray-300',
			'js:opacity-0 js:absolute js:inset-0'
		)}
		bind:value
		on:change
	>
		{#each options as p}
			<option value={p} selected={value === p}>{p * 100}%</option>
		{/each}
	</select>
	<label
		class="relative no-js:hidden whitespace-nowrap flex pl-0.5 pr-1 items-baseline text-bank border-current leading-none border-b-4 mb-2 border-dotted pointer-events-none peer-disabled:text-gray-300"
		for="percentage"
	>
		{#if loading}<Spinner class="inline-block align-middle h-7 mr-1.5" />{/if}
		{value * 100}%
		<svg
			class="h-[0.7em] ml-1"
			viewBox="0 0 18 33"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M3 25L9 31L15 25"
				stroke="currentColor"
				vector-effect="non-scaling-stroke"
				stroke-width="4"
				stroke-linecap="square"
				stroke-linejoin="round"
			/>
			<path
				d="M3 8L9 2L15 8"
				stroke="currentColor"
				vector-effect="non-scaling-stroke"
				stroke-width="4"
				stroke-linecap="square"
				stroke-linejoin="round"
			/>
		</svg>
	</label>
</div>
