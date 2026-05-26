import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Row, Col, Card, Typography, Button, Divider, Spin, message, Image, InputNumber, Breadcrumb, Tabs, Tag, Space, Rate
} from 'antd';
import {
    ShoppingCartOutlined,
    HomeOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { getProductDetailApi } from '../util/api/product.api';
import { getImageUrl } from '../util/helpers';
import { addToCart } from '../util/api/cart.api';

const { Title, Text, Paragraph } = Typography;

const styles = {
    pageWrapper: { background: '#f5f7fb', minHeight: '100vh', padding: '32px 0', fontFamily: 'Inter, sans-serif' },
    container: { maxWidth: 1200, margin: '0 auto', padding: '0 24px' },
    mainCard: { borderRadius: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', background: '#fff' },
    galleryBg: { background: '#f5f7fb', borderRadius: 16, padding: 24, marginBottom: 16, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450, overflow: 'hidden' },
    mainImage: { maxHeight: 400, objectFit: 'contain' },
    thumbnailContainer: { display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 12 },
    thumbnail: (active) => ({
        width: 80, height: 80, flexShrink: 0,
        border: active ? '2px solid #1677ff' : '2px solid transparent',
        borderRadius: 12, padding: 4, cursor: 'pointer', background: '#f5f7fb',
        transition: 'all 0.25s ease'
    }),
    priceBox: { background: '#fff1f0', padding: '20px 24px', borderRadius: 12, marginBottom: 24, border: '1px solid #ffccc7' },
    priceText: { color: '#ff4d4f', margin: 0, fontSize: 36, fontWeight: 700, lineHeight: 1 },
    actionButton: { height: 50, borderRadius: 12, fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.25s ease' },
    relatedCard: { borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: '1px solid #f0f0f0' },
    sectionTitle: { marginBottom: 24, fontWeight: 600, fontSize: 24 }
};

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState('');

    useEffect(() => {
        const fetchProductDetail = async () => {
            setLoading(true);
            try {
                const res = await getProductDetailApi(id);
                const productData = res?.data?.product || res?.product || (res?.id ? res : null);

                if (productData) {
                    setProduct(productData);
                    if (productData.images && productData.images.length > 0) {
                        setSelectedImage(productData.images[0].imageUrl);
                    } else if (productData.thumbnail) {
                        setSelectedImage(productData.thumbnail);
                    }
                } else {
                    message.error(res?.message || 'Không tìm thấy thông tin sản phẩm');
                }
            } catch (error) {
                message.error('Lỗi khi tải chi tiết sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f5f7fb' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px', background: '#f5f7fb', minHeight: '100vh' }}>
                <Title level={3}>Sản phẩm không tồn tại</Title>
                <Button type="primary" onClick={() => navigate('/')}>Quay lại trang chủ</Button>
            </div>
        );
    }

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleAddToCart = async () => {
        try {
            const res = await addToCart({ productId: product.id, quantity });
            if (res && (res.success || res.data?.success)) {
                message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
            } else {
                message.error('Thêm vào giỏ hàng thất bại');
            }
        } catch (error) {
            message.error('Lỗi khi thêm vào giỏ hàng. Vui lòng đăng nhập!');
        }
    };

    const handleBuyNow = () => {
        message.success('Chuyển đến trang thanh toán');
    };

    const tabItems = [
        {
            key: '1',
            label: 'Description',
            children: (
                <Paragraph style={{ fontSize: 16, lineHeight: 1.8, color: '#595959', padding: '12px 0' }}>
                    {product.description || 'Sản phẩm này chưa có mô tả chi tiết. Vui lòng liên hệ với chúng tôi để biết thêm thông tin về tính năng, hiệu năng và thiết kế của sản phẩm.'}
                </Paragraph>
            ),
        },
        {
            key: '2',
            label: 'Specifications',
            children: (
                <div style={{ maxWidth: 800, padding: '12px 0' }}>
                    <Row style={{ padding: '16px 24px', background: '#fafafa', borderRadius: '8px 8px 0 0', borderBottom: '1px solid #f0f0f0' }}>
                        <Col span={8}><Text type="secondary" strong>Thương hiệu</Text></Col>
                        <Col span={16}><Text strong>{product.brand?.name || 'N/A'}</Text></Col>
                    </Row>
                    <Row style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0' }}>
                        <Col span={8}><Text type="secondary" strong>Danh mục</Text></Col>
                        <Col span={16}><Text strong>{product.category?.name || 'N/A'}</Text></Col>
                    </Row>
                    <Row style={{ padding: '16px 24px', background: '#fafafa', borderRadius: '0 0 8px 8px' }}>
                        <Col span={8}><Text type="secondary" strong>Kho hàng</Text></Col>
                        <Col span={16}><Text strong>{product.stock || 0}</Text></Col>
                    </Row>
                </div>
            ),
        },
        {
            key: '3',
            label: 'Reviews',
            children: (
                <div style={{ padding: '24px 0', textAlign: 'center' }}>
                    <Text type="secondary">Chưa có đánh giá nào cho sản phẩm này.</Text>
                </div>
            ),
        },
    ];

    // Tạo mock data cho related products (giả lập nếu API chưa có)
    const relatedProducts = Array.from({ length: 4 }).map((_, idx) => ({
        id: `related-${idx}`,
        name: `Sản phẩm tương tự ${idx + 1}`,
        price: product.price ? product.price * (1 + (idx * 0.1)) : 1000000,
        thumbnail: product.thumbnail || product.images?.[0]?.imageUrl
    }));

    return (
        <div style={styles.pageWrapper}>
            <style>{`
                .gallery-main img {
                    transition: transform 0.4s ease;
                }
                .gallery-main:hover img {
                    transform: scale(1.08);
                }
                .thumbnail-item {
                    transition: transform 0.25s ease;
                }
                .thumbnail-item:hover {
                    transform: translateY(-2px);
                }
                .related-card {
                    transition: all 0.3s ease !important;
                }
                .related-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important;
                }
                .btn-buy-now:hover {
                    background: #d9363e !important;
                    border-color: #d9363e !important;
                }
                .thumbnail-container::-webkit-scrollbar {
                    height: 6px;
                }
                .thumbnail-container::-webkit-scrollbar-thumb {
                    background-color: #d9d9d9;
                    border-radius: 4px;
                }
                .thumbnail-container::-webkit-scrollbar-track {
                    background-color: transparent;
                }
            `}</style>

            <div style={styles.container}>
                <div style={{ marginBottom: 24 }}>
                    <Breadcrumb style={{ fontSize: 14, marginBottom: 12 }}>
                        <Breadcrumb.Item href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                            <HomeOutlined />
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                        <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
                    </Breadcrumb>
                    
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate(-1)}
                        style={{ padding: 0, fontWeight: 500, color: '#595959' }}
                    >
                        Quay lại
                    </Button>
                </div>

                <Card bordered={false} bodyStyle={{ padding: 32 }} style={styles.mainCard}>
                    <Row gutter={[48, 32]}>
                        {/* Trái: Hình ảnh sản phẩm */}
                        <Col xs={24} md={12} lg={10}>
                            <div style={styles.galleryBg} className="gallery-main">
                                <Image
                                    src={getImageUrl(selectedImage)}
                                    alt={product.name}
                                    style={styles.mainImage}
                                />
                            </div>
                            
                            {product.images && product.images.length > 1 && (
                                <div style={styles.thumbnailContainer} className="thumbnail-container">
                                    {product.images.map((img, idx) => (
                                        <div 
                                            key={idx} 
                                            style={styles.thumbnail(selectedImage === img.imageUrl)}
                                            className="thumbnail-item"
                                            onClick={() => setSelectedImage(img.imageUrl)}
                                        >
                                            <Image 
                                                preview={false}
                                                src={getImageUrl(img.imageUrl)} 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain', mixBlendMode: 'multiply' }} 
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Col>

                        {/* Phải: Thông tin sản phẩm */}
                        <Col xs={24} md={12} lg={14}>
                            <Title level={2} style={{ marginTop: 0, marginBottom: 12, fontWeight: 700, fontSize: 32 }}>
                                {product.name}
                            </Title>
                            
                            <Space split={<Divider type="vertical" />} style={{ marginBottom: 24, flexWrap: 'wrap' }}>
                                <Space>
                                    <Rate disabled defaultValue={4.5} allowHalf style={{ fontSize: 14, color: '#faad14' }} />
                                    <Text type="secondary">(128 Reviews)</Text>
                                </Space>
                                <Text type="secondary">{product.sold || 0} Đã bán</Text>
                            </Space>

                            <div style={{ display: 'flex', gap: 24, marginBottom: 24, flexWrap: 'wrap' }}>
                                {product.brand && (
                                    <Text type="secondary">Thương hiệu: <Text strong style={{ color: '#262626' }}>{product.brand.name}</Text></Text>
                                )}
                                {product.category && (
                                    <Text type="secondary">Danh mục: <Text strong style={{ color: '#262626' }}>{product.category.name}</Text></Text>
                                )}
                                <Text type="secondary">
                                    Tình trạng: 
                                    {product.stock > 0 ? (
                                        <Tag color="success" style={{ marginLeft: 8, borderRadius: 4, fontWeight: 500 }}>Còn hàng</Tag>
                                    ) : (
                                        <Tag color="error" style={{ marginLeft: 8, borderRadius: 4, fontWeight: 500 }}>Hết hàng</Tag>
                                    )}
                                </Text>
                            </div>

                            <div style={styles.priceBox}>
                                <Text style={styles.priceText}>{formatPrice(product.price)}</Text>
                            </div>

                            <Paragraph style={{ fontSize: 16, color: '#595959', lineHeight: 1.6, marginBottom: 32 }}>
                                {product.description || 'Mô tả ngắn gọn về sản phẩm. Hiệu năng vượt trội và thiết kế hiện đại mang lại trải nghiệm tuyệt vời nhất cho người dùng.'}
                            </Paragraph>

                            <Divider style={{ margin: '24px 0' }} />

                            <Space align="center" size="large" style={{ marginBottom: 32 }}>
                                <Text strong style={{ fontSize: 16 }}>Số lượng:</Text>
                                <InputNumber 
                                    min={1} 
                                    max={product.stock > 0 ? product.stock : 1} 
                                    value={quantity} 
                                    onChange={setQuantity} 
                                    disabled={product.stock <= 0}
                                    size="large"
                                    style={{ width: 120, borderRadius: 8 }}
                                />
                                <Text type="secondary">{product.stock} sản phẩm có sẵn</Text>
                            </Space>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Button 
                                        size="large" 
                                        block 
                                        icon={<ShoppingCartOutlined />} 
                                        onClick={handleAddToCart}
                                        disabled={product.stock <= 0}
                                        style={{ ...styles.actionButton, color: '#1677ff', borderColor: '#1677ff', background: '#fff' }}
                                    >
                                        Thêm vào giỏ hàng
                                    </Button>
                                </Col>
                                <Col span={12}>
                                    <Button 
                                        type="primary" 
                                        size="large" 
                                        block 
                                        onClick={handleBuyNow}
                                        disabled={product.stock <= 0}
                                        className="btn-buy-now"
                                        style={{ ...styles.actionButton, background: '#ff4d4f', borderColor: '#ff4d4f' }}
                                    >
                                        Mua ngay
                                    </Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Card>

                <Card bordered={false} bodyStyle={{ padding: '24px 32px' }} style={{ ...styles.mainCard, marginTop: 32 }}>
                    <Tabs defaultActiveKey="1" items={tabItems} size="large" />
                </Card>

                <div style={{ marginTop: 48, marginBottom: 24 }}>
                    <Title level={3} style={styles.sectionTitle}>Sản phẩm liên quan</Title>
                    <Row gutter={[24, 24]}>
                        {relatedProducts.map((item) => (
                            <Col xs={12} sm={12} md={6} key={item.id}>
                                <Card 
                                    hoverable 
                                    style={styles.relatedCard} 
                                    className="related-card"
                                    bodyStyle={{ padding: '16px 20px' }}
                                    cover={
                                        <div style={{ background: '#f5f7fb', padding: 24, display: 'flex', justifyContent: 'center', borderBottom: '1px solid #f0f0f0' }}>
                                            <img 
                                                alt={item.name} 
                                                src={getImageUrl(item.thumbnail)} 
                                                style={{ height: 160, objectFit: 'contain', mixBlendMode: 'multiply' }} 
                                            />
                                        </div>
                                    }
                                >
                                    <Card.Meta 
                                        title={<Text strong style={{ fontSize: 16 }}>{item.name}</Text>} 
                                        description={<Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>{formatPrice(item.price)}</Text>} 
                                    />
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
