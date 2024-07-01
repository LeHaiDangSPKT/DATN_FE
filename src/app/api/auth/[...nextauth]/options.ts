import { APIFacebookLogin, APIGoogleLogin } from "@/services/Auth";
import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_UID!,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_APPID!,
            clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_SECRET!
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            let res = null;
            if (account?.provider === 'google') {
                res = await APIGoogleLogin(account!.id_token! as string);
            } else {
                res = await APIFacebookLogin(account!.access_token! as string);
            }
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
    },
    secret: process.env.NEXTAUTH_SECRET,
};