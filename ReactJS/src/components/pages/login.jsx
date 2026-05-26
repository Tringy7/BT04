import React, { useContext } from 'react';
import { Button, Divider, Form, Input, notification, Typography } from 'antd';
import { loginApi } from '../util/api/auth.api';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { ArrowLeftOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const LoginPage = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);

    const onFinish = async (values) => {
        const { email, password } = values;

        const res = await loginApi(email, password);

        if (res && res.token) {
            const role = res?.role || res?.user?.role || '';
            const redirectPath = role.toLowerCase() === 'admin'
                ? '/admin/profile'
                : role.toLowerCase() === 'user'
                    ? '/user/profile'
                    : res.redirectURI || '/';

            dispatch({
                type: 'LOGIN',
                payload: {
                    user: {
                        email,
                        name: res?.name || '',
                        role,
                    },
                },
            });

            notification.success({
                message: "Đăng nhập thành công",
                description: "Bạn đã đăng nhập vào hệ thống.",
                placement: "topRight"
            });

            navigate(redirectPath);
        } else {
            notification.error({
                message: "Đăng nhập thất bại",
                description: res?.message || 'Sai email hoặc mật khẩu',
                placement: "topRight"
            });
        }
    };

    return (
        <div style={styles.container}>
            <style>
                {`
                @keyframes float {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(10deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes floatReverse {
                    0% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(20px) rotate(-10deg); }
                    100% { transform: translateY(0px) rotate(0deg); }
                }
                @keyframes gradientBG {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                .login-btn {
                    transition: all 0.3s ease;
                }
                .login-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4) !important;
                    opacity: 0.95;
                }
                .glass-card {
                    animation: fadeIn 0.6s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .back-link:hover {
                    color: #2563eb !important;
                }
                `}
            </style>
            
            <div style={styles.shape1} />
            <div style={styles.shape2} />
            <div style={styles.shape3} />

            <div style={styles.card} className="glass-card">
                <div style={styles.header}>
                    <Title level={2} style={{ color: '#0f172a', margin: 0, fontWeight: 700 }}>
                        Welcome Back
                    </Title>
                    <Text style={{ color: '#64748b', fontSize: '15px' }}>
                        Please sign in to your account
                    </Text>
                </div>

                <Form
                    name="login_form"
                    onFinish={onFinish}
                    autoComplete="off"
                    layout="vertical"
                    size="large"
                >
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please input your email!' },
                            { type: 'email', message: 'Please enter a valid email!' }
                        ]}
                    >
                        <Input 
                            prefix={<MailOutlined style={{ color: '#94a3b8' }} />} 
                            placeholder="Email address" 
                            style={styles.input}
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password 
                            prefix={<LockOutlined style={{ color: '#94a3b8' }} />} 
                            placeholder="Password" 
                            style={styles.input}
                        />
                    </Form.Item>

                    <div style={{ textAlign: 'right', marginBottom: '24px', marginTop: '-12px' }}>
                        <Link to="/forgot-password" style={{ color: '#2563eb', fontWeight: 500, fontSize: '14px' }}>
                            Forgot password?
                        </Link>
                    </div>

                    <Form.Item>
                        <Button 
                            type="primary" 
                            htmlType="submit" 
                            className="login-btn"
                            style={styles.button}
                        >
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <Divider style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '24px 0' }}>
                    <Text type="secondary" style={{ fontSize: '13px' }}>OR</Text>
                </Divider>

                <div style={{ textAlign: "center", marginBottom: '20px' }}>
                    <Text style={{ color: '#475569', fontSize: '14px' }}>Don't have an account? </Text>
                    <Link to="/register" style={{ color: '#7c3aed', fontWeight: 600, fontSize: '14px' }}>
                        Create one now
                    </Link>
                </div>

                <div style={{ textAlign: "center" }}>
                    <Link to="/" className="back-link" style={{ color: '#64748b', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}>
                        <ArrowLeftOutlined /> Back to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(-45deg, #f8fafc, #e0e7ff, #f3e8ff, #f8fafc)',
        backgroundSize: '400% 400%',
        animation: 'gradientBG 15s ease infinite',
        padding: '20px'
    },
    shape1: {
        position: 'absolute',
        top: '-10%',
        left: '-10%',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, rgba(37,99,235,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(40px)',
        animation: 'float 8s ease-in-out infinite',
    },
    shape2: {
        position: 'absolute',
        bottom: '-15%',
        right: '-5%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, rgba(124,58,237,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(50px)',
        animation: 'floatReverse 10s ease-in-out infinite',
    },
    shape3: {
        position: 'absolute',
        top: '20%',
        right: '15%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0) 70%)',
        borderRadius: '50%',
        filter: 'blur(30px)',
        animation: 'float 7s ease-in-out infinite 1s',
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        padding: '48px 40px',
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5) inset',
        border: '1px solid rgba(255, 255, 255, 0.6)',
        zIndex: 1,
        position: 'relative',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    input: {
        borderRadius: '12px',
        padding: '12px 16px',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid rgba(203, 213, 225, 0.8)',
        fontSize: '15px'
    },
    button: {
        width: '100%',
        height: '50px',
        borderRadius: '12px',
        background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
        border: 'none',
        boxShadow: '0 4px 14px 0 rgba(37, 99, 235, 0.3)',
        fontSize: '16px',
        fontWeight: 600,
    }
};

export default LoginPage;