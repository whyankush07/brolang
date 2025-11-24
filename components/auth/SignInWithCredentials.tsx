'use client';
import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import siteConfig from '@/config/metadata';
import { FiLoader } from "react-icons/fi";
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function SignInWithCredentials() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const tokenRef = useRef<HTMLInputElement | null>(null);

    const router = useRouter();

    async function sendVerificationEmail() {
        setError(null);
        if (!email) {
            setError('Please enter your email first');
            return;
        }
        try {
            setLoading(true);
            const res = await fetch('/api/auth/send-verification-mail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data?.message || 'Failed to send verification email');
            }

            toast.info('Verification email sent! Please check your inbox.');
            setIsCodeSent(true);
            setTimeout(() => tokenRef.current?.focus(), 200);
        } catch (err: any) {
            setError(err?.message || 'Unable to send verification email');
        } finally {
            setLoading(false);
        }
    }

    async function handleSignIn() {
        setError(null);
        if (!email) return setError('Email is required');
        if (!code) return setError('Please enter the verification code');

        setLoading(true);
        try {
            const res = await signIn('credentials', {
                redirect: false,
                email,
                code,
            } as any);

            if (res && (res as any).error) {
                setError((res as any).error || 'Sign in failed');
            } else {
                toast.success('Signed in successfully!');
                router.replace('/playground');
            }
        } catch (err: any) {
            setError(err?.message || 'Sign in error');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-4 max-w-md w-full">
            <div>
                <label htmlFor="email" className="block text-foreground mb-2 text-sm">Email</label>
                <input
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
            </div>

            {/* Sliding token input */}
            <AnimatePresence initial={false}>
                {isCodeSent && (
                    <motion.div
                        key="token"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.28 }}
                        style={{ overflow: 'hidden' }}
                    >
                        <label htmlFor="token" className="block text-foreground mb-2 text-sm">Enter the token sent on {email}</label>
                        <input
                            id="token"
                            ref={tokenRef}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            type="text"
                            placeholder={`Enter verification code sent to ${email}`}
                            className="w-full px-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {error && <div className="text-sm text-red-500">{error}</div>}

            <div>
                {!isCodeSent ? (
                    <button
                        onClick={sendVerificationEmail}
                        disabled={loading}
                        className="cursor-pointer w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-60"
                    >
                        {loading ? <span className='flex space-x-2 justify-center'>Sending <FiLoader className='animate-spin text-accent' /></span>: 'Send verification email'}
                    </button>
                ) : (
                    <button
                        onClick={handleSignIn}
                        disabled={loading}
                        className="cursor-pointer w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors disabled:opacity-60"
                    >
                        {loading ? 'Signing in…' : `Login to ${siteConfig.name}`}
                    </button>
                )}
            </div>
        </div>
    );
}