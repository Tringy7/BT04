import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, Badge, Space, Image, Divider, Empty, Breadcrumb, Tag, Spin, message, Avatar, Tooltip } from 'antd';
import { ShoppingOutlined, EyeOutlined, ReloadOutlined, FileTextOutlined, AppstoreOutlined, SyncOutlined, CheckCircleOutlined, CloseCircleOutlined, CarOutlined, InboxOutlined, CompassOutlined, DollarOutlined, RightOutlined, CreditCardOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { getOrders } from '../util/api/order.api';
import { getImageUrl } from '../util/helpers';

const { Title, Text } = Typography;

const STATUS_CONFIG = {
    'new': { text: 'New Order', color: 'blue', icon: <SyncOutlined spin /> },
    'pending': { text: 'Processing', color: 'gold', icon: <SyncOutlined spin /> },
    'preparing': { text: 'Preparing', color: 'orange', icon: <SyncOutlined spin /> },
    'confirmed': { text: 'Confirmed', color: 'blue', icon: <CheckCircleOutlined /> },
    'delivered': { text: 'Delivered', color: 'green', icon: <CarOutlined /> },
    'cancelled': { text: 'Cancelled', color: 'red', icon: <CloseCircleOutlined /> },
    'cancel_request': { text: 'Cancel Requested', color: 'volcano', icon: <SyncOutlined spin /> },
};

const styles = {
    pageWrapper: { background: '#f5f7fb', minHeight: '100vh', padding: '40px 0', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1440, margin: '0 auto', padding: '0 24px' },
    heroTitle: { fontSize: 40, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' },
    heroSubtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
    card: { borderRadius: 28, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e5e7eb', transition: 'all 0.25s ease', background: '#fff' },
    sidebarCard: { borderRadius: 28, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', position: 'sticky', top: 32, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' },
    menuItem: (active) => ({ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: 12, cursor: 'pointer', background: active ? '#eff6ff' : 'transparent', color: active ? '#1d4ed8' : '#4b5563', fontWeight: active ? 600 : 500, transition: 'all 0.2s ease' }),
    statCard: { background: '#f9fafb', padding: '16px 20px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 16 },
    primaryBtn: { height: 44, borderRadius: 12, fontWeight: 600, background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)', border: 'none', boxShadow: '0 4px 12px rgba(22, 119, 255, 0.2)' },
    outlineBtn: { height: 44, borderRadius: 12, fontWeight: 600, color: '#4b5563', borderColor: '#d1d5db' },
    ghostBtn: { height: 44, borderRadius: 12, fontWeight: 600, color: '#1677ff' },
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
                date: new Date(order.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' }),
                status: order.status,
                totalPrice: order.totalPrice,
                paymentMethod: order.payment?.method || 'COD',
                items: order.items?.map(item => ({
                    id: item.productId,
                    name: item.product?.name || 'Sản phẩm',
                    quantity: item.quantity,
                    image: getImageUrl(item.product?.thumbnail || '') || 'https://via.placeholder.com/60?text=P'
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

    const filteredOrders = filterStatus === 'all' 
        ? orders 
        : filterStatus === 'pending'
            ? orders.filter(order => ['new', 'pending', 'preparing'].includes(order.status))
            : orders.filter(order => order.status === filterStatus);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => ['new', 'pending', 'preparing'].includes(o.status)).length,
        confirmed: orders.filter(o => o.status === 'confirmed').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        cancel_request: orders.filter(o => o.status === 'cancel_request').length,
        totalSpent: orders.filter(o => o.status === 'delivered').reduce((acc, curr) => acc + curr.totalPrice, 0)
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const FilterMenuItem = ({ id, label, icon, count, active, onClick }) => (
        <div style={styles.menuItem(active)} onClick={onClick} className="filter-menu-item">
            <Space>
                {icon}
                <span>{label}</span>
            </Space>
            <Badge count={count} style={{ backgroundColor: active ? '#3b82f6' : '#d1d5db', color: '#fff', boxShadow: 'none' }} />
        </div>
    );

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f7fb' }}><Spin size="large" /></div>;
    }

    return (
        <div style={styles.pageWrapper}>
            <style>{`
                .order-card:hover { transform: translateY(-4px); box-shadow: 0 14px 40px rgba(0,0,0,0.1) !important; }
                .product-img { transition: transform 0.3s ease; }
                .product-img:hover { transform: scale(1.1); }
                .product-name:hover { color: #1677ff !important; }
                .filter-menu-item:hover { background: #f3f4f6; }
                .btn-buy-again:hover { transform: scale(1.02); box-shadow: 0 8px 20px rgba(22, 119, 255, 0.3) !important; }
                .status-badge { box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
                .timeline-step { position: relative; padding-bottom: 24px; }
                .timeline-step:not(:last-child)::before { content: ''; position: absolute; left: 15px; top: 32px; bottom: 0; width: 2px; background: #e5e7eb; }
                .filter-chips::-webkit-scrollbar { display: none; }
            `}</style>

            <div style={styles.container}>
                {/* Hero Section */}
                <Row justify="space-between" align="bottom" style={{ marginBottom: 40 }}>
                    <Col xs={24} md={12}>
                        <Breadcrumb separator={<RightOutlined style={{ fontSize: 10 }}/>} style={{ marginBottom: 16, fontSize: 13, color: '#6b7280' }}>
                            <Breadcrumb.Item href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</Breadcrumb.Item>
                            <Breadcrumb.Item>My Orders</Breadcrumb.Item>
                        </Breadcrumb>
                        <Title style={styles.heroTitle}>My Orders</Title>
                        <Text style={styles.heroSubtitle}>Track, manage and review all your purchases.</Text>
                    </Col>
                    <Col xs={24} md={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: { xs: 24, md: 0 } }}>
                        <div style={styles.statCard}>
                            <div style={{ background: '#e0e7ff', padding: 12, borderRadius: 12, color: '#4f46e5' }}><DollarOutlined style={{ fontSize: 20 }}/></div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>Total Spent</Text>
                                <Text strong style={{ fontSize: 18, color: '#111827' }}>{formatPrice(stats.totalSpent)}</Text>
                            </div>
                        </div>
                        <div style={styles.statCard}>
                            <div style={{ background: '#dcfce7', padding: 12, borderRadius: 12, color: '#16a34a' }}><InboxOutlined style={{ fontSize: 20 }}/></div>
                            <div>
                                <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>Delivered</Text>
                                <Text strong style={{ fontSize: 18, color: '#111827' }}>{stats.delivered} Orders</Text>
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row gutter={[40, 40]}>
                    {/* Left: Orders List */}
                    <Col xs={24} lg={16}>
                        {/* Mobile Filter Chips */}
                        <div className="filter-chips" style={{ display: 'flex', gap: 12, overflowX: 'auto', marginBottom: 24, paddingBottom: 8, padding: '0 4px' }}>
                            <div style={{ display: 'none' /* Will show on mobile via CSS if needed, skipped for simplicity here */ }}></div>
                        </div>

                        {filteredOrders.length === 0 ? (
                            <div style={{ padding: '80px 24px', background: '#fff', borderRadius: 28, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                                <div style={{ padding: 32, background: '#f9fafb', borderRadius: '50%', display: 'inline-block', marginBottom: 24 }}>
                                    <InboxOutlined style={{ fontSize: 64, color: '#9ca3af' }} />
                                </div>
                                <Title level={3} style={{ color: '#111827', marginBottom: 8 }}>No orders yet</Title>
                                <Text type="secondary" style={{ fontSize: 16, display: 'block', marginBottom: 24 }}>Looks like you haven't made any purchases yet.</Text>
                                <Button type="primary" size="large" onClick={() => navigate('/products')} style={{ borderRadius: 999, height: 50, paddingInline: 32, fontWeight: 600, background: '#111827', borderColor: '#111827' }}>
                                    Start Shopping
                                </Button>
                            </div>
                        ) : (
                            <Space direction="vertical" size={24} style={{ width: '100%' }}>
                                {filteredOrders.map(order => {
                                    const statusObj = STATUS_CONFIG[order.status] || { text: order.status, color: 'default', icon: null };
                                    const isPending = ['new', 'pending', 'preparing'].includes(order.status);
                                    
                                    // Custom colors for status tags
                                    const tagBg = statusObj.color === 'blue' ? '#eff6ff' : statusObj.color === 'green' ? '#dcfce7' : statusObj.color === 'gold' ? '#fef3c7' : statusObj.color === 'orange' ? '#ffedd5' : '#fee2e2';
                                    const tagColor = statusObj.color === 'blue' ? '#1d4ed8' : statusObj.color === 'green' ? '#15803d' : statusObj.color === 'gold' ? '#b45309' : statusObj.color === 'orange' ? '#c2410c' : '#b91c1c';

                                    return (
                                        <Card key={order.id} bordered={false} className="order-card" style={styles.card} bodyStyle={{ padding: 32 }}>
                                            {/* Order Header */}
                                            <Row justify="space-between" align="middle" style={{ paddingBottom: 20, borderBottom: '1px solid #f3f4f6', marginBottom: 24 }}>
                                                <Space size="large">
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>Order ID</Text>
                                                        <Text strong style={{ fontSize: 16, color: '#111827' }}>#{String(order.id).substring(0,8).toUpperCase()}</Text>
                                                    </div>
                                                    <div>
                                                        <Text type="secondary" style={{ fontSize: 13, display: 'block' }}>Date Placed</Text>
                                                        <Text strong style={{ fontSize: 16, color: '#111827' }}>{order.date}</Text>
                                                    </div>
                                                </Space>
                                                <div style={{ background: tagBg, color: tagColor, padding: '8px 16px', borderRadius: 999, fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }} className="status-badge">
                                                    {statusObj.icon}
                                                    {statusObj.text}
                                                </div>
                                            </Row>
                                            
                                            {/* Products Preview */}
                                            <div style={{ marginBottom: 32 }}>
                                                {order.items.slice(0, 3).map((item, index) => (
                                                    <Row key={item.id} gutter={20} align="middle" style={{ marginBottom: 16 }}>
                                                        <Col>
                                                            <div style={{ width: 64, height: 64, borderRadius: 12, background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                                                                <Image src={item.image} preview={false} style={{ width: '80%', height: '80%', objectFit: 'contain', mixBlendMode: 'multiply' }} className="product-img" />
                                                            </div>
                                                        </Col>
                                                        <Col flex="auto">
                                                            <Text strong style={{ fontSize: 16, color: '#111827', cursor: 'pointer' }} className="product-name">{item.name}</Text>
                                                            <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>Qty: {item.quantity}</Text>
                                                        </Col>
                                                    </Row>
                                                ))}
                                                {order.items.length > 3 && (
                                                    <div style={{ paddingLeft: 84 }}>
                                                        <Text type="secondary" style={{ fontWeight: 500 }}>+ {order.items.length - 3} more items</Text>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Order Footer / Actions */}
                                            <Row justify="space-between" align="bottom" style={{ background: '#f9fafb', padding: '20px 24px', borderRadius: 20, margin: '0 -8px' }}>
                                                <Col>
                                                    <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 4 }}>Total Amount</Text>
                                                    <Text strong style={{ fontSize: 24, color: '#111827', display: 'block', lineHeight: 1 }}>{formatPrice(order.totalPrice)}</Text>
                                                    <Text type="secondary" style={{ fontSize: 13, marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <CreditCardOutlined /> Paid via {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Online Payment'}
                                                    </Text>
                                                </Col>
                                                <Col>
                                                    <Space size={12}>
                                                        {isPending && (
                                                            <Button type="text" icon={<CompassOutlined />} style={styles.ghostBtn}>
                                                                Track Order
                                                            </Button>
                                                        )}
                                                        <Button icon={<EyeOutlined />} style={styles.outlineBtn}>
                                                            View Details
                                                        </Button>
                                                        <Button type="primary" icon={<ReloadOutlined />} style={styles.primaryBtn} className="btn-buy-again">
                                                            Buy Again
                                                        </Button>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Card>
                                    );
                                })}
                            </Space>
                        )}
                    </Col>

                    {/* Right: Sidebar Filters & Stats */}
                    <Col xs={24} lg={8}>
                        <div style={styles.sidebarCard}>
                            <div style={{ padding: 24, borderBottom: '1px solid #f3f4f6' }}>
                                <Title level={4} style={{ margin: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <AppstoreOutlined style={{ color: '#6b7280' }}/> Filters
                                </Title>
                            </div>
                            
                            <div style={{ padding: 24 }}>
                                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                                    <FilterMenuItem id="all" label="All Orders" icon={<FileTextOutlined />} count={stats.total} active={filterStatus === 'all'} onClick={() => setFilterStatus('all')} />
                                    <FilterMenuItem id="pending" label="Processing" icon={<SyncOutlined />} count={stats.pending} active={filterStatus === 'pending'} onClick={() => setFilterStatus('pending')} />
                                    <FilterMenuItem id="confirmed" label="Confirmed" icon={<CheckCircleOutlined />} count={stats.confirmed} active={filterStatus === 'confirmed'} onClick={() => setFilterStatus('confirmed')} />
                                    <FilterMenuItem id="delivered" label="Delivered" icon={<CarOutlined />} count={stats.delivered} active={filterStatus === 'delivered'} onClick={() => setFilterStatus('delivered')} />
                                    <FilterMenuItem id="cancelled" label="Cancelled" icon={<CloseCircleOutlined />} count={stats.cancelled} active={filterStatus === 'cancelled'} onClick={() => setFilterStatus('cancelled')} />
                                </Space>
                            </div>

                            <div style={{ background: '#f9fafb', padding: 24, borderTop: '1px solid #f3f4f6', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
                                <Title level={5} style={{ marginTop: 0, marginBottom: 16, color: '#4b5563' }}>Recent Activity</Title>
                                {orders.length > 0 ? (
                                    <div style={{ fontSize: 14 }}>
                                        <div className="timeline-step">
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dcfce7', color: '#15803d', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}><CheckCircleOutlined /></div>
                                                <div>
                                                    <Text strong style={{ display: 'block', color: '#111827' }}>Order Delivered</Text>
                                                    <Text type="secondary" style={{ fontSize: 13 }}>Your order #{String(orders[0].id).substring(0,6).toUpperCase()} has been delivered successfully.</Text>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="timeline-step" style={{ paddingBottom: 0 }}>
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1 }}><DollarOutlined /></div>
                                                <div>
                                                    <Text strong style={{ display: 'block', color: '#111827' }}>Payment Confirmed</Text>
                                                    <Text type="secondary" style={{ fontSize: 13 }}>Payment for order #{String(orders[0].id).substring(0,6).toUpperCase()} was successful.</Text>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Text type="secondary">No recent activity.</Text>
                                )}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default OrderHistoryPage;