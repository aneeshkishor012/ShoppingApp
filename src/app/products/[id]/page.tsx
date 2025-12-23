import React from 'react';
import { mockProducts } from '@/lib/mockData';
import ProductDetailsClient from '@/components/products/ProductDetailsClient';

export async function generateStaticParams() {
    return mockProducts.map((product) => ({
        id: product.id,
    }));
}

export default function ProductDetailsPage() {
    return <ProductDetailsClient />;
}
