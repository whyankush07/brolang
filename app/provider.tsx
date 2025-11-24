import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeProvider";
import { CodeProvider } from "@/context/CodeContext";
import NextTopLoader from 'nextjs-toploader';
import OfflineNotification from "@/components/Offline-navigator";
import { ScrollBarProps } from "@/components/Scrollbar";
import Header from "@/components/Header";
import { Analytics } from "@vercel/analytics/react"
import SessionProviderWrapper from "@/context/SessionProvider";
import { Toaster } from 'sonner';

export default function ProviderWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SessionProviderWrapper>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                <CodeProvider>
                    <ScrollBarProps >
                        <NextTopLoader
                            showSpinner={false}
                        />
                        <Header />
                        <OfflineNotification />
                        <Analytics />
                        {children}
                        <Toaster richColors />
                    </ScrollBarProps>
                </CodeProvider>
            </ThemeProvider>
        </SessionProviderWrapper>
    );
}