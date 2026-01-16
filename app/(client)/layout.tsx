
export default async function ClientLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <div>
                {children}
            </div>
        </>
    )
}