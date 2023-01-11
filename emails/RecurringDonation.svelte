<script lang="ts">
	import Bank from './components/Bank.svelte'
	import Layout from './components/Layout.svelte'
	import { colors, fontSize, fontWeight, lineHeight } from './theme'

	export let institution: string
	export let last4: string

	export const subject = `Receipt for your monthly donation`
</script>

<Layout
	{subject}
	styles={`
        table {
            border-collapse: collapse;
        }

        .donation td:nth-child(2), .fee td:first-child {
            width: 100%;
        }

        .donation td:last-child, .donation td:nth-last-child(2), .fee td:last-child, .subtotal td:last-child {
            padding-left: 16px;
            white-space: nowrap;
            text-align: right;
        }
        
        .donation {
            border-bottom: 1px solid ${colors.black};
        }

        .donation img {
            display: block;
            margin-right: 16px;
            width: 48px;
        }

        .donation td {
            vertical-align: middle;
        }

        .donation td:nth-child(2), .donation td:last-child, .subtotal td {
            color: ${colors.black};
            font-weight: ${fontWeight.bold};
        }

        .donation td {
            padding-bottom: 20px;
            padding-top: 20px;
        }

        .subtotal td, .fee td {
            padding-top: 24px;
        }
    `}
>
	<svelte:fragment slot="top">
		<mj-text
			align="right"
			line-height={lineHeight.tight}
			font-size={fontSize.xxs}>Billing period</mj-text
		>
		<mj-text
			align="right"
			line-height={lineHeight.tight}
			font-size={fontSize.xs}
			color={colors.black}
			font-weight={fontWeight.bold}>June 2023</mj-text
		>
	</svelte:fragment>
	<svelte:fragment slot="heading"
		>We're processing your donation</svelte:fragment
	>
	<svelte:fragment slot="lead">
		<Bank {institution} {last4} />
	</svelte:fragment>
	<mj-section>
		<mj-group>
			<mj-column>
				<mj-text
					font-size={fontSize.xxl}
					color={colors.black}
					font-weight={fontWeight.bold}
				>
					Total
				</mj-text>
			</mj-column>
			<mj-column>
				<mj-text
					align="right"
					font-size={fontSize.xxl}
					color={colors.black}
					font-weight={fontWeight.bold}
				>
					$15.00
				</mj-text>
			</mj-column>
		</mj-group>
	</mj-section>
	<mj-spacer height="24px" />
	<mj-section css-class="shadow" border-radius="18px" padding="25px">
		<mj-column>
			<mj-text>
				<strong>Questions about your bill?</strong> Lorem ipsum dolor sit amet,
				consectetur adipiscing elit, sed do eiusmod{' '}
				<a href="#">tempor incididunt</a>.
			</mj-text>
		</mj-column>
	</mj-section>
	<mj-spacer height="16px" />
	<mj-section>
		<mj-column>
			<mj-table>
				<tr class="donation">
					<td
						><img
							src="https://pledgeling-res.cloudinary.com/image/upload/c_fit,h_266,w_266/v1/prod-media/images/npos/logos/2015/04/07/logo_foundation_big.JPG"
						/></td
					>
					<td>Ruth Institute</td>
					<td>40%</td>
					<td>$2.00</td>
				</tr>
				<tr class="donation">
					<td
						><img
							src="https://pledgeling-res.cloudinary.com/image/upload/c_fit,h_266,w_266/v1/prod-media/images/npos/logos/default/logo.jpg"
						/></td
					>
					<td>Watsi</td>
					<td>60%</td>
					<td>$3.00</td>
				</tr>
				<tr class="subtotal">
					<td colspan="3">Subtotal</td>
					<td>$5.00</td>
				</tr>
			</mj-table>
			<mj-table>
				<tr class="fee">
					<td>ACH fees*</td>
					<td>$0.80</td>
				</tr>
				<tr class="fee">
					<td>Tenth fees**</td>
					<td>$1.00</td>
				</tr>
			</mj-table>
			<mj-spacer height="48px" />
			<mj-text font-size={fontSize.sm}>
				No gifts or services were received in exchange for these contributions.
				Donations on Tenth are processed by our donation partner <a
					href="https://pledge.to">Pledge</a
				> via Pledgeling Foundation, an IRS approved 501(c)3 entity (EIN: 46-2440594),
				and granted to the selected nonprofits.
			</mj-text>
		</mj-column>
	</mj-section>
</Layout>
