import React from 'react';
import { Button, Form, Input, notification, Spin, Divider, Typography } from 'antd';
import { ArrowLeftOutlined, MailOutlined, LockOutlined, UserOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { registerApi } from '../util/api/auth.api';
import { styles } from './register';

const { Text } = Typography;

const RegisterStep1 = ({ onNext, email: initialEmail = '' }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = React.useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const { email, password, firstName, lastName, phoneNumber } = values;
            
            const res = await registerApi(
                email,
                password,
                firstName,
                lastName,
                phoneNumber || ''
            );

            if (res && res.success) {
                notification.success({
                    message: "Gửi OTP thành công",
                    description: res.message || "Vui lòng kiểm tra hộp thư của bạn.",
                    placement: "topRight"
                });
                onNext(email);
            } else {
                notification.error({
                    message: "Lỗi",
                    description: res?.message || 'Đăng ký thất bại, vui lòng thử lại.',
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

    return (
        <Spin spinning={loading}>
            <Form
                form={form}
                name="registerStep1"
                onFinish={onFinish}
                autoComplete="off"
                layout='vertical'
                initialValues={{ email: initialEmail }}
                size="large"
            >
                <div style={{ display: 'flex', gap: '16px' }}>
                    <Form.Item
                        name="firstName"
                        style={{ flex: 1 }}
                        rules={[
                            { required: true, message: 'Vui lòng nhập họ!' },
                            { min: 2, message: 'Họ phải ít nhất 2 ký tự!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="First Name" style={styles.input} />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        style={{ flex: 1 }}
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên!' },
                            { min: 2, message: 'Tên phải ít nhất 2 ký tự!' }
                        ]}
                    >
                        <Input prefix={<UserOutlined style={{ color: '#94a3b8' }} />} placeholder="Last Name" style={styles.input} />
                    </Form.Item>
                </div>

                <Form.Item
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không hợp lệ!' }
                    ]}
                >
                    <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="Email address" disabled={!!initialEmail} style={styles.input} />
                </Form.Item>

                <Form.Item
                    name="phoneNumber"
                    rules={[
                        { pattern: /^(0[0-9]{9,10})$/, message: 'Số điện thoại không hợp lệ!' }
                    ]}
                >
                    <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="Phone Number (Optional)" style={styles.input} />
                </Form.Item>

                <Form.Item
                    name="password"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu phải ít nhất 6 ký tự!' },
                        { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Mật khẩu phải có chữ hoa, thường và số!' }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Password" style={styles.input} />
                </Form.Item>

                <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password prefix={<LockOutlined style={{ color: '#94a3b8' }} />} placeholder="Confirm Password" style={styles.input} />
                </Form.Item>

                <Form.Item style={{ marginTop: '24px', marginBottom: '16px' }}>
                    <Button type="primary" htmlType="submit" className="register-btn" style={styles.button}>
                        Continue
                    </Button>
                </Form.Item>
            </Form>

            <Divider style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '16px 0' }}>
                <Text type="secondary" style={{ fontSize: '13px' }}>OR</Text>
            </Divider>

            <div style={{ textAlign: "center", marginBottom: '20px' }}>
                <Text style={{ color: '#475569', fontSize: '14px' }}>Already have an account? </Text>
                <Link to="/login" style={{ color: '#7c3aed', fontWeight: 600, fontSize: '14px' }}>
                    Sign in here
                </Link>
            </div>

            <div style={{ textAlign: "center" }}>
                <Link to="/" className="back-link" style={{ color: '#64748b', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', transition: 'color 0.3s' }}>
                    <ArrowLeftOutlined /> Back to homepage
                </Link>
            </div>
        </Spin>
    );
};

export default RegisterStep1;