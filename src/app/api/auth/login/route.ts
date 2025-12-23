import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    console.log('Login API called');
    try {
        const body = await request.json();
        const { email, password } = body;
        console.log('Login request for:', email);

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        console.log('Connecting to DB...');
        const client = await pool.connect();
        console.log('Connected to DB');

        try {
            console.log('Querying user...');
            const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
            const user = result.rows[0];
            console.log('User found:', !!user);

            if (!user) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            console.log('Verifying password...');
            const passwordsMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', passwordsMatch);

            if (!passwordsMatch) {
                return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
            }

            // Return user info sans password
            const { password: _, ...userWithoutPassword } = user;

            return NextResponse.json(userWithoutPassword, { status: 200 });

        } finally {
            client.release();
        }

    } catch (error: any) {
        console.error('Login error detail:', error);
        return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
    }
}
