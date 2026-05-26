import React from 'react';
import { Row, Col, Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import { TwitterOutlined, InstagramOutlined, LinkedinOutlined, GithubOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

const Footer = () => {
    return (
        <div className="footer-wrapper">
            <style>
                {`
                .footer-wrapper {
                    background: #fff;
                    border-top: 1px solid rgba(0,0,0,0.04);
                    padding: 80px 32px 40px;
                    margin-top: 40px;
                }

                @media (max-width: 768px) {
                    .footer-wrapper {
                        padding: 60px 20px 30px;
                    }
                }

                .footer-container {
                    max-width: 1280px;
                    margin: 0 auto;
                }

                .footer-logo {
                    font-size: 14px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #111;
                    text-transform: uppercase;
                    margin-bottom: 24px;
                    display: inline-block;
                }

                .footer-desc {
                    color: #666;
                    font-size: 13px;
                    line-height: 1.6;
                    max-width: 280px;
                    margin-bottom: 32px;
                }

                .footer-title {
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    color: #111 !important;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 24px !important;
                }

                .footer-link {
                    color: #666;
                    font-size: 13px;
                    text-decoration: none;
                    transition: color 0.2s ease;
                    display: block;
                    margin-bottom: 16px;
                }

                .footer-link:hover {
                    color: #111;
                }

                .social-icon {
                    color: #111;
                    font-size: 18px;
                    transition: opacity 0.2s ease;
                }

                .social-icon:hover {
                    opacity: 0.6;
                }

                .footer-bottom {
                    margin-top: 60px;
                    padding-top: 24px;
                    border-top: 1px solid rgba(0,0,0,0.04);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-bottom-text {
                    color: #888;
                    font-size: 12px;
                }
                `}
            </style>

            <div className="footer-container">
                <Row gutter={[48, 48]}>
                    <Col xs={24} lg={8}>
                        <div className="footer-logo">UTESHOP</div>
                        <div className="footer-desc">
                            Premium tech store offering the best selection of laptops and accessories for creators, gamers, and professionals.
                        </div>
                        <Space size={16}>
                            <a href="#" className="social-icon"><TwitterOutlined /></a>
                            <a href="#" className="social-icon"><InstagramOutlined /></a>
                            <a href="#" className="social-icon"><LinkedinOutlined /></a>
                            <a href="#" className="social-icon"><GithubOutlined /></a>
                        </Space>
                    </Col>
                    
                    <Col xs={24} sm={8} lg={5} offset={lg => 1}>
                        <Title className="footer-title">Products</Title>
                        <Link to="/products" className="footer-link">Laptops</Link>
                        <Link to="#" className="footer-link">Accessories</Link>
                        <Link to="#" className="footer-link">New Arrivals</Link>
                        <Link to="#" className="footer-link">Special Offers</Link>
                    </Col>

                    <Col xs={24} sm={8} lg={5}>
                        <Title className="footer-title">Support</Title>
                        <Link to="#" className="footer-link">Help Center</Link>
                        <Link to="#" className="footer-link">Warranty</Link>
                        <Link to="#" className="footer-link">Order Tracking</Link>
                        <Link to="#" className="footer-link">Contact Us</Link>
                    </Col>

                    <Col xs={24} sm={8} lg={5}>
                        <Title className="footer-title">Company</Title>
                        <Link to="#" className="footer-link">About Us</Link>
                        <Link to="#" className="footer-link">Careers</Link>
                        <Link to="#" className="footer-link">Privacy Policy</Link>
                        <Link to="#" className="footer-link">Terms of Service</Link>
                    </Col>
                </Row>

                <div className="footer-bottom">
                    <Text className="footer-bottom-text">
                        © {new Date().getFullYear()} UTESHOP. All rights reserved.
                    </Text>
                    <Space size={24}>
                        <Text className="footer-bottom-text" style={{ cursor: 'pointer' }}>Privacy</Text>
                        <Text className="footer-bottom-text" style={{ cursor: 'pointer' }}>Terms</Text>
                    </Space>
                </div>
            </div>
        </div>
    );
};

export default Footer;