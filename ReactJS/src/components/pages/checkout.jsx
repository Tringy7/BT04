import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, Typography, Button, Spin, Result, Row, Col, Divider, Image, Space, Radio, message, Form, Input, Popconfirm } from 'antd';
import { ArrowLeftOutlined, DollarCircleOutlined, WalletOutlined, CheckCircleOutlined, EnvironmentOutlined, PhoneOutlined } from '@ant-design/icons';
import { getOrderById, createOrder } from '../util/api/order.api';
import { getImageUrl } from '../util/helpers';
import axios from '../util/axios.customize';

const { Title, Text } = Typography;

const CheckoutPage = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [form] = Form.useForm();
    
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [submitting, setSubmitting] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        if (orderId && orderId !== 'new') {
            fetchOrderDetails();
        } else if (location.state && location.state.selectedItems) {
            setOrder({
                id: 'Mới',
                items: location.state.selectedItems,
                status: 'new'
            });
            setLoading(false);
        } else {
            setLoading(false);
        }
    }, [orderId, location.state]);

    const fetchOrderDetails = async () => {
        try {
            setLoading(true);
            const res = await getOrderById(orderId);
            const data = res?.data?.data || res?.data;
            if (data) {
                setOrder(data);
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price || 0);
    };

    const handlePaymentMethodChange = (e) => {
        const method = e.target.value;
        setPaymentMethod(method);
        if (method !== 'COD') {
            message.info('Tính năng đang được phát triển 🚧');
        }
    };

    const handleConfirmOrder = async (values) => {
        if (paymentMethod !== 'COD') {
            return message.info('Tính năng đang được phát triển 🚧');
        }
        setSubmitting(true);
        try {
            const payload = {
                paymentMethod: 'COD',
                shippingAddress: values.shippingAddress,
                phoneNumber: values.phoneNumber,
                note: values.note,
                items: order.items.map(item => ({
                    productId: item.productId || item.product?.id,
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            
            if (orderId && orderId !== 'new') {
                await axios.patch(`/api/orders/${orderId}/confirm`, payload);
                message.success('Cập nhật đơn hàng thành công!');
            } else {
                await createOrder(payload);
                message.success('Đặt hàng thành công!');
            }
            navigate('/history');
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi xác nhận đơn hàng');
        } finally {
            setSubmitting(false);
        }
    };

    const cancelOrder = async () => {
        setCancelling(true);
        try {
            // Gọi API hủy đơn hàng (sử dụng PUT hoặc PATCH tùy theo route trong Express của bạn)
            await axios.delete(`/api/orders/${orderId}/cancel`);
            message.success('Huỷ đơn hàng thành công!');
            navigate('/history');
        } catch (error) {
            console.error(error);
            message.error(error?.response?.data?.message || 'Có lỗi xảy ra khi huỷ đơn hàng');
        } finally {
            setCancelling(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <Spin size="large" tip="Đang tải thông tin đơn hàng..." />
            </div>
        );
    }

    if (!order) {
        return (
            <Result
                status="404"
                title="Không tìm thấy đơn hàng"
                subTitle="Xin lỗi, đơn hàng bạn đang tìm kiếm không tồn tại hoặc đã bị xóa."
                extra={<Button type="primary" onClick={() => navigate('/products')}>Tiếp tục mua sắm</Button>}
            />
        );
    }

    // Kiểm tra nếu đơn hàng đã được xác nhận (trạng thái khác NEW hoặc PENDING)
    const isOrderConfirmed = order.status !== 'new' && order.status !== 'PENDING' && order.status !== 'pending';

    if (isOrderConfirmed) {
        return (
            <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
                <Result
                    status="success"
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    title="Đơn hàng đã được xác nhận"
                    subTitle={`Đơn hàng #${order.id} của bạn đã được xác nhận và đang được xử lý.`}
                    extra={[
                        <Button type="primary" key="history" onClick={() => navigate('/history')}>
                            Xem lịch sử đơn hàng
                        </Button>,
                        <Button key="home" onClick={() => navigate('/')}>
                            Về trang chủ
                        </Button>
                    ]}
                />
            </div>
        );
    }

    const orderItems = order.items || order.OrderItems || [];
    const totalPrice = order.totalPrice || orderItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    return (
        <div style={{ padding: '40px 24px', maxWidth: 1200, margin: '0 auto' }}>
            <Button 
                type="link" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ padding: 0, marginBottom: 24, color: '#4b5563' }}
            >
                Quay lại
            </Button>

            <Title level={2} style={{ marginBottom: 32 }}>Thanh toán đơn hàng</Title>

            <Form form={form} layout="vertical" onFinish={handleConfirmOrder}>
                <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    <Card title="Thông tin giao hàng" bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', marginBottom: 24 }}>
                        <Form.Item label="Địa chỉ giao hàng" name="shippingAddress" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ giao hàng!' }]}>
                            <Input prefix={<EnvironmentOutlined />} placeholder="Nhập địa chỉ nhận hàng chi tiết..." size="large" />
                        </Form.Item>
                        
                        <Form.Item label="Số điện thoại" name="phoneNumber" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }, { pattern: /^[0-9]{10,}$/, message: 'Số điện thoại không hợp lệ!' }]}>
                            <Input prefix={<PhoneOutlined />} placeholder="Nhập số điện thoại người nhận" size="large" />
                        </Form.Item>

                        <Form.Item label="Ghi chú đơn hàng" name="note">
                            <Input.TextArea placeholder="Ghi chú về thời gian hoặc địa điểm giao hàng..." rows={3} />
                        </Form.Item>
                    </Card>

                    <Card title={`Sản phẩm trong đơn hàng (#${order.id})`} bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Space direction="vertical" style={{ width: '100%' }} size="large">
                            {orderItems.map((item, idx) => (
                                <Row key={item.id || idx} gutter={16} align="middle">
                                    <Col>
                                        <Image 
                                            src={getImageUrl(item.product?.thumbnail || item.thumbnail || item.image || '')} 
                                            fallback="https://via.placeholder.com/40?text=Item"
                                            preview={false} 
                                            width={40}
                                            height={40}
                                            style={{ borderRadius: 6, objectFit: 'cover', border: '1px solid #f0f0f0' }} 
                                        />
                                    </Col>
                                    <Col flex="auto">
                                        <Text strong style={{ fontSize: 15, display: 'block' }}>{item.product?.name || item.name || 'Sản phẩm'}</Text>
                                        <Text type="secondary">Số lượng: {item.quantity}</Text>
                                    </Col>
                                    <Col>
                                        <Text strong style={{ color: '#1677ff', fontSize: 16 }}>
                                            {formatPrice(item.price)}
                                        </Text>
                                    </Col>
                                </Row>
                            ))}
                        </Space>
                    </Card>
                </Col>

                <Col xs={24} lg={8}>
                    <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', position: 'sticky', top: 24 }}>
                        <Title level={4} style={{ marginBottom: 24 }}>Thông tin thanh toán</Title>
                        
                        <Row justify="space-between" align="middle">
                            <Text type="secondary">Tổng tiền</Text>
                            <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>{formatPrice(totalPrice)}</Title>
                        </Row>

                        <Divider style={{ margin: '24px 0' }} />

                        <Title level={5} style={{ marginBottom: 16 }}>Phương thức thanh toán</Title>
                        <Radio.Group onChange={handlePaymentMethodChange} value={paymentMethod} style={{ width: '100%' }}>
                            <Space direction="vertical" style={{ width: '100%' }} size="middle">
                                <Radio value="COD" style={{ width: '100%', padding: '12px 16px', border: paymentMethod === 'COD' ? '2px solid #1677ff' : '1px solid #d9d9d9', borderRadius: 8, transition: 'all 0.3s' }}>
                                    <Space>
                                        <DollarCircleOutlined style={{ fontSize: 20, color: '#1677ff' }} />
                                        <Text strong>Thanh toán khi nhận hàng (COD)</Text>
                                    </Space>
                                </Radio>
                                <Radio value="E-Wallet" style={{ width: '100%', padding: '12px 16px', border: paymentMethod === 'E-Wallet' ? '2px solid #1677ff' : '1px solid #d9d9d9', borderRadius: 8, transition: 'all 0.3s', opacity: 0.6 }}>
                                    <Space>
                                        <WalletOutlined style={{ fontSize: 20, color: '#888' }} />
                                        <Text style={{ color: '#888' }}>Ví điện tử (MoMo / ZaloPay / VNPay)</Text>
                                    </Space>
                                </Radio>
                            </Space>
                        </Radio.Group>

                        <Button 
                            type="primary" 
                            htmlType="submit"
                            size="large" 
                            block 
                            loading={submitting} 
                            disabled={paymentMethod !== 'COD' || cancelling} 
                            style={{ height: 50, borderRadius: 8, fontSize: 16, fontWeight: 600, marginTop: 24 }}
                        >
                            Đặt hàng
                        </Button>

                        {orderId && orderId !== 'new' ? (
                            <Popconfirm
                                title="Xác nhận huỷ"
                                description="Bạn có chắc chắn muốn huỷ đơn hàng này không?"
                                onConfirm={cancelOrder}
                                okText="Có, huỷ đơn"
                                cancelText="Không"
                            >
                                <Button 
                                    danger
                                    size="large" 
                                    block 
                                    loading={cancelling} 
                                    disabled={submitting} 
                                    style={{ height: 50, borderRadius: 8, fontSize: 16, fontWeight: 600, marginTop: 12 }}
                                >
                                    Huỷ đặt hàng
                                </Button>
                            </Popconfirm>
                        ) : (
                            <Button 
                                size="large" 
                                block 
                                disabled={submitting} 
                                onClick={() => navigate('/cart')}
                                style={{ height: 50, borderRadius: 8, fontSize: 16, fontWeight: 600, marginTop: 12 }}
                            >
                                Huỷ thanh toán
                            </Button>
                        )}
                    </Card>
                </Col>
                </Row>
            </Form>
        </div>
    );
};

export default CheckoutPage;