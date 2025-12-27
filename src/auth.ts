import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';

const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require' });

async function getUser(email: string): Promise<User | undefined> {
    console.log('Fetching user for email:', email);
    try {
        const user = await sql<User[]>`SELECT * FROM users WHERE email=${email}`;
        console.log('Database result for user:', user[0] ? 'Found' : 'Not Found');
        return user[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    trustHost: true,
    providers: [
        Credentials({
            async authorize(credentials) {
                console.log('Authorize called with:', credentials.email);
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) {
                        console.log('Authorize: No user found for email:', email);
                        return null;
                    }
                    console.log('Authorize: User found, comparing passwords...');
                    const passwordsMatch = await bcrypt.compare(password, user.password!);
                    console.log('Authorize: Passwords match:', passwordsMatch);
                    if (passwordsMatch) {
                        const { password: _, ...userWithoutPassword } = user;
                        console.log('Authorize: login successful, returning user:', userWithoutPassword.email);
                        return userWithoutPassword;
                    }
                }

                console.log('Authorize: failed (invalid credentials or parse error)');
                return null;
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            console.log('JWT Callback - User:', user);
            if (user) {
                token.id = user.id;
                token.role = (user as User).role;
                token.name = user.name;
            }
            console.log('JWT Callback - Token:', token);
            return token;
        },
        async session({ session, token }) {
            console.log('Session Callback - Token:', token);
            if (token && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as 'user' | 'admin';
                session.user.name = token.name as string;
            }
            console.log('Session Callback - Session:', session);
            return session;
        },
        ...authConfig.callbacks,
    },
});
