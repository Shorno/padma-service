import Navbar from "@/components/home/navbar/navbar";
import { SiteFooter } from "@/components/home/site-footer";

export default async function ClientLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                    {children}
                </main>
                <SiteFooter />
            </div>
        </>
    )
}
