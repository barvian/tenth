import Head from "next/head";
import { FormEvent, useState } from "react";
import Button from "../components/Button";
import FlipCard from "../components/FlipCard";
import Input from "../components/Input";
import Nav from "../components/Nav";
import type { NextPageWithLayout } from './_app'
import theme from '../tailwind.colors.json'
import Link from "next/link";

const Login: NextPageWithLayout = () => {
    const [verifying, setVerifying] = useState(false)
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')

    const login = async (event: FormEvent) => {
        event?.preventDefault()
    }

    const verify = async (event: FormEvent) => {
        event?.preventDefault()
    }
    
    return (
        <>
            <Head>
                <meta name="theme-color" content={theme["amber"][50]} />
            </Head>

            <header className="pt-9 pb-section">
                <Nav />
            </header>
            <main className="self-center justify-self-center flex flex-col items-center gap-8 pb-section">
                <FlipCard className="w-[400px]"
                    flipped={verifying}
                    complete={false}
                    front={
                        <form onSubmit={login} className="h-full flex flex-col">
                            <h1 className="text-2xl font-bold text-center mb-5">Sign in to Tenth</h1>
                            <Input required showRequired={false} type="email" name="email" label="Email" value={email} onChange={e => setEmail(e.currentTarget.value)}>
                                We'll send you a code to get you signed in.
                            </Input>
                            <Button type="submit" fullWidth className="mt-4">
                                Sign in
                            </Button>
                        </form>
                    }
                    back={
                        <form onSubmit={verify} className="h-full flex flex-col">
                            <h2 className="text-2xl font-bold text-center mb-[min(auto,theme(space.3))]">Welcome back!</h2>
                            <p className="text-lg text-dim mb-auto leading-snug text-center">Please enter the 6-digit code we sent to <span className="font-medium text-black">{email}</span>.</p>
                            <Input required showRequired={false} type="text" name="otp" label="Code" value={otp} onChange={e => setOtp(e.currentTarget.value)}>
                                Didn't get a code? Resend.
                            </Input>
                            <Button type="submit" fullWidth>
                                Continue
                            </Button>
                        </form>
                    }
                />

                <footer className="flex gap-3 inner text-amber-400">
                    <span>© 2022 Tenth, LLC.</span>
                    <span>·</span>
                    <Link href="/privacy"><a>Privacy</a></Link>
                    <span>·</span>
                    <Link href="/terms"><a>Terms</a></Link>
                </footer>
            </main>
        </>
    )
}

Login.rootClassName = 'bg-gradient-to-b from-amber-50 to-amber-100 bg-no-repeat'
Login.bodyClassName = 'grid grid-rows-[min-content_1fr]'

export default Login