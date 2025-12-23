'use client';

import React from 'react';
import { Row, Col, Typography, Input, Select, Space, Breadcrumb, Grid } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { mockProducts } from '@/lib/mockData';
import ProductCard from '@/components/products/ProductCard';

const { Title } = Typography;
const { Search } = Input;
const { useBreakpoint } = Grid;

const ProductsPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [categoryFilter, setCategoryFilter] = React.useState<string | null>(null);
    const [sortOrder, setSortOrder] = React.useState<string>('default');

    // Explicitly handle hydration mismatch for useBreakpoint
    const [mounted, setMounted] = React.useState(false);
    const screens = useBreakpoint();
    const isMobile = !screens.sm && mounted; // xs only logic requiring mount

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const categories = Array.from(new Set(mockProducts.map(p => p.category)));
    console.log("categories ::", categories);
    const filteredProducts = mockProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
        return matchesSearch && matchesCategory;
    }).sort((a, b) => {
        if (sortOrder === 'price_asc') return a.price - b.price;
        if (sortOrder === 'price_desc') return b.price - a.price;
        return 0;
    });

    return (
        <div style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
            {!isMobile && (
                <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Products' }]} style={{ marginBottom: 24 }} />
            )}

            <div style={{ marginBottom: 32, display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={2} style={{ margin: 0 }}>All Products</Title>

                <Space wrap>
                    <Search
                        id="product-search-input"
                        placeholder="Search products..."
                        allowClear
                        onSearch={value => setSearchTerm(value)}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{ width: 250 }}
                    />
                    <Select
                        id="category-select"
                        placeholder="Category"
                        style={{ width: 150 }}
                        allowClear
                        onChange={val => setCategoryFilter(val)}
                        options={categories.map(c => ({ label: c, value: c }))}
                    />
                    <Select
                        id="sort-select"
                        defaultValue="default"
                        style={{ width: 150 }}
                        onChange={val => setSortOrder(val)}
                        options={[
                            { label: 'Sort by', value: 'default' },
                            { label: 'Price: Low to High', value: 'price_asc' },
                            { label: 'Price: High to Low', value: 'price_desc' },
                        ]}
                    />
                </Space>
            </div>

            <div style={{ flex: 1 }}>
                {filteredProducts.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: 50 }}>
                        <Typography.Text type="secondary">No products found.</Typography.Text>
                    </div>
                ) : (
                    <Row gutter={isMobile ? [8, 8] : [24, 24]}>
                        {filteredProducts.map(product => (
                            <Col xs={8} sm={12} md={8} lg={6} key={product.id}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                    </Row>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;
