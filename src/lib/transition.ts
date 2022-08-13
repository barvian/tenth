import { cubicOut } from 'svelte/easing'
import type { EasingFunction, TransitionConfig } from "svelte/types/runtime/transition";
import { inView, animate } from 'motion'

export function inview(node: SVGElement | HTMLElement) {
	const stop = inView(node, () => {
		node.addEventListener('animationend', (e) => {
			node.classList.add('did-animate')
		}, { once: true })
		node.classList.add('in-view')
	})

	return {
		destroy() {
			stop()
		}
	}
}

export type StepDirection = 'forward' | 'backward'

export interface StepParams {
	delay?: number;
	duration?: number;
	easing?: EasingFunction;
    direction: StepDirection
}

const step = (node: Element, {
	delay = 0,
	duration = 400,
	easing = cubicOut,
	direction = 'forward'
}: StepParams, intro = true): TransitionConfig => {
	const style = getComputedStyle(node);
	const target_opacity = +style.opacity;
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		delay,
		duration,
		easing,
		css: (t, u) => `
			transform: ${transform} translateX(${u * (direction === 'forward' ? (intro ? 20 : -20) : (intro ? -20 : 20))}vw);
			opacity: ${target_opacity - (target_opacity * u)}`
	};
}

export const stepIn = (node: Element, params: StepParams) => step(node, params, true)
export const stepOut = (node: Element, params: StepParams) => step(node, params, false)