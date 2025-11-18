import LoginPage from "@/components/auth/login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login - " + process.env.NEXT_PUBLIC_APP_NAME,
    description: "Login to " + process.env.NEXT_PUBLIC_APP_NAME,
};

export default function Page() {
    return <LoginPage />
}