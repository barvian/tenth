<script lang="ts">
    import { applyAction, enhance, type SubmitFunction } from '$app/forms';
    import { beforeNavigate } from '$app/navigation';
    import type { Nonprofit } from 'types/change';
    import theme from '~/../tailwind.colors.json';
    import Donut from "~/components/Donut.svelte";
    import Grid from "~/components/Grid.svelte";
    import Logo from '~/components/icons/Logo.svelte';
    import Nav from "~/components/Nav.svelte";
    import Shadow from '~/components/Shadow.svelte';
    import type { StepDirection } from '~/lib/transition';
    import type { PageData } from './$types';
    import Percentage from './Percentage.svelte';
    import SignUp from './SignUp.svelte';
    import VerifyOtp from './VerifyOTP.svelte';

    export let data: PageData
    let designated: Nonprofit[] = []
    
    const steps = ['charities', 'signup', 'verify'] as const
    type OnboardingStep = typeof steps[number]
    let step: OnboardingStep = 'charities', lastStep: OnboardingStep | null = null, direction: StepDirection
    let percent = '10'

    function beforeUnload(event: BeforeUnloadEvent) {
        if (step !== 'charities') {
            event.preventDefault();
            return event.returnValue = `Are you sure you want to exit? You'll have to start the sign-up process over.`;
        }
    }

    beforeNavigate(({ from, to }) => {
        if (from?.url.origin === to?.url.origin && to?.url.pathname === '/') {
            step = 'charities'
        }
    })

    $: {
        if (!lastStep) direction = 'forward'
        else direction = steps.indexOf(step) > steps.indexOf(lastStep) ? 'forward' : 'backward'
        lastStep = step
    }

    let loading = false
    const register: SubmitFunction = ({ action }) => {
        loading = true
        return async ({ result }) => {
            applyAction(result)
            if (result.type === 'success' && action.href.endsWith('/send')) {
                step = 'verify'
            }
            loading = false
        }
    }

    let showingBreakdowns = false
</script>

<svelte:window on:beforeunload={beforeUnload}/>
<svelte:head>
    <meta name="theme-color" content={theme["amber"][50]}>
</svelte:head>

<header class="bg-gradient-to-b from-amber-50 to-amber-100 pt-9 pb-hero overflow-hidden">
    <Nav class="mb-9" />
    <div class="overlap">
        <Grid class="relative">
            <svg class="absolute right-full mr-[2vw] " height="87" viewBox="0 0 119 108" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.53704 10.1486C25.2718 4.37337 37.2298 12.1296 40.4111 33.4173C43.5923 54.7049 55.5503 62.4611 76.2851 56.6859C97.0199 50.9107 108.978 58.6669 112.159 79.9546" stroke="black" stroke-width="2"/>
                <path d="M-7.41755 27.4428C13.3172 21.6676 25.2753 29.4238 28.4565 50.7114C31.6377 71.9991 43.5957 79.7553 64.3305 73.9801C85.0653 68.2049 97.0233 75.9611 100.205 97.2488" stroke="black" stroke-width="2"/>
            </svg>
            <div class="lg:col-span-5 lg:col-start-8 relative">
                <Donut {percent} class="absolute top-0 left-0 w-[200%]" />
            </div>
        </Grid>
        <form class="md:pt-[4vh] relative z-10 overlap" action="javascript:void(0)" use:enhance={register}>
            <div>
                <Percentage bind:percent bind:designated active={step === 'charities'} popular={data.popular} on:continue={() => step = 'signup'} />                
            </div>
            <div>
                <SignUp {loading} active={step === 'signup'} />
            </div>
            <div>
                <VerifyOtp {loading} active={step === 'verify'} on:changeemail={() => step = 'signup'} />
            </div>
        </form>
    </div>
</header>
<main class="bg-white bg-noise-white" id="benefits">
    <Grid class="group relative md:py-section items-center">
        <svg class="absolute right-full bottom-full translate-y-1/2" height="87" viewBox="0 0 136 108" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M135.085 35.1916C113.998 38.3193 93.2846 46.2389 74.5659 59.2769C55.8472 72.3148 41.2378 88.9986 30.9937 107.694L6 93.9982C18.3112 71.5307 35.8674 51.4993 58.2769 35.8906C80.6864 20.282 105.562 10.7589 130.904 7L135.085 35.1916Z" fill="url(#paint0_linear_330_58)"/>
            <path d="M129.159 30.6862L129.653 30.6128L129.58 30.1182L125.399 1.92664L125.325 1.43205L124.831 1.50541C99.4138 5.27536 74.4653 14.8266 51.9911 30.4803C29.5169 46.1341 11.909 66.2242 -0.438485 88.7579L-0.678757 89.1964L-0.240272 89.4366L24.7534 103.132L25.1919 103.372L25.4322 102.934C35.64 84.3051 50.1978 67.68 68.8517 54.6872C87.5056 41.6943 108.146 33.8028 129.159 30.6862Z" vector-effect="non-scaling-stroke" stroke="black"/>
            <defs>
            <linearGradient id="paint0_linear_330_58" x1="118.497" y1="7.09577" x2="40.4968" y2="88.0958" gradientUnits="userSpaceOnUse">
            <stop stop-color="#BDD2E2"/>
            <stop offset="1" stop-color="#BDD2E2" stop-opacity="0.32"/>
            </linearGradient>
            </defs>
        </svg>
        <div class="md:col-span-5 ">
            <h2 class="text-3xl leading-tight font-bold mb-7">Put money in its place</h2>
            <p class="text-dim text-lg">Donating a percentage of your wealth rather than your income mimics a negative interest rate, which may cultivate a more giving, interconnected mindset.</p>
        </div>
        <blockquote class=" p-12 pt-14 round-3xl rounded relative lg:col-span-6 lg:col-start-7 bg-dark/5 bg-svg-wave-lightgray">
            <div class="absolute inset-0 border -translate-x-1 -translate-y-1 rounded pointer-events-none" role="presentation" />
            <svg class="absolute left-[40%] -top-1 -translate-x-1/2 -translate-y-1/2 h-14" viewBox="0 0 94 79" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M91.0625 5.93427L84.8203 -2.49592e-06C75.2734 6.67607 67.5625 14.8357 61.3203 24.4789C55.4453 34.1221 52.1406 44.8779 52.1406 56.7465C52.1406 62.6807 54.3437 67.8732 58.3828 72.3239C62.4219 76.7747 67.5625 79 73.4375 79C79.3125 79 84.4531 76.7747 88.125 72.6948C92.1641 68.2441 94 63.0517 94 57.1174C94 51.1831 92.1641 46.3615 87.7578 42.6526C83.7187 38.5728 78.9453 36.7183 73.4375 36.7183C74.1719 25.2206 80.0469 14.8357 91.0625 5.93427ZM38.9219 5.93427L32.6797 -2.49592e-06C23.1328 6.67607 15.4219 14.8357 9.17969 24.4789C3.30469 34.1221 -1.92491e-06 44.8779 -1.92491e-06 56.7465C-1.92491e-06 62.6807 2.20313 67.8732 6.24218 72.3239C10.2812 76.7747 15.4219 79 21.2969 79C27.1719 79 32.3125 76.7747 35.9844 72.6948C40.0234 68.2441 41.8594 63.0517 41.8594 57.1174C41.8594 51.1831 40.0234 46.3615 35.6172 42.6526C31.5781 38.5728 26.8047 36.7183 21.2969 36.7183C22.0313 25.2206 27.9062 14.8357 38.9219 5.93427Z" fill="#E49B22"/>
            </svg>    
            <p class="text-xl">
                [When] money decays with time, if I have money I’m not using, I am happy to lend it to you, just as if I had more bread than I could eat.
            </p>
            <cite class="mt-5 not-italic text-lg flex items-center"><img src="/img/eisenstein.jpg" class="aspect-square h-12 rounded-full inline-block mr-4" alt="Charles Eisenstein headshot" /><span class="flex-1 text-dim">Charles Eisenstein, <a href="https://sacred-economics.com/sacred-economics-chapter-12-negative-interest-economics/">Sacred Economics</a></span></cite>
        </blockquote>
    </Grid>
    <Grid class="relative md:py-section items-center group">
        <div class="md:col-span-5 relative flex justify-end">
            <img class="rounded-full w-[75%] " src="/img/people/1.jpg" alt="" role="presentation" />
            <img class="rounded-full w-3/5 absolute right-[75%] top-0 -translate-y-1/2" src="/img/people/2.jpg" alt="" role="presentation" />
            <img class="rounded-full w-2/5 absolute right-[75%] bottom-0 translate-y-1/2" src="/img/people/3.jpg" alt="" role="presentation" />
        </div>
        <div class=" md:col-span-5 md:col-start-7">
            <h2 class="text-3xl leading-tight font-bold mb-7">Donate consistently</h2>
            <p class="text-dim text-lg">Tenth respects the ebb and flow of your financial life. Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.  Lorem ipsum dolor sin amet.</p>
        </div>
        <svg class="absolute overflow-visible group top-5 right-0" width="140" viewBox="0 0 232 230" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="111" cy="111" r="111" fill="url(#paint0_linear_0_1)"/>
            <circle class="transition-transform duration-500 ease-in-out" cx="121" cy="119" r="110.25" stroke="black" stroke-width="1" vector-effect="non-scaling-stroke"/>
            <defs>
            <linearGradient id="paint0_linear_0_1" x1="111" y1="0" x2="111" y2="222" gradientUnits="userSpaceOnUse">
            <stop stop-color="#FEEAD5"/>
            <stop offset="1" stop-color="#FECCAC"/>
            </linearGradient>
            </defs>
        </svg>  
    </Grid>
    <section class="bg-red-50 bg-noise-white bg-blend-color-burn py-hero">
        <header class=" mb-12">
            <h2 class="text-3xl leading-tight font-bold mb-7 text-center">Pricing</h2>
            <p class="text-dim text-lg max-w-prose text-center mx-auto">Tenth's fees are (usually) lower than what you'd pay with monthly credit card donations.</p>
        </header>
        <Grid class="lg:gap-x-10 round-3xl items-start">
            <div class=" relative md:col-span-6">
                <Shadow class="left-1.5 top-2" />
                <details class="rounded bg-white border group relative px-8" bind:open={showingBreakdowns}>
                    <summary class="text-center p-12">
                        <Logo class="text-dim inline-block h-3" />
                        <span class="block mt-3 text-red-500 text-5xl font-bold text-border">1.5% + 15¢</span>
                        <span class="block mt-2 text-sm">per donation, + $1.55 one-time setup fee</span>
                        <div class="absolute inset-x-0 bottom-0">Show breakdown</div>
                    </summary>
                    <table class="table-auto mb-8">
                        <tbody>
                          <!-- <tr>
                            <td class="pr-4 border-b border-dim/25 pb-2.5">
                                <h4>ACH transaction fees</h4>
                                <p class="text-dim">The fees incurred to transfer money from a bank account.</p>
                            </td>
                            <td class="pb-2.5 align-top text-right border-b border-dim/25">1.6%</td>
                          </tr> -->
                          <tr>
                            <td class="pr-4 border-b border-dim/25 py-2.5">
                                <h4>Change fees</h4>
                                <p class="text-dim">The fees our donation processor, <a href="https://getchange.io">Change</a>, charges to process donations and pay out to charities.</p>
                            </td>
                            <td class="py-2.5 align-top text-right border-b border-dim/25">1.5%</td>
                          </tr>
                          <tr>
                            <td class="pr-4 border-b border-dim/25 py-2.5">
                                <h4>Account balance fee</h4>
                                <p class="text-dim">The fee we incur to check a bank account balance.</p>
                            </td>
                            <td class="py-2.5 align-top text-right border-b border-dim/25">15¢</td>
                          </tr>
                          <!-- <tr>
                            <td class="pr-4 border-b border-dim/25 py-2.5">
                                <h4>Tenth fee</h4>
                                <p class="text-dim">Our fee, to help cover server costs and updates.</p>
                            </td>
                            <td class="py-2.5 align-top text-right border-b border-dim/25">20¢</td>
                          </tr> -->
                          <tr>
                            <td class="pr-4 py-2.5">
                                <h4>Setup fee</h4>
                                <p class="text-dim">The fee we incur to link your bank account with our platform, only charged one time after successfully linking a checking account.</p>
                            </td>
                            <td class="py-2.5 align-top text-right">$1.55</td>
                          </tr>
                        </tbody>
                      </table>
                </details>
            </div>
            <details class="rounded bg-red-75 group md:col-span-6 relative px-8" bind:open={showingBreakdowns}>
                <summary class="text-center p-12">
                    <h3>Recurring Credit Card Donation Fees</h3>
                    <span class="block mt-3 text-red-100 text-5xl font-bold text-border-[rgba(0,0,0,0.4)]">3.7–7.8% + 30¢</span>
                    <span class="block mt-2 text-sm">per donation</span>
                </summary>
                <table class="table-auto mb-8">
                    <tbody>
                      <tr>
                        <td class="pr-4 border-b border-dim/25 pb-2.5">
                            <h4>Credit card processing fee</h4>
                            <p class="text-dim">The fees incurred to charge a credit card.</p>
                        </td>
                        <td class="pb-2.5 align-top text-right border-b border-dim/25 whitespace-nowrap">2.2—2.9% + 30¢</td>
                      </tr>
                      <tr>
                        <td class="pr-4 py-2.5">
                            <h4>Platform fees</h4>
                            <p class="text-dim">The fees incurred by donation platforms to process donations.</p>
                        </td>
                        <td class="py-2.5 align-top text-right">1.5—4.9%</td>
                      </tr>
                    </tbody>
                  </table>
            </details>
        </Grid>
        <section class="pt-hero">
            <h2 class="text-3xl leading-tight font-bold mb-7 text-center">FAQs</h2>
            <div class="inner grid gap-y-6 lg:grid-cols-2 lg:gap-x-10 round-3xl items-start">
                {#each data.faqs as {q, a}}
                    <details class="rounded-3xl border">
                        <summary class="text-lg font-medium p-8">{q}</summary>
                        <div class="p-8 pt-4">{@html a}</div>
                    </details>
                {/each}
            </div>
        </section>
    </section>
</main>