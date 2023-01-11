// TODO: pull in Tailwind config as soon as it supports
// ESM modules...

export const colors = {
	black: '#000',
	white: '#FFF',
	light: '#d4d4d4',
	gray: '#737373',
	dark: '#262626',
	primary: '#f97316'
}

export const fontSize = {
	xxs: '9px',
	xs: '14px',
	sm: '16px',
	base: '20px',
	xl: '24px',
	xxl: '30px',
	xxxl: '48px',
	xxxxl: '60px'
}

export const fontWeight = {
	normal: 400,
	medium: 500,
	bold: 800
}

export const lineHeight = {
	tight: '115%',
	base: '140%',
	loose: '155%'
}

export const borderRadius = {
	base: 0,
	full: 9999
}

export const shadows = {
	base: '6px 8px 0 rgba(0,0,0,0.08)'
}

export const fontFamily = {
	sans: `'Value Sans Pro', -apple-system, BlinkMacSystemFont, sans-serif`,
	serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
	mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
}

export const breakpoint = '480px'

export const defaults = {
	'font-family': fontFamily.sans,
	'line-height': lineHeight.base,
	'font-weight': fontWeight.normal,
	'font-size': fontSize.base,
	color: colors.gray,
	padding: 0
}
