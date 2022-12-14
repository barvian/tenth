export function clickOutside(node: HTMLElement) {
	const handleClick = (event: Event) => {
		if (!node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('outclick'))
		}
	};

	document.addEventListener("click", handleClick, true)

	return {
		destroy() {
			document.removeEventListener("click", handleClick, true)
		}
	};
}

let resizeObserver: ResizeObserver
export default function resize(node: HTMLElement) {
	if (!resizeObserver) resizeObserver = new ResizeObserver(entries => {
		entries.forEach(entry => {
			entry.target.dispatchEvent(new CustomEvent('resize', { detail: entry }))
		})
	})
  
	resizeObserver.observe(node)
  
	return {
	  destroy() {
		resizeObserver.unobserve(node)
	  }
	}
  }