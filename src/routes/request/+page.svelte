<script lang="ts">
    import Button from "~/components/Button.svelte";
    import Facebook from "~/components/icons/social/Facebook.svelte";
    import Instagram from "~/components/icons/social/Instagram.svelte";
    import Twitter from "~/components/icons/social/Twitter.svelte";
    import YouTube from "~/components/icons/social/YouTube.svelte";
    import Input from "~/components/Input.svelte";
</script>

<header class="text-center max-w-2xl mb-8">
    <h1 class="text-4xl leading-tight font-bold">Request a charity</h1>
    <p class="text-xl mt-5 text-gray-500">
        Use the form to request that a charity be added to the Change network, which Tenth uses. Please fill out as many fields as possible; missing information may cause processing delays.
    </p>
    <p class="max-w-lg mx-auto mt-12 bg-gray-100 rounded-3xl p-6">
        If you're a member of a charity and wish to accept donations from Tenth, you can <a class="font-medium text-red-400" href="https://getchange.io/nonprofits/">claim your charity on the Change network</a>.
    </p>
</header>
<form method="POST" class="max-w-lg grid grid-cols-3 gap-6">
    <Input class="col-span-full" autocomplete="off" type="text" name="name" label="Charity name" required />
    <Input class="col-span-full" autocomplete="off" type="text" name="ein" label="EIN" placeholder="e.g. 41-1627391" required>
        Not sure where to find this? Search for your charity on <a rel="external" href="http://www.guidestar.org/" target="_blank">Guidestar</a>.
    </Input>
    <Input class="col-span-full" autocomplete="off" type="text" name="address_line" label="Address line" placeholder="e.g. 1452 DoGood Lane" />
    <Input class="col-span-2" autocomplete="off" type="text" name="city" label="City" />
    <Input class="col-span-1 uppercase" autocomplete="off" maxlength={2} type="text" name="state" label="State" placeholder="e.g. IL" />
    <Input class="col-span-full" autocomplete="off" type="url" name="website" label="Website" placeholder="e.g. http://mycharity.org" />
    <fieldset class="col-span-full">
        <!-- <h2 class="text-xl mb-5 mt-2 font-medium">Social media handles</h2> -->
        <div class="grid grid-cols-2 gap-6">
            <Input type="text" name="facebook" autocomplete="off" spellcheck={false} placeholder="mycharity" icon={Facebook} />
            <Input type="text" name="twitter" autocomplete="off" spellcheck={false} placeholder="mycharity" icon={Twitter} />
            <Input type="text" name="instagram" autocomplete="off" spellcheck={false} placeholder="mycharity" icon={Instagram} />
            <Input type="text" name="youtube" autocomplete="off" spellcheck={false} placeholder="mycharity" icon={YouTube} />
        </div>
    </fieldset>
    <Button class="col-span-full mt-2" type="submit">Request</Button>
</form>