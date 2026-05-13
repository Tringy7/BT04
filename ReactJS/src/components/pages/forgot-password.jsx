import React, { useEffect, useState } from 'react';
import { Button, Col, Form, Input, notification, Row, Spin } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    requestForgotPassword,
    resetPassword,
    resendForgotOtp,
    resetForgotPasswordState,
} from '../../redux/forgotPasswordSlice';

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
            });
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error || 'Không thể gửi OTP, vui lòng thử lại.',
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
            });

            setTimeout(() => {
                dispatch(resetForgotPasswordState());
                navigate('/login');
            }, 1500);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error || 'Đặt lại mật khẩu thất bại, vui lòng thử lại.',
            });
        }
    };

    const handleResendOtp = async () => {
        try {
            const result = await dispatch(resendForgotOtp(email)).unwrap();
            notification.success({
                message: 'Gửi lại OTP thành công',
                description: result?.message || 'Vui lòng kiểm tra email của bạn.',
            });
            setTimer(300);
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: error || 'Gửi lại OTP thất bại, vui lòng thử lại.',
            });
        }
    };

    return (
        <Spin spinning={loading}>
            <Row justify={'center'} style={{ marginTop: '30px' }}>
                <Col xs={24} md={16} lg={8}>
                    <fieldset
                        style={{
                            padding: '24px',
                            margin: '5px',
                            border: '1px solid rgba(37, 99, 235, 0.18)',
                            borderRadius: '18px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.08)',
                            backdropFilter: 'blur(10px)',
                        }}
                    >
                        <legend>Quên mật khẩu</legend>

                        {step === 1 && (
                            <Form
                                form={emailForm}
                                name="forgotPasswordEmail"
                                onFinish={handleRequestOtp}
                                autoComplete="off"
                                layout="vertical"
                            >
                                <Form.Item
                                    label="Email"
                                    name="email"
                                    rules={[
                                        { required: true, message: 'Vui lòng nhập email!' },
                                        { type: 'email', message: 'Email không hợp lệ!' },
                                    ]}
                                >
                                    <Input prefix={<MailOutlined />} placeholder="example@email.com" />
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" block>
                                        Gửi OTP
                                    </Button>
                                </Form.Item>
                            </Form>
                        )}

                        {step === 2 && (
                            <>
                                <div
                                    style={{
                                        padding: '16px',
                                        marginBottom: '20px',
                                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                                        borderRadius: '8px',
                                        border: '1px solid rgba(37, 99, 235, 0.3)',
                                    }}
                                >
                                    <p style={{ margin: 0, fontSize: '14px', color: '#0f172a' }}>
                                        <MailOutlined /> Mã OTP đã được gửi tới: <strong>{email}</strong>
                                    </p>
                                </div>

                                <Form
                                    form={resetForm}
                                    name="forgotPasswordReset"
                                    onFinish={handleResetPassword}
                                    autoComplete="off"
                                    layout="vertical"
                                >
                                    <Form.Item
                                        label="Mã OTP"
                                        name="otp"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mã OTP!' },
                                            { pattern: /^[0-9]{6}$/, message: 'OTP phải gồm 6 chữ số!' },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Nhập 6 chữ số"
                                            maxLength="6"
                                            style={{ fontSize: '20px', letterSpacing: '4px', textAlign: 'center' }}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        label="Mật khẩu mới"
                                        name="newPassword"
                                        rules={[
                                            { required: true, message: 'Vui lòng nhập mật khẩu mới!' },
                                            { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' },
                                            {
                                                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                message: 'Mật khẩu phải có chữ hoa, chữ thường và số!',
                                            },
                                        ]}
                                    >
                                        <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
                                    </Form.Item>

                                    <Form.Item
                                        label="Xác nhận mật khẩu"
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
                                        <Input.Password prefix={<LockOutlined />} placeholder="Nhập lại mật khẩu" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button type="primary" htmlType="submit" block>
                                            Đặt lại mật khẩu
                                        </Button>
                                    </Form.Item>
                                </Form>

                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <p style={{ fontSize: '14px', color: '#666' }}>
                                        Mã OTP hết hạn trong:{' '}
                                        <strong style={{ color: timer < 60 ? '#ff4d4f' : '#2563eb' }}>
                                            {formatTime(timer)}
                                        </strong>
                                    </p>
                                </div>

                                <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                                    <Button
                                        type="dashed"
                                        onClick={handleResendOtp}
                                        disabled={timer > 0 || resendLoading}
                                        loading={resendLoading}
                                    >
                                        {timer > 0 ? `Gửi lại OTP (${formatTime(timer)})` : 'Gửi lại OTP'}
                                    </Button>
                                </div>
                            </>
                        )}

                        <Link to={'/login'}>
                            <ArrowLeftOutlined /> Quay lại đăng nhập
                        </Link>
                    </fieldset>
                </Col>
            </Row>
        </Spin>
    );
};

export default ForgotPasswordPage;
