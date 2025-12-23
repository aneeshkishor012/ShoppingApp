'use client';

import React, { useState } from 'react';
import { Table, Button, Space, Modal, Form, Input, InputNumber, Select, message, Popconfirm, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mockProducts, Product } from '@/lib/mockData';

const { Title } = Typography;
const { TextArea } = Input;

const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [form] = Form.useForm();

    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (src: string) => <img src={src} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (price: number) => `₹${price.toFixed(2)}`,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: Product) => (
                <Space size="middle">
                    <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    <Popconfirm
                        title="Delete the product"
                        description="Are you sure to delete this product?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const handleDelete = (id: string) => {
        setProducts(products.filter(p => p.id !== id));
        message.success('Product deleted successfully');
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        form.setFieldsValue(product);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setEditingProduct(null);
        form.resetFields();
        setIsModalOpen(true);
    };

    const handleOk = () => {
        form.validateFields().then(values => {
            if (editingProduct) {
                // Update
                const updatedProducts = products.map(p =>
                    p.id === editingProduct.id ? { ...p, ...values } : p
                );
                setProducts(updatedProducts);
                message.success('Product updated successfully');
            } else {
                // Add
                const newProduct = {
                    ...values,
                    id: Math.random().toString(36).substr(2, 9),
                    rating: 0,
                    image: 'https://via.placeholder.com/150'
                };
                setProducts([...products, newProduct]);
                message.success('Product added successfully');
            }
            setIsModalOpen(false);
        });
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Products</Title>
                <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
                    Add Product
                </Button>
            </div>

            <Table columns={columns} dataSource={products} rowKey="id" />

            <Modal
                title={editingProduct ? "Edit Product" : "Add Product"}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={() => setIsModalOpen(false)}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="name" label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="category" label="Category" rules={[{ required: true }]}>
                        <Select options={[
                            { label: 'Electronics', value: 'Electronics' },
                            { label: 'Fashion', value: 'Fashion' },
                            { label: 'Home & Office', value: 'Home & Office' },
                        ]} />
                    </Form.Item>
                    <Form.Item name="price" label="Price" rules={[{ required: true }]}>
                        <InputNumber min={0} prefix="₹" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <TextArea rows={4} />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AdminProductsPage;
