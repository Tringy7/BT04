import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, InputNumber, Divider, Image, Space, message, Popconfirm, Checkbox, Spin } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowLeftOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteCartItem, updateCartItem } from '../util/api/cart.api';
import { getImageUrl } from '../util/helpers';

const { Title, Text, Paragraph } = Typography;

const CartPage = () => {
    const navigate = useNavigate();
    
    const [cartItems, setCartItems] = useState([]);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCartData();
    }, []);

    const fetchCartData = async () => {
        setLoading(true);
        try {
            const res = await getCart();
            const data = res?.data?.data || res?.data || res;
            const items = data?.items || [];

            const formattedItems = items.map(item => ({
                id: item.id,
                productId: item.productId,
                name: item.product?.name || 'Sản phẩm',
                price: item.product?.price || item.price || 0,
                quantity: item.quantity || 1,
               
                image:
                    getImageUrl(item.product?.thumbnail || '') ||
                    'https://via.placeholder.com/200?text=Product'
                
            }));
            
            setCartItems(formattedItems);
            setSelectedRowKeys(formattedItems.map(item => item.id));
        } catch (error) {
            console.error(error);
            message.error('Lỗi khi tải dữ liệu giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleQuantityChange = async (id, value) => {
        if (value < 1) return;
        
        // Optimistic update
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: value } : item));
        
        try {
            // Gọi đúng signature: updateCartItem(cartItemId, quantity)
            await updateCartItem(id, value);
        } catch (error) {
            message.error('Lỗi khi cập nhật số lượng');
            fetchCartData(); // rollback
        }
    };

    const handleRemoveItem = async (id) => {
        try {
            await deleteCartItem(id);
            setCartItems(prev => prev.filter(item => item.id !== id));
            setSelectedRowKeys(prev => prev.filter(key => key !== id));
            message.success('Đã xóa sản phẩm khỏi giỏ hàng');
        } catch (error) {
            message.error('Lỗi khi xóa sản phẩm');
        }
    };

    const handleSelect = (id, checked) => {
        if (checked) {
            setSelectedRowKeys(prev => [...prev, id]);
        } else {
            setSelectedRowKeys(prev => prev.filter(key => key !== id));
        }
    };

    const handleSelectAll = (e) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedRowKeys(cartItems.map(item => item.id));
        } else {
            setSelectedRowKeys([]);
        }
    };

    const selectedItems = cartItems.filter(item => selectedRowKeys.includes(item.id));
    const subtotal = selectedItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 50000 : 0;
    const discount = subtotal > 50000000 ? 500000 : 0;
    const total = subtotal + shipping - discount;

    const handleCheckout = () => {
        if (selectedRowKeys.length === 0) {
            return message.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
        }
        message.success('Đang chuyển đến trang thanh toán...');
        // navigate('/checkout');
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ padding: '60px 24px', maxWidth: 1440, margin: '0 auto', textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ padding: 40, background: '#f5f5f5', borderRadius: '50%', marginBottom: 32 }}>
                    <ShoppingCartOutlined style={{ fontSize: 80, color: '#bfbfbf' }} />
                </div>
                <Title level={3} style={{ marginBottom: 16 }}>Giỏ hàng của bạn đang trống</Title>
                <Paragraph type="secondary" style={{ marginBottom: 32, fontSize: 16 }}>
                    Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. <br/> Khám phá các sản phẩm và deal hot ngay nhé!
                </Paragraph>
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate('/products')}
                    style={{ borderRadius: 999, height: 50, paddingInline: 32, fontWeight: 600 }}
                >
                    Tiếp tục mua sắm
                </Button>
            </div>
        );
    }

    return (
        <div style={{ padding: '28px 24px 70px', maxWidth: 1440, margin: '0 auto' }}>
            <Button 
                type="link" 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ padding: 0, marginBottom: 24, color: '#4b5563' }}
            >
                Quay lại
            </Button>
            
            <Title level={2} style={{ marginBottom: 32 }}>Giỏ hàng của bạn</Title>

            <Row gutter={[32, 32]}>
                <Col xs={24} lg={16}>
                    <div style={{ marginBottom: 16, paddingLeft: 8 }}>
                        <Checkbox 
                            checked={cartItems.length > 0 && selectedRowKeys.length === cartItems.length}
                            indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < cartItems.length}
                            onChange={handleSelectAll}
                        >
                            <Text strong>Chọn tất cả ({cartItems.length} sản phẩm)</Text>
                        </Checkbox>
                    </div>
                    
                    <Space direction="vertical" size="large" style={{ width: '100%' }}>
                        {cartItems.map(item => (
                            <Card 
                                key={item.id} 
                                bordered={false}
                                style={{ 
                                    borderRadius: 24, 
                                    boxShadow: '0 6px 22px rgba(0,0,0,0.04)',
                                    overflow: 'hidden'
                                }}
                                bodyStyle={{ padding: 24 }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                    <Checkbox 
                                        checked={selectedRowKeys.includes(item.id)}
                                        onChange={(e) => handleSelect(item.id, e.target.checked)}
                                    />
                                    
                                    <div style={{ flex: 1 }}>
                                        <Row gutter={[24, 24]} align="middle">
                                            <Col xs={24} sm={6} md={5}>
                                                <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f5f5f5', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Image 
                                                        src={item.image} 
                                                        alt={item.name}
                                                        preview={false}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        fallback="https://via.placeholder.com/200?text=Product"
                                                    />
                                                </div>
                                            </Col>
                                            <Col xs={24} sm={18} md={19}>
                                                <Row justify="space-between" align="top">
                                                    <Col xs={24} md={14}>
                                                        <Title level={5} style={{ margin: '0 0 8px 0', cursor: 'pointer' }} onClick={() => navigate(`/product/${item.productId}`)}>
                                                            {item.name}
                                                        </Title>
                                                        <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                                                            Đơn giá: {formatPrice(item.price)}
                                                        </Text>
                                                    </Col>
                                                    <Col xs={24} md={10} style={{ textAlign: 'right' }}>
                                                        <Text strong style={{ fontSize: 20, color: '#1677ff', display: 'block', marginBottom: 16 }}>
                                                            {formatPrice(item.price * item.quantity)}
                                                        </Text>
                                                    </Col>
                                                </Row>
                                                
                                                <Row justify="space-between" align="middle">
                                                    <Col>
                                                        <Space align="center" size="middle">
                                                            <Text strong>Số lượng:</Text>
                                                            <InputNumber 
                                                                min={1} 
                                                                value={item.quantity} 
                                                                onChange={(val) => handleQuantityChange(item.id, val)}
                                                                size="large"
                                                                style={{ borderRadius: 8, width: 100 }}
                                                            />
                                                        </Space>
                                                    </Col>
                                                    <Col>
                                                        <Popconfirm
                                                            title="Xóa sản phẩm"
                                                            description="Bạn có chắc chắn muốn xóa sản phẩm này?"
                                                            onConfirm={() => handleRemoveItem(item.id)}
                                                            okText="Xóa"
                                                            cancelText="Hủy"
                                                            okButtonProps={{ danger: true }}
                                                        >
                                                            <Button type="text" danger icon={<DeleteOutlined />}>
                                                                Xóa
                                                            </Button>
                                                        </Popconfirm>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </Space>
                </Col>

                <Col xs={24} lg={8}>
                    <Card 
                        bordered={false}
                        style={{ 
                            borderRadius: 24, 
                            boxShadow: '0 12px 35px rgba(0,0,0,0.08)',
                            position: 'sticky',
                            top: 24
                        }}
                    >
                        <Title level={4} style={{ marginBottom: 24 }}>Tổng quan đơn hàng</Title>
                        
                        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                            <Row justify="space-between">
                                <Text type="secondary">Tạm tính ({selectedRowKeys.length} sản phẩm)</Text>
                                <Text strong>{formatPrice(subtotal)}</Text>
                            </Row>
                            
                            <Row justify="space-between">
                                <Text type="secondary">Phí vận chuyển</Text>
                                <Text strong>{formatPrice(shipping)}</Text>
                            </Row>

                            {discount > 0 && (
                                <Row justify="space-between">
                                    <Text type="success">Giảm giá</Text>
                                    <Text type="success">-{formatPrice(discount)}</Text>
                                </Row>
                            )}

                            <Divider style={{ margin: '12px 0' }} />

                            <Row justify="space-between" align="middle">
                                <Text strong style={{ fontSize: 16 }}>Tổng cộng</Text>
                                <Title level={3} style={{ color: '#ff4d4f', margin: 0 }}>
                                    {formatPrice(total)}
                                </Title>
                            </Row>
                            <Text type="secondary" style={{ fontSize: 12, textAlign: 'right', display: 'block' }}>
                                (Đã bao gồm VAT nếu có)
                            </Text>

                            <Button 
                                type="primary" 
                                size="large" 
                                block 
                                onClick={handleCheckout}
                                style={{ 
                                    height: 50, 
                                    borderRadius: 999, 
                                    fontSize: 16, 
                                    fontWeight: 600,
                                    marginTop: 16 
                                }}
                            >
                                Tiến hành thanh toán
                            </Button>

                            <Button 
                                type="default" 
                                size="large" 
                                block 
                                onClick={() => navigate('/products')}
                                style={{ 
                                    height: 50, 
                                    borderRadius: 999, 
                                    fontWeight: 500
                                }}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        </Space>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CartPage;