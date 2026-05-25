import React, { useState, useEffect } from 'react';
import { Button, Form, Input, notification, Spin, Typography } from 'antd';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { verifyRegisterOtpApi, resendRegisterOtpApi } from '../util/api/auth.api';
import { styles } from './register';

const { Text } = Typography;

const RegisterStep2 = ({ email, onBack }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(300);
    const navigate = useNavigate();

    useEffect(() => {
        if (timer <= 0) return;
        const interval = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const onFinish = async (values) => {
        const { otp } = values;
        setLoading(true);
        try {
            const res = await verifyRegisterOtpApi(email, otp);
            if (res && res.success) {
                notification.success({
                    message: "Đăng ký thành công",
                    description: res.message || "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
                    placement: "topRight"
                });
                setTimeout(() => navigate('/login'), 1500);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: res?.message || 'OTP không chính xác, vui lòng thử lại.',
                    placement: "topRight"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
                placement: "topRight"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        try {
            const res = await resendRegisterOtpApi(email);
            if (res && res.success) {
                notification.success({
                    message: "Gửi lại OTP thành công",
                    description: res.message || "Vui lòng kiểm tra hộp thư của bạn.",
                    placement: "topRight"
                });
                setTimer(300);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: res?.message || 'Gửi lại OTP thất bại, vui lòng thử lại.',
                    placement: "topRight"
                });
            }
        } catch (error) {
            notification.error({
                message: "Lỗi",
                description: error?.message || 'Có lỗi xảy ra, vui lòng thử lại.',
                placement: "topRight"
            });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <Spin spinning={loading}>
            <div style={{
                padding: "16px",
                marginBottom: "24px",
                backgroundColor: "rgba(239, 246, 255, 0.8)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.3)",
                textAlign: 'center'
            }}>
                <Text style={{ margin: 0, fontSize: "14px", color: "#1e40af" }}>
                    <MailOutlined style={{ marginRight: '8px' }} /> An OTP has been sent to: <strong>{email}</strong>
                </Text>
            </div>

            <Form
                form={form}
                name="registerStep2"
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
                size="large"
            >
                <Form.Item
                    name="otp"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mã OTP!' },
                        { pattern: /^[0-9]{6}$/, message: 'Mã OTP phải gồm 6 chữ số!' }
                    ]}
                >
                    <Input
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        style={{ ...styles.input, fontSize: "20px", letterSpacing: "8px", textAlign: "center", fontWeight: 600 }}
                    />
                </Form.Item>

                <Form.Item style={{ marginTop: '24px', marginBottom: '16px' }}>
                    <Button type="primary" htmlType="submit" className="register-btn" style={styles.button} loading={loading}>
                        Verify & Create Account
                    </Button>
                </Form.Item>
            </Form>

            <div style={{ textAlign: "center", marginBottom: "24px" }}>
                <Text style={{ fontSize: "14px", color: "#475569" }}>
                    Code expires in: <strong style={{ color: timer < 60 ? "#ef4444" : "#2563eb" }}>{formatTime(timer)}</strong>
                </Text>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Button
                    type="link"
                    onClick={onBack}
                    icon={<ArrowLeftOutlined />}
                    style={{ color: '#475569', fontWeight: 500 }}
                >
                    Back
                </Button>
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
        </Spin>
    );
};

export default RegisterStep2;