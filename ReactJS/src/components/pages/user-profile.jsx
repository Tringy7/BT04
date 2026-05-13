import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Descriptions, Avatar, Spin, Divider } from 'antd';
import { EditOutlined, UserOutlined } from '@ant-design/icons';
import { fetchUserProfile } from '../../redux/profileSlice';
import '../../components/styles/global.css';

const UserProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading } = useSelector(state => state.profile);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleEditClick = () => {
        navigate('/user/edit-profile');
    };

    if (loading && !profile.email) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
    }

    return (
        <Card 
            title="Thông Tin Cá Nhân" 
            style={{ maxWidth: '800px', margin: '30px auto' }}
            extra={
                <Button 
                    type="primary" 
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                >
                    Chỉnh Sửa
                </Button>
            }
        >
            <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                <Col span={24} style={{ textAlign: 'center' }}>
                    <Avatar
                        size={100}
                        icon={<UserOutlined />}
                        src={profile.image}
                    />
                </Col>
            </Row>

            <Divider />

            <Descriptions bordered column={1}>
                <Descriptions.Item label="Email">
                    {profile.email}
                </Descriptions.Item>
                <Descriptions.Item label="Tên">
                    {profile.firstName}
                </Descriptions.Item>
                <Descriptions.Item label="Họ">
                    {profile.lastName}
                </Descriptions.Item>
                <Descriptions.Item label="Số Điện Thoại">
                    {profile.phoneNumber || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Địa Chỉ">
                    {profile.address || 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Giới Tính">
                    {profile.gender ? (
                        profile.gender === 'male' ? 'Nam' : profile.gender === 'female' ? 'Nữ' : 'Khác'
                    ) : 'Chưa cập nhật'}
                </Descriptions.Item>
                <Descriptions.Item label="Vai Trò">
                    {profile.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                </Descriptions.Item>
            </Descriptions>
        </Card>
    );
};

export default UserProfile;
