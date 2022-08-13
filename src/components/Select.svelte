<script lang="ts">
    export let name: string
    export let value: string
</script>

<div class="relative inline-block">
    <select class="appearance-none bg-transparent border-none opacity-0 absolute inset-0" {name} bind:value>
        <slot />
    </select>
    <label class="relative flex pl-0.5 pr-1 items-baseline text-red-400 border-current leading-extra-tight border-b-4 border-dotted pointer-events-none" for={name}>
        {value}
        <svg class="h-[0.7em] ml-1" viewBox="0 0 18 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 25L9 31L15 25" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/>
            <path d="M3 8L9 2L15 8" stroke="currentColor" vector-effect="non-scaling-stroke" stroke-width="4" stroke-linecap="square" stroke-linejoin="round"/>
        </svg>            
    </label>
</div>