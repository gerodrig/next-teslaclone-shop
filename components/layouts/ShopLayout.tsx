import { FC } from "react";
import Head from "next/head";
import { Navbar, SideMenu } from "../ui";


interface ShopLayoutProps {
    title: string;
    pageDescription: string;
    imageFullUrl?: string;
}

export const ShopLayout: FC<ShopLayoutProps> = ({children, title, pageDescription, imageFullUrl}) => {
    return (
        <>
        <Head>
            <title>{title}</title>

            <meta name="description" content={pageDescription} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={pageDescription} />

            {/* //display meta if image is available */}
            {
                imageFullUrl && (
                    <meta name="og:image" content={imageFullUrl} />
                )
            }
        </Head>

        <nav>
            <Navbar />
        </nav>

        {/* SideBar */}
        <SideMenu />

        <main style={{ margin: '80px auto', maxWidth: '1440px', padding: '0px 30px'}} >
            {children}
        </main>

        {/* TODO: insert custom footer */}
        <footer>
            
        </footer>
        </>
    )
}
