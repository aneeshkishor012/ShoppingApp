import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            console.log('Auth Callback - Auth:', auth);
            console.log('Auth Callback - Next URL:', nextUrl);

            const isLoggedIn = !!auth?.user;
            // Redirect to home if logged in and trying to access login page or root
            if (isLoggedIn && nextUrl.pathname === '/login') {
                return Response.redirect(new URL('/', nextUrl));
            }
            return true;
        },
    },
    providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;