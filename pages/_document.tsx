import Document, { type DocumentContext, type DocumentInitialProps, Html, Head, Main, NextScript } from 'next/document'
import type { NextPageWithLayout } from './_app'

let rootClassName: string | undefined
let bodyClassName: string | undefined

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const originalRenderPage = ctx.renderPage

    // Run the React rendering logic synchronously
    ctx.renderPage = () =>
      originalRenderPage({
        enhanceComponent: (Component) => {
            rootClassName = (Component as NextPageWithLayout).rootClassName
            bodyClassName = (Component as NextPageWithLayout).bodyClassName
            return Component
        }
      })
    
    const initialProps = await Document.getInitialProps(ctx)

    return initialProps
  }

  render() {
    return (
        <Html className={rootClassName}>
          <Head />
          <body className={bodyClassName}>
            <Main />
            <NextScript />
          </body>
        </Html>
      )
  }
}