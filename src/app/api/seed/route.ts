import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { users } from '@/lib/placeholder-data';
import { mockProducts } from '@/lib/mockData';
import bcrypt from 'bcryptjs';

export async function GET() {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        // Create UUID extension
        await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

        // Create Users Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      );
    `);

        // Create Products Table
        await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        discount_details INT,
        rating DECIMAL(3, 1),
        image TEXT,
        category VARCHAR(255)
      );
    `);

        // Insert Users
        const insertedUsers = await Promise.all(
            users.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return client.query(`
          INSERT INTO users (id, name, email, password, role)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (email) DO NOTHING
        `, [user.id, user.name, user.email, hashedPassword, 'user']);
            })
        );

        // Insert Products
        const insertedProducts = await Promise.all(
            mockProducts.map(async (product) => {
                return client.query(`
          INSERT INTO products (id, name, description, price, discount_details, rating, image, category)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            description = EXCLUDED.description,
            price = EXCLUDED.price,
            discount_details = EXCLUDED.discount_details,
            rating = EXCLUDED.rating,
            image = EXCLUDED.image,
            category = EXCLUDED.category
        `, [
                    product.id,
                    product.name,
                    product.description,
                    product.price,
                    product.discountDetails || null,
                    product.rating,
                    product.image,
                    product.category
                ]);
            })
        );

        await client.query('COMMIT');

        return NextResponse.json({ message: 'Database seeded successfully' }, { status: 200 });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Seed error:', error);
        return NextResponse.json({ error }, { status: 500 });
    } finally {
        client.release();
    }
}
