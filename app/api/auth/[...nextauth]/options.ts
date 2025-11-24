
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

    secret: process.env.NEXTAUTH_SECRET,

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

        async jwt({ token, user }) {
            try {
                if (user?.email) {
                    const dbUser = await prisma.user.findUnique({ where: { email: user.email } });
                    if (dbUser) {
                        (token as any).id = dbUser.id;
                        (token as any).name = dbUser.name;
                        (token as any).email = dbUser.email;
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

        redirect() {
            return '/playground';
        }
    },
};
