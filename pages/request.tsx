import Button from '../components/Button'
import Grid from '../components/Grid'
import Facebook from '../components/icons/data/Facebook'
import Instagram from '../components/icons/data/Instagram'
import Twitter from '../components/icons/data/Twitter'
import YouTube from '../components/icons/data/YouTube'
import Input from '../components/Input'
import WithFooter from '../components/layouts/WithFooter'
import Nav from '../components/Nav'
import type { NextPageWithLayout } from './_app'

const Request: NextPageWithLayout = () => {
  return (
    <>
      <header className="pt-9 pb-section">
            <Nav />
        </header>
        <main className="pb-hero">
            <Grid>
                <header className="col-span-5">
                    <h1 className="text-4xl font-medium">Request a nonprofit</h1>
                    <p className="text-xl mt-5 text-dim">
                        Use the form to request that a nonprofit be added to the Change network, which Tenth uses. Please fill out as many fields as possible; missing information may cause processing delays.
                    </p>
                    <p className="mt-7 bg-dark/5 bg-svg-wave-lightgray rounded-3xl p-9">
                        If you're a member of a nonprofit and wish to accept donations from Tenth, you can <a className="font-medium text-red-400" href="https://getchange.io/nonprofits/">claim your nonprofit on the Change network</a>.</p>
                </header>
                <form method="POST" className="col-span-6 col-start-7 grid grid-cols-3 gap-6">
                    <Input className="col-span-full" autoComplete="off" type="text" name="name" shadow label="Nonprofit's name" required />
                    <Input className="col-span-full" autoComplete="off" type="text" name="ein" shadow label="Employer Identification Number" placeholder="e.g. 41-1627391" required>
                        Not sure where to find this? Search for your nonprofit on <a className="text-red-400 font-medium link" href="http://www.guidestar.org/" target="_blank">Guidestar</a>.
                    </Input>
                    <Input className="col-span-full" autoComplete="off" type="text" name="address" shadow label="Address line" placeholder="e.g. 1452 DoGood Lane" />
                    <Input className="col-span-2" autoComplete="off" type="text" name="city" shadow label="City" />
                    <Input className="col-span-1 uppercase" autoComplete="off" maxLength={2} type="text" name="state" shadow label="State" placeholder="e.g. IL" />
                    <Input className="col-span-full" autoComplete="off" type="url" name="site" shadow label="Website" placeholder="e.g. http://mycharity.org" />
                    <fieldset className="col-span-full">
                        <legend>Social media handles</legend>
                        <div className="grid grid-cols-2 gap-6">
                            <Input type="text" name="facebook" autoComplete="off" spellCheck={false} shadow placeholder="mycharity" icon={Facebook} />
                            <Input type="text" name="twitter" autoComplete="off" spellCheck={false} shadow placeholder="mycharity" icon={Twitter} />
                            <Input type="text" name="instagram" autoComplete="off" spellCheck={false} shadow placeholder="mycharity" icon={Instagram} />
                            <Input type="text" name="youtube" autoComplete="off" spellCheck={false} shadow placeholder="mycharity" icon={YouTube} />
                        </div>
                    </fieldset>
                    <Button shadow type="submit">Submit</Button>
                </form>
            </Grid>
        </main>
    </>
  )
}

Request.rootClassName = 'bg-white bg-noise-white'
Request.layout = WithFooter

export default Request
