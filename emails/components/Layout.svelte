<script lang="ts">
	import {
		colors,
		defaults,
		fontSize,
		fontWeight,
		lineHeight,
		breakpoint,
		shadows
	} from '../theme'
	import path from '../util'

	export let subject: string
	export let styles: string | undefined = undefined
</script>

<mjml>
	<mj-head>
		<mj-font name="Value Sans Pro" href={path('/fonts.css')} />
		<mj-breakpoint width={breakpoint} />
		<mj-attributes>
			<mj-all {...defaults} />
			<mj-wrapper padding-left="25px" padding-right="25px" />
		</mj-attributes>
		<mj-title>{subject}</mj-title>
		<mj-style inline="inline"
			>{`
      a {
        color: ${colors.primary} !important;
      }

        .footer a {
          color: ${colors.white} !important;
        }

        .footer .legal a {
          color: ${colors.gray} !important;
        }

      .shadow {
        border: 1px solid ${colors.black};
        box-shadow: ${shadows.base}
      }

      .heading div {
        font-size: ${fontSize.xxxl} !important;
      }

      ${styles}
    `}</mj-style
		>
		<mj-style
			>{`
      @media all and (min-width: ${breakpoint}) {
        .heading div {
          font-size: ${fontSize.xxxxl} !important;
        }
      }
    `}</mj-style
		>
		<mj-preview><slot /></mj-preview>
	</mj-head>

	<mj-body width="600px" background-color={colors.white}>
		<mj-wrapper padding-top="48px">
			<mj-section>
				<mj-group>
					<mj-column vertical-align="middle">
						<mj-image src={path('/img/logo.png')} width="84px" align="left" />
					</mj-column>
					{#if $$slots.top}
						<mj-column vertical-align="middle">
							<slot name="top" />
						</mj-column>
					{/if}
				</mj-group>
			</mj-section>
			<mj-section padding-top="50px">
				<mj-column>
					<mj-text
						color={colors.black}
						font-weight={fontWeight.bold}
						line-height={lineHeight.tight}
						css-class="heading"
					>
						<slot name="heading">{subject}</slot>
					</mj-text>
					{#if $$slots.lead}
						<mj-text
							color={colors.black}
							font-size={fontSize.xl}
							padding-top="24px"
						>
							<slot name="lead" />
						</mj-text>
					{/if}
					<mj-spacer height="48px" />
					<mj-divider border-width="1px" border-color={colors.light} />
				</mj-column>
			</mj-section>
		</mj-wrapper>
		<mj-wrapper padding-top="48px" padding-bottom="96px">
			<slot />
		</mj-wrapper>
		<mj-wrapper
			full-width="full-width"
			background-color={colors.black}
			padding-top="64px"
			padding-bottom="96px"
			css-class="footer"
		>
			<mj-section>
				<mj-column>
					<mj-text color={colors.light} font-size={fontSize.sm}>
						Please do not reply directly to this email as you will not receive a
						response. For assistance, please visit our <a
							href={path('/support')}>Help Center</a
						>.
					</mj-text>
					<mj-spacer height="36px" />
					<mj-divider border-width="1px" border-color={colors.dark} />
					<mj-spacer height="36px" />
					<mj-text font-size={fontSize.sm}> Tenth, LLC </mj-text>
					<mj-spacer height="16px" />
					<mj-text font-size={fontSize.sm} css-class="legal">
						<a href={path('/privacy')}>Privacy</a>
						&nbsp;·&nbsp;
						<a href={path('/privacy')}>Terms</a>
						&nbsp;·&nbsp;
						<a href="mailto:support@tenth.to">Contact</a>
					</mj-text>
				</mj-column>
			</mj-section>
		</mj-wrapper>
	</mj-body>
</mjml>
