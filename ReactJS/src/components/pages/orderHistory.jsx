import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Badge, Space, Image, Divider, Menu, Empty, Breadcrumb, Tag, Spin, message } from 'antd';
import { ShoppingOutlined, EyeOutlined, ReloadOutlined, FileTextOutlined, AppstoreOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, CarOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../util/api/order.api';
import { getImageUrl } from '../util/helpers';

const { Title, Text } = Typography;

const STATUS_CONFIG = {
    'new': { text: 'Đơn mới', color: 'blue', icon: <SyncOutlined spin /> },
    'pending': { text: 'Đang xử lý', color: 'gold', icon: <SyncOutlined spin /> },
    'preparing': { text: 'Đang chuẩn bị', color: 'orange', icon: <SyncOutlined spin /> },
    'confirmed': { text: 'Đã xác nhận', color: 'blue', icon: <CheckCircleOutlined /> },
    'delivered': { text: 'Đã giao', color: 'green', icon: <CarOutlined /> },
    'cancelled': { text: 'Đã huỷ', color: 'red', icon: <CloseCircleOutlined /> },
    'cancel_request': { text: 'Yêu cầu huỷ', color: 'volcano', icon: <SyncOutlined spin /> },
};

const OrderHistoryPage = () => {
    const navigate = useNavigate();
    const [filterStatus, setFilterStatus] = useState('all');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const res = await getOrders();
            const data = res?.data?.data || res?.data || res || [];
            
            const formattedOrders = data.map(order => ({
                id: order.id,
                date: new Date(order.createdAt).toLocaleDateString('vi-VN'),
                status: order.status,
                totalPrice: order.totalPrice,
                paymentMethod: order.payment?.method || 'COD',
                items: order.items?.map(item => ({
                    id: item.productId,
                    name: item.product?.name || 'Sản phẩm',
                    quantity: item.quantity,
                    image: getImageUrl(item.product?.thumbnail || '') || 'https://via.placeholder.com/40?text=P'
                })) || []
            }));
            
            setOrders(formattedOrders);
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải lịch sử đơn hàng');
        } finally {
            setLoading(false);
        }
    };

    // Filter Logic
    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : filterStatus === 'pending'
            ? orders.filter(order => ['new', 'pending', 'preparing'].includes(order.status))
            : orders.filter(order => order.status === filterStatus);

    // Stats Logic
    const stats = {
        total: orders.length,
        pending: orders.filter(o => ['new', 'pending', 'preparing'].includes(o.status)).length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        cancel_request: orders.filter(o => o.status === 'cancel_request').length,
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}><Spin size="large" /></div>;
    }

    return (
        <div style={{ padding: '28px 24px 70px', maxWidth: 1200, margin: '0 auto' }}>
            {/* Breadcrumb */ }
            <Breadcrumb style={{ marginBottom: 16 }}>
                <Breadcrumb.Item><Link to="/">Trang chủ</Link></Breadcrumb.Item>
                <Breadcrumb.Item>Đơn hàng của tôi</Breadcrumb.Item>
            </Breadcrumb>

            <Title level={2} style={{ marginBottom: 24 }}>Lịch sử đơn hàng</Title>

            <Row gutter={[32, 24]}>
                {/* --- CỘT TRÁI (70%): DANH SÁCH ĐƠN HÀNG --- */ }
                <Col xs={24} lg={16}>
                    {/* Nút filter cho Mobile hiển thị dạng ngang (chỉ hiện trên màn hình nhỏ) */ }
                    <div className="mobile-filter" style={{ marginBottom: 16, overflowX: 'auto', whiteSpace: 'nowrap' }}>
                        {/* Ẩn bằng CSS, bạn có thể custom thêm className ẩn hiện tuỳ ý */ }
                    </div>

                    {filteredOrders.length === 0 ? (
                        <Card style={{ borderRadius: 16, textAlign: 'center', padding: '40px 0' }}>
                            <Empty 
                                description={<Text type="secondary" style={{ fontSize: 16 }}>Bạn chưa có đơn hàng nào 🛒</Text>} 
                            />
                            <Button type="primary" style={{ marginTop: 16, borderRadius: 8 }} onClick={() => navigate('/products')}>
                                Tiếp tục mua sắm
                            </Button>
                        </Card>
                    ) : (
                        <Space direction="vertical" size="large" style={{ width: '100%' }}>
                            {filteredOrders.map(order => {
                                const statusObj = STATUS_CONFIG[order.status] || { text: order.status, color: 'default', icon: null };
                                return (
                                    <Card 
                                        key={order.id} 
                                        hoverable
                                        style={{ borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                                        bodyStyle={{ padding: 20 }}
                                    >
                                        <Row justify="space-between" align="middle" style={{ paddingBottom: 12, borderBottom: '1px solid #f0f0f0', marginBottom: 12 }}>
                                            <Space>
                                                <Text strong style={{ fontSize: 16 }}>#{order.id}</Text>
                                                <Divider type="vertical" />
                                                <Text type="secondary">{order.date}</Text>
                                            </Space>
                                            <Tag color={statusObj.color} icon={statusObj.icon} style={{ padding: '4px 10px', borderRadius: 12, fontSize: 14 }}>
                                                {statusObj.text}
                                            </Tag>
                                        </Row>
                                        
                                        {/* Danh sách sản phẩm preview */ }
                                        <div style={{ marginBottom: 16 }}>
                                            {order.items.map(item => (
                                                <Row key={item.id} gutter={16} align="middle" style={{ marginBottom: 8 }}>
                                                    <Col>
                                                        <Image src={item.image} width={40} height={40} style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #d9d9d9' }} preview={false} />
                                                    </Col>
                                                    <Col flex="auto">
                                                        <Text strong>{item.name}</Text>
                                                    </Col>
                                                    <Col>
                                                        <Text type="secondary">x{item.quantity}</Text>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </div>

                                        <Row justify="space-between" align="middle">
                                            <Space direction="vertical" size={0}>
                                                <Text type="secondary" style={{ fontSize: 12 }}>Tổng tiền</Text>
                                                <Text strong style={{ fontSize: 18, color: '#ff4d4f' }}>{formatPrice(order.totalPrice)}</Text>
                                                <Text type="secondary" style={{ fontSize: 12 }}>
                                                    {order.paymentMethod === 'COD' ? '💵 COD (Thanh toán khi nhận hàng)' : '🚧 Ví điện tử'}
                                                </Text>
                                            </Space>
                                            <Space>
                                                <Button size="large" style={{ borderRadius: 8 }} icon={<EyeOutlined />}>Xem chi tiết</Button>
                                                <Button size="large" type="primary" style={{ borderRadius: 8 }} icon={<ReloadOutlined />}>Mua lại</Button>
                                            </Space>
                                        </Row>
                                    </Card>
                                );
                            })}
                        </Space>
                    )}
                </Col>

                {/* --- CỘT PHẢI (30%): FILTER VÀ THỐNG KÊ --- */ }
                <Col xs={24} lg={8}>
                    <div style={{ position: 'sticky', top: 24 }}>
                        <Card title={<Space><AppstoreOutlined /> Lọc theo trạng thái</Space>} bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
                            <Menu 
                                mode="vertical" 
                                selectedKeys={[filterStatus]} 
                                onClick={(e) => setFilterStatus(e.key)}
                                style={{ borderRight: 0 }}
                            >
                                <Menu.Item key="all" icon={<FileTextOutlined />}>Tất cả ({stats.total})</Menu.Item>
                                <Menu.Item key="pending" icon={<SyncOutlined />}>Đang xử lý ({stats.pending})</Menu.Item>
                                <Menu.Item key="confirmed" icon={<CheckCircleOutlined />}>Đã xác nhận ({stats.confirmed})</Menu.Item>
                                <Menu.Item key="delivered" icon={<CarOutlined />}>Đã giao ({stats.delivered})</Menu.Item>
                                <Menu.Item key="cancel_request" icon={STATUS_CONFIG['cancel_request']?.icon}>Yêu cầu huỷ ({stats.cancel_request})</Menu.Item>
                                <Menu.Item key="cancelled" icon={<CloseCircleOutlined />}>Đã huỷ ({stats.cancelled})</Menu.Item>
                            </Menu>
                        </Card>

                        <Card title="Thống kê nhanh" bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <Row justify="space-between">
                                    <Text type="secondary">Tổng đơn hàng</Text>
                                    <Text strong>{stats.total}</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary">Đơn đang xử lý</Text>
                                    <Text strong style={{ color: '#faad14' }}>{stats.pending}</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary">Đã xác nhận</Text>
                                    <Text strong style={{ color: '#1677ff' }}>{stats.confirmed}</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary">Đã giao</Text>
                                    <Text strong style={{ color: '#52c41a' }}>{stats.delivered}</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary">Yêu cầu huỷ</Text>
                                    <Text strong style={{ color: '#fa541c' }}>{stats.cancel_request}</Text>
                                </Row>
                                <Row justify="space-between">
                                    <Text type="secondary">Đơn đã huỷ</Text>
                                    <Text strong style={{ color: '#ff4d4f' }}>{stats.cancelled}</Text>
                                </Row>
                            </Space>
                        </Card>
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default OrderHistoryPage;