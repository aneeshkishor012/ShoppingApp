'use client';

import React, { useState } from 'react';
import { Table, Tag, Typography, Button, Space } from 'antd';

const { Title } = Typography;

const AdminUsersPage: React.FC = () => {
    // Mock Users
    const [users, setUsers] = useState([
        { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'admin', status: 'active' },
        { id: '2', name: 'Demo User', email: 'user@example.com', role: 'user', status: 'active' },
        { id: '3', name: 'John Doe', email: 'john@example.com', role: 'user', status: 'inactive' },
    ]);

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
            render: (role: string) => <Tag color={role === 'admin' ? 'blue' : 'green'}>{role.toUpperCase()}</Tag>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => <Tag color={status === 'active' ? 'success' : 'error'}>{status.toUpperCase()}</Tag>,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: any) => (
                <Space size="middle">
                    <Button type="link">Edit</Button>
                    <Button type="link" danger>Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Title level={2} style={{ marginBottom: 24 }}>Users Management</Title>
            <Table columns={columns} dataSource={users} rowKey="id" />
        </div>
    );
};

export default AdminUsersPage;
