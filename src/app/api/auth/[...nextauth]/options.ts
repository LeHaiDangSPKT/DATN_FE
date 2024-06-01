import { APIGoogleLogin } from "@/services/Auth";
import NextAuth, { AuthOptions, NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { redirect } from "next/navigation";
export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_UID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
        }),
        // FacebookProvider({
        //     clientId: process.env.FACEBOOK_CLIENT_ID,
        //     clientSecret: process.env.FACEBOOK_CLIENT_SECRET
        //   })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            const res = await APIGoogleLogin(account!.id_token! as string);
            if (res?.status !== 200 && res.status !== 201) {
                return false;
            }
            user.id = JSON.stringify(res.data.metadata.data)
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.name = token.sub!;
            }
            return session;
        }
    }
};