<script lang="ts">
    import Button from "~/components/Button.svelte";
    import Facebook from "~/components/icons/social/Facebook.svelte";
    import Instagram from "~/components/icons/social/Instagram.svelte";
    import Twitter from "~/components/icons/social/Twitter.svelte";
    import YouTube from "~/components/icons/social/YouTube.svelte";
    import Input from "~/components/Input.svelte";
</script>

<header class="col-span-5">
    <h1 class="text-4xl font-medium">Request a charity</h1>
    <p class="text-xl mt-5 text-gray-500">
        Use the form to request that a charity be added to the Change network, which Tenth uses. Please fill out as many fields as possible; missing information may cause processing delays.
    </p>
    <p class="mt-7 bg-dark/5 bg-svg-wave-lightgray rounded-3xl p-9">
        If you're a member of a charity and wish to accept donations from Tenth, you can <a class="font-medium text-red-400" href="https://getchange.io/nonprofits/">claim your charity on the Change network</a>.</p>
</header>
<form method="POST" class="col-span-6 col-start-7 grid grid-cols-3 gap-6">
    <Input class="col-span-full" autocomplete="off" type="text" name="name" shadow label="Charity name" required />
    <Input class="col-span-full" autocomplete="off" type="text" name="ein" shadow label="Employer Identification Number" placeholder="e.g. 41-1627391" required>
        Not sure where to find this? Search for your charity on <a class="text-red-400 font-medium link" href="http://www.guidestar.org/" target="_blank">Guidestar</a>.
    </Input>
    <Input class="col-span-full" autocomplete="off" type="text" name="address_line" shadow label="Address line" placeholder="e.g. 1452 DoGood Lane" />
    <Input class="col-span-2" autocomplete="off" type="text" name="city" shadow label="City" />
    <Input class="col-span-1 uppercase" autocomplete="off" maxlength={2} type="text" name="state" shadow label="State" placeholder="e.g. IL" />
    <Input class="col-span-full" autocomplete="off" type="url" name="website" shadow label="Website" placeholder="e.g. http://mycharity.org" />
    <fieldset class="col-span-full">
        <legend>Social media handles</legend>
        <div class="grid grid-cols-2 gap-6">
            <Input type="text" name="facebook" autocomplete="off" spellcheck={false} shadow placeholder="mycharity" icon={Facebook} />
            <Input type="text" name="twitter" autocomplete="off" spellcheck={false} shadow placeholder="mycharity" icon={Twitter} />
            <Input type="text" name="instagram" autocomplete="off" spellcheck={false} shadow placeholder="mycharity" icon={Instagram} />
            <Input type="text" name="youtube" autocomplete="off" spellcheck={false} shadow placeholder="mycharity" icon={YouTube} />
        </div>
    </fieldset>
    <Button shadow type="submit">Submit</Button>
</form>