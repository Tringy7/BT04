import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Row, Col, Card, Typography, Button, Divider, Spin, message, Image, InputNumber, Breadcrumb
} from 'antd';
import {
    ShoppingCartOutlined,
    HomeOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';
import { getImageUrl, getProductDetailApi } from '../util/api';

const { Title, Text, Paragraph } = Typography;

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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!product) {
        return (
            <div style={{ textAlign: 'center', padding: '100px' }}>
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

    const handleAddToCart = () => {
        message.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
    };

    const handleBuyNow = () => {
        message.success('Chuyển đến trang thanh toán');
    };

    return (
        <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
            <Breadcrumb style={{ marginBottom: '24px' }}>
                <Breadcrumb.Item href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Sản phẩm</Breadcrumb.Item>
                <Breadcrumb.Item>{product.name}</Breadcrumb.Item>
            </Breadcrumb>

            <Button 
                icon={<ArrowLeftOutlined />} 
                onClick={() => navigate(-1)}
                style={{ marginBottom: '24px' }}
            >
                Quay lại
            </Button>

            <Card bordered={false} style={{ borderRadius: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                <Row gutter={[48, 24]}>
                    {/* Trái: Hình ảnh sản phẩm */}
                    <Col xs={24} md={10}>
                        <div style={{ 
                            background: '#f5f5f5', borderRadius: 12, padding: 16, marginBottom: 16,
                            display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400
                        }}>
                            <Image
                                src={getImageUrl(selectedImage)}
                                alt={product.name}
                                style={{ maxHeight: 360, objectFit: 'contain' }}
                            />
                        </div>
                        
                        {product.images && product.images.length > 1 && (
                            <Row gutter={[12, 12]} justify="center">
                                {product.images.map((img, idx) => (
                                    <Col key={idx}>
                                        <div 
                                            style={{ 
                                                width: 80, height: 80, 
                                                border: selectedImage === img.imageUrl ? '2px solid #1677ff' : '1px solid #d9d9d9',
                                                borderRadius: 8, padding: 4, cursor: 'pointer', background: '#fff'
                                            }}
                                            onClick={() => setSelectedImage(img.imageUrl)}
                                        >
                                            <Image 
                                                preview={false}
                                                src={getImageUrl(img.imageUrl)} 
                                                style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                                            />
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                        )}
                    </Col>

                    {/* Phải: Thông tin sản phẩm */}
                    <Col xs={24} md={14}>
                        <Title level={2} style={{ marginTop: 0 }}>{product.name}</Title>
                        
                        <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
                            {product.brand && (
                                <Text type="secondary">Thương hiệu: <Text strong>{product.brand.name}</Text></Text>
                            )}
                            {product.category && (
                                <Text type="secondary">Danh mục: <Text strong>{product.category.name}</Text></Text>
                            )}
                            <Text type="secondary">Tình trạng: <Text strong style={{ color: product.stock > 0 ? '#52c41a' : '#ff4d4f' }}>
                                {product.stock > 0 ? `Còn hàng (${product.stock})` : 'Hết hàng'}
                            </Text></Text>
                            <Text type="secondary">Đã bán: <Text strong>{product.sold || 0}</Text></Text>
                        </div>

                        <div style={{ background: '#fafafa', padding: '16px 24px', borderRadius: 8, marginBottom: 24 }}>
                            <Title level={2} style={{ color: '#ff4d4f', margin: 0 }}>
                                {formatPrice(product.price)}
                            </Title>
                        </div>

                        <Paragraph style={{ fontSize: 16, marginBottom: 32 }}>
                            {product.description || 'Chưa có mô tả cho sản phẩm này.'}
                        </Paragraph>

                        <Divider />

                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                            <Text strong>Số lượng:</Text>
                            <InputNumber 
                                min={1} 
                                max={product.stock > 0 ? product.stock : 1} 
                                value={quantity} 
                                onChange={setQuantity} 
                                disabled={product.stock <= 0}
                                size="large"
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <Button 
                                size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                style={{ height: 50, padding: '0 32px', borderColor: '#1677ff', color: '#1677ff' }}
                            >
                                Thêm vào giỏ hàng
                            </Button>
                            <Button 
                                type="primary" size="large" onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                style={{ height: 50, padding: '0 32px', background: '#ff4d4f', borderColor: '#ff4d4f' }}
                            >
                                Mua ngay
                            </Button>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default ProductDetail;
