import { browser } from "$app/environment"

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
