'use client';

import React from 'react';
import { Layout, Typography, Row, Col, Space } from 'antd';
import { GithubOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';

const { Footer: AntFooter } = Layout;
const { Text, Link } = Typography;

const Footer: React.FC = () => {
    return (
        <AntFooter style={{ textAlign: 'center' }}>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={8}>
                    <Text strong>Markkam</Text>
                    <br />
                    <Text type="secondary">Premium E-commerce Experience</Text>
                </Col>
                <Col xs={24} sm={8}>
                    <Space orientation="vertical">
                        <Link href="#">About Us</Link>
                        <Link href="#">Contact</Link>
                        <Link href="#">Terms of Service</Link>
                    </Space>
                </Col>
                <Col xs={24} sm={8}>
                    <Space size="large">
                        <Link href="#" target="_blank"><GithubOutlined style={{ fontSize: 24 }} /></Link>
                        <Link href="#" target="_blank"><TwitterOutlined style={{ fontSize: 24 }} /></Link>
                        <Link href="#" target="_blank"><LinkedinOutlined style={{ fontSize: 24 }} /></Link>
                    </Space>
                </Col>
            </Row>
            <div style={{ marginTop: 24 }}>
                <Text type="secondary">© {new Date().getFullYear()} Shopping App. All Rights Reserved.</Text>
            </div>
        </AntFooter>
    );
};

export default Footer;
