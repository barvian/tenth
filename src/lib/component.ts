import { readable } from "svelte/store";
import { onMount } from "svelte";

export const mounted = readable(false, set => {
    onMount(() => {
        set(true)
        return () => { set(false) }
    })
})