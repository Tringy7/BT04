import React, { useEffect, useState } from 'react';
import { Button, Form, Input, notification, Spin, Typography, Divider } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    requestForgotPassword,
    resetPassword,
    resendForgotOtp,
    resetForgotPasswordState,
} from '../../redux/forgotPasswordSlice';

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [emailForm] = Form.useForm();
    const [resetForm] = Form.useForm();
    const [timer, setTimer] = useState(0);

    const { step, email, tempToken, loading, resendLoading } = useSelector(
        (state) => state.forgotPassword
    );

    useEffect(() => {
        if (step === 2) {
            setTimer(300);
        }
    }, [step]);

    useEffect(() => {
        if (step !== 2 || timer <= 0) return;
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [step, timer]);

    useEffect(() => {
        return () => {
            dispatch(resetForgotPasswordState());
        };
    }, [dispatch]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleRequestOtp = async (values) => {
        try {
            const result = await dispatch(requestForgotPassword(values.email)).unwrap();
            notification.success({
                message: 'Gửi OTP thành công',
                description: result?.message || 'Vui lòng kiểm tra email của bạn.',
                placement: 'topRight',
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error || 'Không thể gửi OTP, vui lòng thử lại.',
                placement: 'topRight',
            });
        }
    };

    const handleResetPassword = async (values) => {
        try {
            const result = await dispatch(
                resetPassword({
                    email,
                    otp: values.otp,
                    tempToken,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                })
            ).unwrap();

            notification.success({
                message: 'Đặt lại mật khẩu thành công',
                description: result?.message || 'Bạn có thể đăng nhập với mật khẩu mới.',
                placement: 'topRight',
            });

            setTimeout(() => {
                dispatch(resetForgotPasswordState());
                navigate('/login');
            }, 1500);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error || 'Đặt lại mật khẩu thất bại, vui lòng thử lại.',
                placement: 'topRight',
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            const result = await dispatch(resendForgotOtp(email)).unwrap();
            notification.success({
                message: 'Gửi lại OTP thành công',
                description: result?.message || 'Vui lòng kiểm tra email của bạn.',
                placement: 'topRight',
            });
            setTimer(300);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error || 'Gửi lại OTP thất bại, vui lòng thử lại.',
                placement: 'topRight',
            });
        }
    };

    const renderStep1 = () => (
        <Form
            form={emailForm}
            name="forgotPasswordEmail"
            onFinish={handleRequestOtp}
            autoComplete="off"
            layout="vertical"
            size="large"
        >
            <Form.Item
                name="email"
                rules={[
                    { required: true, message: 'Vui lòng nhập email!' },
                    { type: 'email', message: 'Email không hợp lệ!' },
                ]}
            >
                <Input
                    prefix={<MailOutlined style={{ color: '#94a3b8' }} />}
                    placeholder="Email address"
                    style={styles.input}
                />
            </Form.Item>

            <Form.Item style={{ marginTop: '24px' }}>
                <Button
                    type="primary"
                    htmlType="submit"
                    className="auth-btn"
                    style={styles.button}
                    loading={loading}
                >
                    Send OTP
                </Button>
            </Form.Item>
        </Form>
    );

    const renderStep2 = () => (
        <>
            <div style={styles.otpInfoBox}>
                <Text style={{ margin: 0, fontSize: '14px', color: '#1e40af' }}>
                    <MailOutlined style={{ marginRight: '8px' }} /> An OTP has been sent to: <strong>{email}</strong>
                </Text>
            </div>

            <Form
                form={resetForm}
                name="forgotPasswordReset"
                onFinish={handleResetPassword}
                autoComplete="off"
                layout="vertical"
                size="large"
            >
                <Form.Item
                    name="otp"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã OTP!' },
                        { pattern: /^[0-9]{6}$/, message: 'OTP phải gồm 6 chữ số!' },
                    ]}
                >
                    <Input
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        style={{ ...styles.input, fontSize: '20px', letterSpacing: '8px', textAlign: 'center', fontWeight: 600 }}
                    />
                </Form.Item>

                <Form.Item
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                        { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' },
                        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải có chữ hoa, chữ thường và số!' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="New Password"
                        style={styles.input}
                    />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                        placeholder="Confirm New Password"
                        style={styles.input}
                    />
                </Form.Item>

                <Form.Item style={{ marginTop: '24px' }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="auth-btn"
                        style={styles.button}
                        loading={loading}
                    >
                        Reset Password
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Text style={{ fontSize: '14px', color: '#475569' }}>
                    Code expires in: <strong style={{ color: timer < 60 ? '#ef4444' : '#2563eb' }}>{formatTime(timer)}</strong>
                </Text>
            </div>

            <div style={{ textAlign: 'center' }}>
                <Button
                    type="dashed"
                    onClick={handleResendOtp}
                    disabled={timer > 0 || resendLoading}
                    loading={resendLoading}
                    style={{ borderColor: '#cbd5e1' }}
                >
                    {timer > 0 ? `Resend OTP (${formatTime(timer)})` : 'Resend OTP'}
                </Button>
            </div>
        </>
    );

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
                .auth-btn {
                    transition: all 0.3s ease;
                }
                .auth-btn:hover {
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

            <Spin spinning={loading}>
                <div style={styles.card} className="glass-card">
                    <div style={styles.header}>
                        <Title level={2} style={{ color: '#0f172a', margin: 0, fontWeight: 700 }}>
                            Forgot Password
                        </Title>
                        <Text style={{ color: '#64748b', fontSize: '15px' }}>
                            {step === 1
                                ? 'Enter your email to receive a reset code.'
                                : 'Check your email and enter the OTP below.'}
                        </Text>
                    </div>

                    {step === 1 ? renderStep1() : renderStep2()}

                    <Divider style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '24px 0' }} />

                    <div style={{ textAlign: 'center' }}>
                        <Link to="/login" className="back-link" style={{ color: '#64748b', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}>
                            <ArrowLeftOutlined /> Back to Sign In
                        </Link>
                    </div>
                </div>
            </Spin>
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
        maxWidth: '460px',
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
    },
    otpInfoBox: {
        padding: '16px',
        marginBottom: '24px',
        backgroundColor: 'rgba(239, 246, 255, 0.8)',
        borderRadius: '12px',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        textAlign: 'center'
    }
};

export default ForgotPasswordPage;