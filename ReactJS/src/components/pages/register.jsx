import React, { useState } from 'react';
import RegisterStep1 from './register-step1';
import RegisterStep2 from './register-step2';
import { Steps, Typography } from 'antd';
import { UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const RegisterPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');

    const handleStep1Next = (userEmail) => {
        setEmail(userEmail);
        setStep(2);
    };

    const handleStep2Back = () => {
        setStep(1);
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
                .register-btn {
                    transition: all 0.3s ease;
                }
                .register-btn:hover {
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
                .ant-steps-item-title {
                    color: #475569 !important;
                }
                .ant-steps-item-active .ant-steps-item-title {
                    color: #0f172a !important;
                    font-weight: 600;
                }
                `}
            </style>
            
            <div style={styles.shape1} />
            <div style={styles.shape2} />
            <div style={styles.shape3} />

            <div style={styles.card} className="glass-card">
                <div style={styles.header}>
                    <Title level={2} style={{ color: '#0f172a', margin: 0, fontWeight: 700 }}>
                        Create Account
                    </Title>
                    <Text style={{ color: '#64748b', fontSize: '15px' }}>
                        {step === 1 ? 'Join us and start your journey' : 'Verify your email to continue'}
                    </Text>
                </div>

                <Steps
                    current={step - 1}
                    items={[
                        {
                            title: 'Registration',
                            icon: <UserOutlined />,
                        },
                        {
                            title: 'Verification',
                            icon: <SafetyCertificateOutlined />,
                        },
                    ]}
                    style={{ marginBottom: '32px' }}
                />

                {step === 1 ? (
                    <RegisterStep1 onNext={handleStep1Next} email={email} />
                ) : (
                    <RegisterStep2 email={email} onBack={handleStep2Back} />
                )}
            </div>
        </div>
    );
};

export const styles = {
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
        maxWidth: '480px',
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
        marginBottom: '32px',
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

export default RegisterPage;