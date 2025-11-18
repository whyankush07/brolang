'use client';
import { GoSignOut } from "react-icons/go";
import { signOut, useSession } from "next-auth/react";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { useRouter } from "next/navigation";

export default function SignOutButton() {
    const { data: session } = useSession();
    const router = useRouter();
    const handleClick = () => {
        if (session?.user?.email) {
            signOut();
        } else {
            router.push('/login');
        }
    }
    return (
        <div className="cursor-pointer flex items-center gap-3">
            <button onClick={handleClick} className="flex items-center gap-2 px-2 py-1">
                <ShimmerButton >{session?.user?.email ? 'Signout' : 'Login'}</ShimmerButton>
            </button>
        </div>
    )
}