import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Select, Upload, message, Spin, Card, Row, Col, Avatar, Divider } from 'antd';
import { UploadOutlined, UserOutlined, MailOutlined, PhoneOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { useParams } from 'react-router-dom';
import { updateAdminProfile, fetchUserProfile, clearSuccess, clearError } from '../../redux/profileSlice';
import '../../components/styles/global.css';

const AdminEditProfile = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { userId } = useParams();
    const { profile, loading, error, success } = useSelector(state => state.profile);
    const [imageFile, setImageFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(profile.image || '');
    const isEditingOther = !!userId;

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile && profile.email) {
            form.setFieldsValue({
                email: profile.email,
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                phoneNumber: profile.phoneNumber || '',
                address: profile.address || '',
                gender: profile.gender || '',
                role: profile.role || '',
                positionId: profile.positionId || ''
            });
            setPreviewImage(profile.image || '');
        }
    }, [profile, form]);

    useEffect(() => {
        if (success) {
            message.success('Cập nhật thông tin thành công!');
            dispatch(clearSuccess());
        }
    }, [success, dispatch]);

    useEffect(() => {
        if (error) {
            message.error(error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleImageChange = (info) => {
        if (info.file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
                setImageFile(e.target.result);
            };
            reader.readAsDataURL(info.file);
        }
    };

    const onFinish = (values) => {
        const updateData = {
            ...values,
            image: imageFile || profile.image
        };
        dispatch(updateAdminProfile({ userId: userId || null, profileData: updateData }));
    };

    if (loading && !profile.email) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
    }

    const pageTitle = isEditingOther ? `Chỉnh Sửa Thông Tin Người Dùng: ${profile.firstName || ''} ${profile.lastName || ''}` : 'Chỉnh Sửa Thông Tin Cá Nhân (Admin)';

    return (
        <Card title={pageTitle} style={{ maxWidth: '700px', margin: '30px auto' }}>
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Avatar
                        size={80}
                        icon={<UserOutlined />}
                        src={previewImage}
                    />
                </Col>
            </Row>

            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="Ảnh Đại Diện"
                    name="image"
                >
                    <Upload
                        maxCount={1}
                        onChange={handleImageChange}
                        accept="image/*"
                    >
                        <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
                    </Upload>
                </Form.Item>

                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Vui lòng nhập email' },
                        { type: 'email', message: 'Email không hợp lệ' }
                    ]}
                >
                    <Input
                        prefix={<MailOutlined />}
                        placeholder="Email"
                        disabled={isEditingOther}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Tên"
                            name="firstName"
                            rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Họ"
                            name="lastName"
                            rules={[{ required: true, message: 'Vui lòng nhập họ' }]}
                        >
                            <Input placeholder="Họ" />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    label="Số Điện Thoại"
                    name="phoneNumber"
                    rules={[
                        { pattern: /^[0-9]{10,}$/, message: 'Số điện thoại không hợp lệ' }
                    ]}
                >
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Số điện thoại"
                    />
                </Form.Item>

                <Form.Item
                    label="Địa Chỉ"
                    name="address"
                >
                    <Input
                        prefix={<EnvironmentOutlined />}
                        placeholder="Địa chỉ"
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Giới Tính"
                            name="gender"
                        >
                            <Select placeholder="Chọn giới tính">
                                <Select.Option value="male">Nam</Select.Option>
                                <Select.Option value="female">Nữ</Select.Option>
                                <Select.Option value="other">Khác</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            label="Vị Trí"
                            name="positionId"
                        >
                            <Input placeholder="Vị trí" />
                        </Form.Item>
                    </Col>
                </Row>

                {isEditingOther && (
                    <>
                        <Divider />
                        <Form.Item
                            label="Vai Trò"
                            name="role"
                        >
                            <Select placeholder="Chọn vai trò">
                                <Select.Option value="user">Người Dùng</Select.Option>
                                <Select.Option value="admin">Admin</Select.Option>
                            </Select>
                        </Form.Item>
                    </>
                )}

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loading}
                        block
                    >
                        Cập Nhật Thông Tin
                    </Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default AdminEditProfile;
