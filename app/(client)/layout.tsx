import Navbar from "@/components/home/navbar/navbar";

export default async function ClientLayout({
                                               children,
                                           }: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <div>
                <Navbar/>
                {children}
            </div>
        </>
    )
}