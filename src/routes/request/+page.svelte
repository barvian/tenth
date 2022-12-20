<script lang="ts">
	import Button from '~/components/forms/Button.svelte'
	import Form from '~/components/forms/Form.svelte'
	import Input from '~/components/forms/Input.svelte'
	import Facebook from '~/components/icons/social/Facebook.svelte'
	import Instagram from '~/components/icons/social/Instagram.svelte'
	import Twitter from '~/components/icons/social/Twitter.svelte'
	import YouTube from '~/components/icons/social/YouTube.svelte'
	import type { PageData } from './$types'

	export let data: PageData
</script>

<Form>
	<svelte:fragment slot="complete" let:values>
		<h2 class="text-3xl max-w-xl text-center font-bold mb-5">
			We received your request!
		</h2>
		<p class="text-lg max-w-xl leading-snug mb-8 text-gray-500 text-center">
			{#if values?.email}
				We'll send updates to <span class="text-black">{values?.email}</span> as
				we get them.
			{:else}
				Feel free to check back in a few days.
			{/if}
		</p>
		<Button href="/" width="w-min">Go home</Button>
	</svelte:fragment>

	<header class="text-center max-w-2xl mb-8">
		<h1 class="text-4xl font-bold">Request a charity</h1>
		<p class="text-xl mt-5 text-gray-500">
			Use the form to request that a charity be added to the Change network,
			which Tenth uses. Please fill out as many fields as possible; missing
			information may cause processing delays.
		</p>
		<p class="max-w-lg mx-auto mt-12 bg-gray-100 rounded-3xl p-6">
			If you're a member of a charity and wish to accept donations from Tenth,
			you can <a
				class="font-medium text-red-400"
				href="https://getchange.io/nonprofits/"
				>claim your charity on the Change network</a
			>.
		</p>
	</header>

	<fieldset class="max-w-lg grid grid-cols-6 gap-6">
		<Input
			class="col-span-full"
			autocomplete="off"
			type="text"
			name="name"
			label="Charity name"
			required
		/>
		<Input
			class="col-span-full"
			autocomplete="off"
			type="text"
			name="ein"
			label="EIN"
			placeholder="e.g. 41-1627391"
			required
			description={`Not sure where to find this? Search for your charity on <a rel="external" href="http://www.guidestar.org/" target="_blank">Guidestar</a>.`}
		/>
		<Input
			class="col-span-full"
			autocomplete="off"
			type="text"
			name="address_line"
			label="Address line"
			placeholder="e.g. 1452 DoGood Lane"
		/>
		<Input
			class="col-span-4"
			autocomplete="off"
			type="text"
			name="city"
			label="City"
		/>
		<Input
			class="col-span-2 uppercase"
			autocomplete="off"
			maxlength={2}
			type="text"
			name="state"
			label="State"
			placeholder="e.g. IL"
		/>
		<Input
			class="col-span-full"
			autocomplete="off"
			type="url"
			name="website"
			label="Website"
			placeholder="e.g. http://mycharity.org"
		/>

		<!-- <h2 class="text-xl mb-5 mt-2 font-medium">Social media handles</h2> -->
		<Input
			type="text"
			name="facebook"
			class="col-span-3"
			autocomplete="off"
			spellcheck={false}
			placeholder="mycharity"
			icon={Facebook}
		/>
		<Input
			type="text"
			name="twitter"
			class="col-span-3"
			autocomplete="off"
			spellcheck={false}
			placeholder="mycharity"
			icon={Twitter}
		/>
		<Input
			type="text"
			name="instagram"
			class="col-span-3"
			autocomplete="off"
			spellcheck={false}
			placeholder="mycharity"
			icon={Instagram}
		/>
		<Input
			type="text"
			name="youtube"
			class="col-span-3"
			autocomplete="off"
			spellcheck={false}
			placeholder="mycharity"
			icon={YouTube}
		/>

		{#if !data?.session}
			<Input
				class="col-span-full mt-2"
				type="email"
				name="email"
				label="Your email"
				description="If provided, we'll email you updates about your request."
			/>
		{/if}
		<Button type="submit" class="col-span-full mt-2">Request</Button>
	</fieldset>
</Form>
