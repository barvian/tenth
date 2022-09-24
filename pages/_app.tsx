import '../styles/globals.css'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { UserProvider } from '@supabase/auth-helpers-react'
import { supabaseClient } from '@supabase/auth-helpers-nextjs'
import { ReactElement, ReactNode, useEffect } from 'react'
import React from 'react'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  rootClassName?: string,
  bodyClassName?: string,
  layout?: React.ComponentType
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

if (process.env.NEXT_PUBLIC_API_MOCKING === 'enabled') {
  require('../mocks')
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const bodyClassName = Component.bodyClassName
  const rootClassName = Component.rootClassName
  const Layout = Component.layout ?? (({children}: React.PropsWithChildren) => <>{children}</>)

  useEffect(() => {
    document.documentElement.className = rootClassName ?? ''
    document.body.className = bodyClassName ?? ''
  });

  return (
    <Layout>
      <UserProvider supabaseClient={supabaseClient}>
        <Component {...pageProps} />
      </UserProvider>
    </Layout>
  )
}

export default MyApp
