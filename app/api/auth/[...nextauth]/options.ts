
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                code: { label: "Verification Code", type: "text" },
            },
            async authorize(credentials) {
                if (!credentials || !credentials.email || !credentials.code) return null;

                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                if (!user) return null;

                if (user.verificationCode !== credentials.code) return null;

                return {
                    id: user.id,
                    name: user.name ?? undefined,
                    email: user.email,
                } as any;
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_ID ?? "",
            clientSecret: process.env.GOOGLE_SECRET ?? "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],

    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },

    secret: process.env.NEXTAUTH_SECRET,

    debug: process.env.NODE_ENV === 'development',

    pages: {
        signIn: '/login',
    },

    callbacks: {
        async signIn({ user }) {
            try {
                const userEmail = user?.email;
                if (!userEmail) return false;

                const existing = await prisma.user.findUnique({ where: { email: userEmail } });
                if (!existing) {
                    await prisma.user.create({
                        data: {
                            email: userEmail,
                            name: user.name ?? "",
                            verificationCode: "",
                        },
                    });
                } else {
                    await prisma.user.update({
                        where: { email: userEmail },
                        data: {
                            name: user.name ?? "",
                            verificationCode: "",
                        },
                    });
                }

                return true;
            } catch (err) {
                console.error("Error in signIn callback:", err);
                return false;
            }
        },

        async jwt({ token, user, trigger }) {
            try {
                if (user) {
                    token.id = user.id;
                    token.name = user.name;
                    token.email = user.email;
                }
                else if (token.email && !token.id) {
                    const dbUser = await prisma.user.findUnique({ 
                        where: { email: token.email as string } 
                    });
                    if (dbUser) {
                        token.id = dbUser.id;
                        token.name = dbUser.name;
                        token.email = dbUser.email;
                    }
                }
            } catch (err) {
                console.error("Error in jwt callback:", err);
            }
            return token;
        },

        async session({ session, token }) {
            if (session?.user) {
                (session.user as any).id = (token as any).id;
                (session.user as any).name = (token as any).name;
                (session.user as any).email = (token as any).email;
            }
            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            else if (new URL(url).origin === baseUrl) return url;
            return `${baseUrl}/playground`;
        }
    },
};
