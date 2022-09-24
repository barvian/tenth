import WithFooterLayout from "./WithFooter";

export default function Post({ children }: React.PropsWithChildren) {
    return (
        <WithFooterLayout>
            <header className="pt-9 pb-section">
                {/* <Nav /> */}
            </header>
            <main className="max-w-prose mx-auto pb-section">
                <article className="prose">
                    {children}
                </article>
            </main>
        </WithFooterLayout>
    )
}