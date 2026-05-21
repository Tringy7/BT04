import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Row, Col, Descriptions, Avatar, Spin, Divider, Table, Space, Popconfirm, message } from 'antd';
import { EditOutlined, UserOutlined, DeleteOutlined } from '@ant-design/icons';
import { fetchUserProfile } from '../../redux/profileSlice';
import { getAllUsersApi } from '../util/api/user.api';
import '../../components/styles/global.css';

const AdminProfile = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { profile, loading } = useSelector(state => state.profile);
    const [users, setUsers] = useState([]);
    const [usersLoading, setUsersLoading] = useState(false);
    const [usersError, setUsersError] = useState(null);

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    const handleEditOwnProfile = () => {
        navigate('/admin/edit-profile');
    };

    const handleEditUserProfile = (userId) => {
        navigate(`/admin/edit-profile/${userId}`);
    };

    // Load all users from API (if backend provides endpoint)
    useEffect(() => {
        let mounted = true;
        const loadUsers = async () => {
            setUsersLoading(true);
            setUsersError(null);
            try {
                const data = await getAllUsersApi();
                // axios.customize returns data directly via interceptor
                // try common shapes: { users: [...] } or { data: { users: [...] } }
                const usersList = data?.users || data?.data?.users || [];
                if (mounted) setUsers(usersList);
            } catch (err) {
                if (mounted) setUsersError(err?.message || 'Không tải được danh sách người dùng');
            } finally {
                if (mounted) setUsersLoading(false);
            }
        };

        loadUsers();
        return () => { mounted = false; };
    }, []);

    const columns = [
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Tên',
            dataIndex: 'firstName',
            key: 'firstName',
        },
        {
            title: 'Họ',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Số Điện Thoại',
            dataIndex: 'phoneNumber',
            key: 'phoneNumber',
        },
        {
            title: 'Vai Trò',
            dataIndex: 'role',
            key: 'role',
            render: (role) => role === 'admin' ? 'Quản trị viên' : 'Người dùng'
        },
        {
            title: 'Hành Động',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button 
                        type="primary" 
                        size="small"
                        icon={<EditOutlined />}
                        onClick={() => handleEditUserProfile(record.id)}
                    >
                        Sửa
                    </Button>
                    <Popconfirm
                        title="Xóa người dùng"
                        description="Bạn có chắc chắn muốn xóa người dùng này không?"
                        onConfirm={() => {
                            message.success('Xóa thành công');
                        }}
                    >
                        <Button 
                            danger 
                            size="small"
                            icon={<DeleteOutlined />}
                        >
                            Xóa
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    if (loading && !profile.email) {
        return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }} />;
    }

    return (
        <div style={{ padding: '20px' }}>
            {/* Admin Profile Section */}
            <Card 
                title="Thông Tin Cá Nhân (Admin)" 
                style={{ maxWidth: '800px', margin: '30px auto' }}
                extra={
                    <Button 
                        type="primary" 
                        icon={<EditOutlined />}
                        onClick={handleEditOwnProfile}
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
                    <Descriptions.Item label="Vai Trò">
                        Quản trị viên
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {/* Users Management Section */}
            <Card 
                title="Quản Lý Người Dùng" 
                style={{ maxWidth: '1000px', margin: '30px auto' }}
            >
                <Table 
                    columns={columns} 
                    dataSource={users}
                    rowKey="id"
                    loading={usersLoading}
                    pagination={{ pageSize: 10 }}
                    locale={{ emptyText: usersError ? usersError : 'Không có người dùng' }}
                />
            </Card>
        </div>
    );
};

export default AdminProfile;
