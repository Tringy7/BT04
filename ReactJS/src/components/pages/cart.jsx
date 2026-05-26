import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Typography, Button, InputNumber, Divider, Image, Space, message, Popconfirm, Checkbox, Spin, Breadcrumb, Tag, Input } from 'antd';
import { DeleteOutlined, ShoppingOutlined, ArrowLeftOutlined, ShoppingCartOutlined, HeartOutlined, RightOutlined, CreditCardOutlined, SafetyCertificateOutlined, SyncOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getCart, deleteCartItem, updateCartItem } from '../util/api/cart.api';
import { getImageUrl } from '../util/helpers';

const { Title, Text, Paragraph } = Typography;

const styles = {
    pageWrapper: { background: '#f5f7fb', minHeight: '100vh', padding: '40px 0', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1440, margin: '0 auto', padding: '0 24px' },
    headerCard: { background: 'transparent', marginBottom: 32 },
    headerTitle: { fontSize: 40, fontWeight: 800, color: '#111827', margin: 0, letterSpacing: '-0.02em' },
    headerSubtitle: { fontSize: 16, color: '#6b7280', marginTop: 8 },
    selectBar: { background: '#fff', borderRadius: 18, padding: '16px 24px', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    cartCard: { borderRadius: 28, boxShadow: '0 10px 30px rgba(0,0,0,0.06)', overflow: 'hidden', border: '1px solid #e5e7eb', transition: 'all 0.25s ease' },
    imageContainer: { background: '#f9fafb', borderRadius: 20, overflow: 'hidden', aspectRatio: '1/1', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    productName: { fontSize: 18, fontWeight: 700, color: '#111827', margin: '0 0 8px 0', transition: 'color 0.2s ease', cursor: 'pointer' },
    summaryCard: { borderRadius: 32, boxShadow: '0 10px 40px rgba(0,0,0,0.08)', position: 'sticky', top: 32, background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' },
    checkoutBtn: { height: 58, borderRadius: 29, fontSize: 18, fontWeight: 700, background: 'linear-gradient(135deg, #1677ff 0%, #0958d9 100%)', border: 'none', boxShadow: '0 8px 20px rgba(22, 119, 255, 0.3)' },
    iconSection: { display: 'flex', alignItems: 'center', gap: 8, color: '#6b7280', fontSize: 13, marginTop: 16 }
};

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
                image: getImageUrl(item.product?.thumbnail || '') || 'https://via.placeholder.com/200?text=Product',
                brand: item.product?.brand?.name || 'Apple',
                category: item.product?.category?.name || 'Electronics',
                inStock: item.product?.stock > 0 || true
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
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity: value } : item));
        try {
            await updateCartItem(id, value);
        } catch (error) {
            message.error('Lỗi khi cập nhật số lượng');
            fetchCartData(); 
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

    const handleCheckoutClick = async () => {
        if (selectedRowKeys.length === 0) {
            return message.warning('Vui lòng chọn ít nhất 1 sản phẩm để thanh toán!');
        }
        const selectedItemsData = cartItems.filter(item => selectedRowKeys.includes(item.id));
        navigate('/checkout/new', { state: { selectedItems: selectedItemsData } });
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f7fb' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{ padding: '100px 24px', maxWidth: 1440, margin: '0 auto', textAlign: 'center', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f5f7fb' }}>
                <div style={{ padding: 40, background: '#fff', borderRadius: '50%', marginBottom: 32, boxShadow: '0 20px 40px rgba(0,0,0,0.05)' }}>
                    <ShoppingCartOutlined style={{ fontSize: 80, color: '#1677ff' }} />
                </div>
                <Title level={2} style={{ marginBottom: 16, fontWeight: 700, color: '#111827' }}>Your cart is empty</Title>
                <Paragraph type="secondary" style={{ marginBottom: 40, fontSize: 18, color: '#6b7280', maxWidth: 400 }}>
                    Looks like you haven't added anything yet. Explore our top products and find something you love.
                </Paragraph>
                <Button 
                    type="primary" 
                    size="large" 
                    onClick={() => navigate('/products')}
                    style={{ borderRadius: 999, height: 56, paddingInline: 40, fontWeight: 600, fontSize: 16, background: '#111827', borderColor: '#111827' }}
                >
                    Start Shopping
                </Button>
            </div>
        );
    }

    return (
        <div style={styles.pageWrapper}>
            <style>{`
                .cart-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 14px 40px rgba(0,0,0,0.10) !important;
                }
                .cart-image-wrapper img {
                    transition: transform 0.4s ease;
                }
                .cart-card:hover .cart-image-wrapper img {
                    transform: scale(1.05);
                }
                .product-name:hover {
                    color: #1677ff !important;
                }
                .checkout-btn:hover {
                    transform: scale(1.02);
                    box-shadow: 0 12px 24px rgba(22, 119, 255, 0.4) !important;
                }
                .qty-input .ant-input-number-input {
                    text-align: center;
                    font-weight: 600;
                }
                .action-btn {
                    transition: all 0.2s ease;
                }
                .action-btn:hover {
                    background: #fee2e2 !important;
                    color: #ef4444 !important;
                }
            `}</style>

            <div style={styles.container}>
                {/* Header Section */}
                <div style={styles.headerCard}>
                    <Row justify="space-between" align="bottom">
                        <Col>
                            <Space direction="vertical" size={0}>
                                <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)} style={{ padding: 0, color: '#6b7280', marginBottom: 16, fontWeight: 500 }}>
                                    Back to shopping
                                </Button>
                                <Breadcrumb separator={<RightOutlined style={{ fontSize: 10 }}/>} style={{ marginBottom: 12, fontSize: 13, color: '#6b7280' }}>
                                    <Breadcrumb.Item href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</Breadcrumb.Item>
                                    <Breadcrumb.Item>Shopping Cart</Breadcrumb.Item>
                                </Breadcrumb>
                                <Title style={styles.headerTitle}>Shopping Cart</Title>
                                <Text style={styles.headerSubtitle}>Review your selected products before checkout.</Text>
                            </Space>
                        </Col>
                        <Col style={{ textAlign: 'right', display: { xs: 'none', md: 'block' } }}>
                            <div style={{ background: '#fff', padding: '16px 24px', borderRadius: 20, boxShadow: '0 8px 24px rgba(0,0,0,0.03)' }}>
                                <Text strong style={{ fontSize: 18, color: '#111827', display: 'block' }}>{selectedRowKeys.length} items selected</Text>
                                <Text type="secondary" style={{ fontSize: 14 }}>Estimated delivery: 2-4 days</Text>
                            </div>
                        </Col>
                    </Row>
                </div>

                <Row gutter={[40, 40]}>
                    {/* Left Section: Cart Items */}
                    <Col xs={24} lg={16}>
                        {/* Select All Bar */}
                        <div style={styles.selectBar}>
                            <Checkbox 
                                checked={cartItems.length > 0 && selectedRowKeys.length === cartItems.length}
                                indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < cartItems.length}
                                onChange={handleSelectAll}
                                style={{ fontSize: 16, fontWeight: 600, color: '#111827' }}
                            >
                                Select all items ({cartItems.length})
                            </Checkbox>
                            <Button type="text" danger onClick={() => message.info('Tính năng xóa nhiều sản phẩm đang phát triển')} style={{ fontWeight: 500 }}>
                                Remove selected
                            </Button>
                        </div>

                        {/* Items List */}
                        <Space direction="vertical" size={24} style={{ width: '100%' }}>
                            {cartItems.map(item => (
                                <Card 
                                    key={item.id} 
                                    bordered={false}
                                    className="cart-card"
                                    style={styles.cartCard}
                                    bodyStyle={{ padding: 32 }}
                                >
                                    <Row gutter={24} align="top">
                                        <Col>
                                            <Checkbox 
                                                checked={selectedRowKeys.includes(item.id)}
                                                onChange={(e) => handleSelect(item.id, e.target.checked)}
                                                style={{ marginTop: 40 }}
                                            />
                                        </Col>
                                        
                                        <Col xs={24} sm={6}>
                                            <div style={styles.imageContainer} className="cart-image-wrapper">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    preview={false}
                                                    style={{ width: '90%', height: '90%', objectFit: 'contain', mixBlendMode: 'multiply' }}
                                                    fallback="https://via.placeholder.com/200?text=Product"
                                                />
                                            </div>
                                        </Col>

                                        <Col xs={24} sm={16} style={{ flex: 1 }}>
                                            <Row justify="space-between" align="top">
                                                <Col span={16}>
                                                    <div style={{ marginBottom: 8 }}>
                                                        <Tag color="blue" style={{ borderRadius: 6, border: 'none', background: '#eff6ff', color: '#1d4ed8' }}>{item.brand}</Tag>
                                                        <Tag style={{ borderRadius: 6, border: 'none', background: '#f3f4f6', color: '#4b5563' }}>{item.category}</Tag>
                                                    </div>
                                                    <Title level={4} style={styles.productName} className="product-name" onClick={() => navigate(`/product/${item.productId}`)}>
                                                        {item.name}
                                                    </Title>
                                                    <Text style={{ color: '#6b7280', fontSize: 15, display: 'block', marginBottom: 4 }}>
                                                        SKU: PRD-{String(item.productId).substring(0,6).toUpperCase()}
                                                    </Text>
                                                    <Text style={{ color: item.inStock ? '#059669' : '#dc2626', fontSize: 14, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                                                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: item.inStock ? '#059669' : '#dc2626' }}></div>
                                                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                                                    </Text>
                                                </Col>
                                                <Col span={8} style={{ textAlign: 'right' }}>
                                                    <Text strong style={{ fontSize: 24, color: '#111827', display: 'block', lineHeight: 1.2 }}>
                                                        {formatPrice(item.price * item.quantity)}
                                                    </Text>
                                                    <Text type="secondary" style={{ fontSize: 14 }}>
                                                        {formatPrice(item.price)} / item
                                                    </Text>
                                                </Col>
                                            </Row>
                                            
                                            <Divider style={{ margin: '20px 0' }} />

                                            <Row justify="space-between" align="middle">
                                                <Col>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#f3f4f6', padding: '4px', borderRadius: 12 }}>
                                                        <Button type="text" onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1} style={{ borderRadius: 8, width: 32, height: 32, padding: 0, background: '#fff' }}>-</Button>
                                                        <Text strong style={{ width: 24, textAlign: 'center', fontSize: 16 }}>{item.quantity}</Text>
                                                        <Button type="text" onClick={() => handleQuantityChange(item.id, item.quantity + 1)} style={{ borderRadius: 8, width: 32, height: 32, padding: 0, background: '#fff' }}>+</Button>
                                                    </div>
                                                </Col>
                                                <Col>
                                                    <Space size={8}>
                                                        <Button type="text" icon={<HeartOutlined />} style={{ color: '#6b7280', borderRadius: 10 }}>
                                                            Save
                                                        </Button>
                                                        <Popconfirm
                                                            title="Remove item"
                                                            description="Are you sure you want to remove this item?"
                                                            onConfirm={() => handleRemoveItem(item.id)}
                                                            okText="Remove"
                                                            cancelText="Cancel"
                                                            okButtonProps={{ danger: true, style: { borderRadius: 8 } }}
                                                            cancelButtonProps={{ style: { borderRadius: 8 } }}
                                                        >
                                                            <Button type="text" className="action-btn" icon={<DeleteOutlined />} style={{ color: '#6b7280', borderRadius: 10 }}>
                                                                Remove
                                                            </Button>
                                                        </Popconfirm>
                                                    </Space>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card>
                            ))}
                        </Space>
                    </Col>

                    {/* Right Section: Order Summary */}
                    <Col xs={24} lg={8}>
                        <Card bordered={false} style={styles.summaryCard} bodyStyle={{ padding: 32 }}>
                            <Title level={3} style={{ marginBottom: 32, fontWeight: 700, color: '#111827' }}>Order Summary</Title>
                            
                            <Space direction="vertical" size={20} style={{ width: '100%' }}>
                                <Row justify="space-between">
                                    <Text style={{ color: '#6b7280', fontSize: 16 }}>Subtotal ({selectedRowKeys.length} items)</Text>
                                    <Text strong style={{ fontSize: 16, color: '#111827' }}>{formatPrice(subtotal)}</Text>
                                </Row>
                                
                                <Row justify="space-between">
                                    <Text style={{ color: '#6b7280', fontSize: 16 }}>Shipping</Text>
                                    <Text strong style={{ fontSize: 16, color: '#111827' }}>{shipping === 0 ? 'Calculated at checkout' : formatPrice(shipping)}</Text>
                                </Row>

                                {discount > 0 && (
                                    <Row justify="space-between">
                                        <Text style={{ color: '#059669', fontSize: 16 }}>Discount</Text>
                                        <Text strong style={{ color: '#059669', fontSize: 16 }}>-{formatPrice(discount)}</Text>
                                    </Row>
                                )}

                                <div style={{ marginTop: 8 }}>
                                    <Space.Compact style={{ width: '100%' }}>
                                        <Input placeholder="Discount code" size="large" style={{ borderRadius: '12px 0 0 12px', background: '#f9fafb', border: '1px solid #e5e7eb' }} />
                                        <Button type="primary" size="large" style={{ borderRadius: '0 12px 12px 0', background: '#111827', borderColor: '#111827', fontWeight: 600 }}>Apply</Button>
                                    </Space.Compact>
                                </div>

                                <Divider style={{ margin: '16px 0' }} />

                                <Row justify="space-between" align="bottom">
                                    <Text style={{ fontSize: 18, color: '#111827', fontWeight: 600 }}>Total</Text>
                                    <div style={{ textAlign: 'right' }}>
                                        <Title level={2} style={{ color: '#ff4d4f', margin: 0, fontWeight: 800 }}>
                                            {formatPrice(total)}
                                        </Title>
                                        <Text style={{ color: '#6b7280', fontSize: 13 }}>Including VAT</Text>
                                    </div>
                                </Row>

                                <div style={{ marginTop: 24 }}>
                                    <Button 
                                        type="primary" 
                                        block 
                                        className="checkout-btn"
                                        style={styles.checkoutBtn}
                                        onClick={handleCheckoutClick}
                                    >
                                        Proceed to Checkout
                                    </Button>
                                    
                                    <Button 
                                        type="default" 
                                        block 
                                        onClick={() => navigate('/products')}
                                        style={{ height: 50, borderRadius: 25, fontWeight: 600, marginTop: 16, color: '#4b5563', borderColor: '#d1d5db' }}
                                    >
                                        Continue Shopping
                                    </Button>
                                </div>

                                <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 16 }}>
                                    <div style={styles.iconSection}>
                                        <SafetyCertificateOutlined style={{ fontSize: 18, color: '#10b981' }} />
                                        <Text style={{ color: '#4b5563' }}>Secure SSL Checkout</Text>
                                    </div>
                                    <div style={styles.iconSection}>
                                        <SyncOutlined style={{ fontSize: 18, color: '#3b82f6' }} />
                                        <Text style={{ color: '#4b5563' }}>Free Returns within 30 Days</Text>
                                    </div>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default CartPage;