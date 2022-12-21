<script lang="ts">
	import Logo from '~/components/icons/Logo.svelte'
</script>

<header class="mb-12 max-w-2xl text-center">
	<h1 class="text-4xl font-bold">Lower fees than doing it yourself</h1>
	<p class="text-xl text-gray-500 mt-5">
		Tenth's fees are (much) lower than what you'd pay with monthly credit card
		donations.
	</p>
</header>
<div class="max-w-4xl grid md:grid-cols-2 lg:gap-10">
	<div class="rounded-2xl bg-white shadow-lg border px-8 pt-12 pb-8">
		<div class="text-center">
			<h2 class="text-gray-500"><Logo class="inline-block h-3" /></h2>
			<span class="block mt-3 text-5xl font-bold">1.5% + 50¢</span>
			<span class="block mt-2">per donation, + $1.55 one-time setup fee</span>
		</div>
		<table class="table-auto mt-6">
			<tbody>
				<tr>
					<td class="pr-4 border-b border-gray-500/25 py-4">
						<h4>Change fees</h4>
						<p class="text-gray-500 leading-snug mt-0.5">
							The fees our donation processor, <a
								class="font-medium text-orange-500"
								href="https://getchange.io">Change</a
							>, charges to process donations and pay out to charities.
						</p>
					</td>
					<td class="py-4 align-top text-right border-b border-gray-500/25"
						>1.5%</td
					>
				</tr>
				<tr>
					<td class="pr-4 border-b border-gray-500/25 py-4">
						<h4>Account balance fee</h4>
						<p class="text-gray-500 leading-snug mt-0.5">
							The fee we incur to check a bank account balance.
						</p>
					</td>
					<td class="py-4 align-top text-right border-b border-gray-500/25"
						>10¢</td
					>
				</tr>
				<tr>
					<td class="pr-4 border-b border-gray-500/25 py-4">
						<h4>Tenth fee</h4>
						<p class="text-gray-500 leading-snug mt-0.5">
							Our fee, to cover ongoing expenses and further development.
						</p>
					</td>
					<td class="py-4 align-top text-right border-b border-gray-500/25"
						>40¢</td
					>
				</tr>
				<tr>
					<td class="pr-4 py-4">
						<h4>Setup fee</h4>
						<p class="text-gray-500 leading-snug mt-0.5">
							The fee we incur to link your bank account with our platform, only
							charged one time after successfully linking an account.
						</p>
					</td>
					<td class="py-4 align-top text-right">$1.55</td>
				</tr>
			</tbody>
		</table>
	</div>
	<div class="px-8 pt-12 pb-8">
		<div class="text-center">
			<h3>Recurring Credit Card Donation Fees</h3>
			<span class="block mt-3 text-gray-500 text-5xl font-bold"
				>3.7–7.8% + 30¢</span
			>
			<span class="block mt-2">per donation</span>
		</div>
		<table class="table-auto mt-6">
			<tbody>
				<tr>
					<td class="pr-4 border-b border-gray-500/25 py-4">
						<h4>Credit card processing fee</h4>
						<p class="text-gray-500 leading-snug mt-0.5">
							The fees incurred to charge a credit card.
						</p>
					</td>
					<td
						class="py-4 align-top text-right border-b border-gray-500/25 whitespace-nowrap"
						>2.2—2.9% + 30¢</td
					>
				</tr>
				<tr>
					<td class="pr-4 py-4">
						<h4>Platform fees</h4>
						<p class="text-gray-500 leading-snug mt-0.5">
							The fees donation platforms charge to process donations.
						</p>
					</td>
					<td class="py-4 align-top text-right">1.5—4.9%</td>
				</tr>
			</tbody>
		</table>
	</div>
</div>
