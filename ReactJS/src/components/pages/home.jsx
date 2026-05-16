import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Carousel,
    Col,
    Divider,
    Empty,
    Image,
    Input,
    message,
    Row,
    Select,
    Skeleton,
    Tag,
    Typography
} from 'antd';

import {
    FilterOutlined,
    ShoppingOutlined,
    StarFilled,
    FireOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { getHomePageApi, getImageUrl } from '../util/api';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const HomePage = () => {
    const [homeData, setHomeData] = useState({
        promotions: [],
        newestProducts: [],
        bestSellingProducts: []
    });

    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOrder, setSortOrder] = useState('default');
    const navigate = useNavigate();

    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);

            try {
                const res = await getHomePageApi();

                if (res?.data) {
                    setHomeData(res.data);
                } else if (
                    res?.promotions ||
                    res?.newestProducts ||
                    res?.bestSellingProducts
                ) {
                    setHomeData(res);
                } else {
                    message.error(
                        res?.message || 'Không tải được dữ liệu trang chủ'
                    );
                }
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu trang chủ');
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    // FORMAT PRICE VND
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    // PROMOTION CARD
    const renderPromotionCard = (promotion) => {
        const productImage =
            promotion?.products?.[0]?.images?.[0]?.imageUrl;

        const displayImage = getImageUrl(
            promotion.image || productImage
        );

        return (
            <div
                key={promotion.id}
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    padding: '10px 0'
                }}
            >
                <Card
                    bordered={false}
                    hoverable
                    style={{
                        width: '100%',
                        maxWidth: 980,
                        borderRadius: 24,
                        overflow: 'hidden',
                        background: '#fff',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.08)'
                    }}
                    bodyStyle={{
                        padding: 0
                    }}
                >
                    <div
                        style={{
                            position: 'relative',
                            width: '100%',
                            height: 340,
                            overflow: 'hidden',
                            background: '#f5f5f5'
                        }}
                    >
                        <Image
                            preview={false}
                            fallback="https://via.placeholder.com/1200x420?text=Promotion"
                            src={displayImage}
                            alt={promotion.title}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />

                        {/* OVERLAY */}
                        <div
                            style={{
                                position: 'absolute',
                                inset: 0,
                                background:
                                    'linear-gradient(to right, rgba(0,0,0,0.72), rgba(0,0,0,0.15))'
                            }}
                        />

                        {/* CONTENT */}
                        <div
                            style={{
                                position: 'absolute',
                                left: 36,
                                bottom: 36,
                                zIndex: 2,
                                color: '#fff',
                                maxWidth: 500
                            }}
                        >
                            <Tag
                                color="volcano"
                                style={{
                                    fontWeight: 700,
                                    padding: '6px 16px',
                                    borderRadius: 999,
                                    fontSize: 14
                                }}
                            >
                                Giảm {promotion.discountPercent}%
                            </Tag>

                            <Title
                                level={2}
                                style={{
                                    color: '#fff',
                                    marginTop: 18,
                                    marginBottom: 12,
                                    fontSize: 34,
                                    lineHeight: 1.2
                                }}
                            >
                                {promotion.title}
                            </Title>

                            <Paragraph
                                style={{
                                    color: 'rgba(255,255,255,0.92)',
                                    fontSize: 15,
                                    marginBottom: 20
                                }}
                            >
                                {promotion.products?.length
                                    ? `Áp dụng cho ${promotion.products.length} sản phẩm`
                                    : 'Ưu đãi hấp dẫn cho sản phẩm mới'}
                            </Paragraph>

                            <Button
                                type="primary"
                                size="large"
                                icon={<ShoppingOutlined />}
                                style={{
                                    borderRadius: 999,
                                    height: 44,
                                    paddingInline: 24,
                                    fontWeight: 600
                                }}
                            >
                                Mua ngay
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        );
    };

    // PRODUCT CARD
    const renderProductCard = (product) => {
        const imageUrl =
            product?.images?.[0]?.imageUrl || product.thumbnail;

        const displayImage = getImageUrl(imageUrl);

        return (
            <Card
                key={product.id}
                className="clickable-product-card"
                onClick={() => handleProductClick(product)}
                bordered={false}
                hoverable
                style={{
                    borderRadius: 22,
                    overflow: 'hidden',
                    boxShadow: '0 6px 22px rgba(0,0,0,0.06)',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                    height: '100%'
                }}
                bodyStyle={{
                    padding: 18
                }}
                cover={
                    <div
                        style={{
                            height: 220,
                            overflow: 'hidden',
                            background: '#f5f5f5'
                        }}
                    >
                        <Image
                            preview={false}
                            fallback="https://via.placeholder.com/420x280?text=Product"
                            src={displayImage}
                            alt={product.name}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                }
            >
                <Title
                    level={5}
                    ellipsis={{ rows: 2 }}
                    style={{
                        minHeight: 48,
                        marginBottom: 8
                    }}
                >
                    {product.name}
                </Title>

                <Text type="secondary">
                    {product.brand?.name || 'Thương hiệu'} ·{' '}
                    {product.stock} trong kho
                </Text>

                <div
                    style={{
                        marginTop: 16,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                >
                    <Text
                        strong
                        style={{
                            fontSize: 20,
                            color: '#1677ff'
                        }}
                    >
                        {formatPrice(product.price)}
                    </Text>

                    <Tag
                        color={
                            product.sold > 20
                                ? 'success'
                                : 'blue'
                        }
                        style={{
                            borderRadius: 999,
                            paddingInline: 12
                        }}
                    >
                        {product.sold} đã bán
                    </Tag>
                </div>
            </Card>
        );
    };

    const {
        promotions,
        newestProducts,
        bestSellingProducts
    } = homeData;

    // FILTER & SORT LOGIC
    const filterAndSortProducts = (products) => {
        if (!products) return [];
        let result = [...products];
        
        if (searchTerm) {
            result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
        }
        
        if (sortOrder === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        }
        return result;
    };

    const filteredNewest = filterAndSortProducts(newestProducts);
    const filteredBestSelling = filterAndSortProducts(bestSellingProducts);

    return (
        <div
            style={{
                padding: '28px 24px 70px',
                maxWidth: 1440,
                margin: '0 auto'
            }}
        >
            {/* CUSTOM CAROUSEL STYLE */}
            <style>
                {`
                    /* ===== CAROUSEL DOTS ===== */

                    .custom-carousel .slick-dots {
                        bottom: -14px;
                    }

                    /* item wrapper */
                    .custom-carousel .slick-dots li {
                        width: 52px;
                        margin: 0 6px;
                    }

                    /* default bar */
                    .custom-carousel .slick-dots li button {
                        width: 52px !important;
                        height: 8px !important;
                        padding: 0 !important;
                        border-radius: 999px;
                        background: #111111 !important;
                        opacity: 0.25;
                        transition: all 0.3s ease;
                    }

                    /* active bar */
                    .custom-carousel .slick-dots li.slick-active button {
                        background: #ff4d4f !important;
                        opacity: 1;
                        transform: scaleX(1.08);
                        box-shadow: 0 0 10px rgba(255, 77, 79, 0.45);
                    }

                    /* remove default antd dots */
                    .custom-carousel .slick-dots li button::before {
                        display: none;
                    }

                    /* spacing */
                    .custom-carousel .slick-slide {
                        padding-bottom: 28px;
                    }

                    .clickable-product-card {
                        transition: transform 0.2s ease, box-shadow 0.2s ease;
                    }

                    .clickable-product-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14);
                    }

                    .clickable-product-card:active {
                        transform: translateY(-2px) scale(0.98);
                        box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18);
                    }
                `}
            </style>

            <Skeleton active loading={loading}>
                {/* HERO */}
                <Row
                    gutter={[28, 28]}
                    align="middle"
                    style={{ marginBottom: 48 }}
                >
                    <Col xs={24} lg={13}>
                        <div>
                            <Tag
                                color="blue"
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: 999,
                                    marginBottom: 16
                                }}
                            >
                                Laptop Store
                            </Tag>

                            <Title
                                style={{
                                    fontSize: 52,
                                    lineHeight: 1.15,
                                    marginBottom: 20
                                }}
                            >
                                Laptop chính hãng
                                <br />
                                giá tốt mỗi ngày
                            </Title>

                            <Paragraph
                                style={{
                                    color: '#4b5563',
                                    maxWidth: 620,
                                    fontSize: 17,
                                    lineHeight: 1.8
                                }}
                            >
                                Khám phá các dòng laptop gaming,
                                văn phòng và đồ họa với nhiều ưu
                                đãi hấp dẫn. Cập nhật sản phẩm mới
                                và deal hot mỗi ngày.
                            </Paragraph>

                            <div
                                style={{
                                    display: 'flex',
                                    gap: 14,
                                    flexWrap: 'wrap',
                                    marginTop: 28
                                }}
                            >
                                <Button
                                    type="primary"
                                    size="large"
                                    icon={<ShoppingOutlined />}
                                    style={{
                                        height: 50,
                                        borderRadius: 999,
                                        paddingInline: 28,
                                        fontWeight: 600
                                    }}
                                >
                                    Mua ngay
                                </Button>

                                <Button
                                    size="large"
                                    style={{
                                        height: 50,
                                        borderRadius: 999,
                                        paddingInline: 28
                                    }}
                                    onClick={() =>
                                        window.scrollTo({
                                            top: 500,
                                            behavior: 'smooth'
                                        })
                                    }
                                >
                                    Khuyến mãi hot
                                </Button>
                            </div>
                        </div>
                    </Col>

                    <Col xs={24} lg={11}>
                        <Card
                            style={{
                                borderRadius: 24,
                                overflow: 'hidden',
                                boxShadow:
                                    '0 12px 35px rgba(0,0,0,0.08)'
                            }}
                            bodyStyle={{
                                padding: 0,
                                height: 360
                            }}
                        >
                            <Image
                                preview={false}
                                src="https://images.pexels.com/photos/3806757/pexels-photo-3806757.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                alt="Shop hero"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </Card>
                    </Col>
                </Row>

                {/* PROMOTIONS */}
                <Divider orientation="left">
                    🔥 Ưu đãi nổi bật
                </Divider>

                {promotions.length ? (
                    <Carousel
                        autoplay
                        autoplaySpeed={5000}
                        dots
                        draggable
                        className="custom-carousel"
                        style={{
                            marginBottom: 40
                        }}
                    >
                        {promotions.map((promotion) => (
                            <div key={promotion.id}>
                                {renderPromotionCard(
                                    promotion
                                )}
                            </div>
                        ))}
                    </Carousel>
                ) : (
                    <Row
                        gutter={[24, 24]}
                        style={{ marginBottom: 24 }}
                    >
                        <Col span={24}>
                            <Empty description="Chưa có khuyến mãi" />
                        </Col>
                    </Row>
                )}

                {/* TOOLBAR: SEARCH & FILTER */}
                <Row justify="space-between" align="middle" style={{ marginBottom: 24, marginTop: 40 }}>
                    <Col xs={24} md={12} style={{ marginBottom: 16 }}>
                        <Title level={3} style={{ margin: 0 }}>
                            Khám phá sản phẩm
                        </Title>
                    </Col>
                    <Col xs={24} md={12}>
                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                            <Search
                                placeholder="Tìm kiếm sản phẩm..."
                                allowClear
                                onSearch={(value) => setSearchTerm(value)}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{ width: 250 }}
                            />
                            <Select
                                defaultValue="default"
                                style={{ width: 180 }}
                                onChange={(value) => setSortOrder(value)}
                                suffixIcon={<FilterOutlined />}
                            >
                                <Option value="default">Sắp xếp mặc định</Option>
                                <Option value="price-asc">Giá: Thấp đến Cao</Option>
                                <Option value="price-desc">Giá: Cao xuống Thấp</Option>
                            </Select>
                        </div>
                    </Col>
                </Row>

                {/* NEW PRODUCTS */}
                <Divider orientation="left">
                    ✨ Sản phẩm mới nhất
                </Divider>

                <Row
                    gutter={[24, 24]}
                    style={{ marginBottom: 32 }}
                >
                    {filteredNewest.length ? (
                        filteredNewest.map((product) => (
                            <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                key={`new-${product.id}`}
                            >
                                {renderProductCard(product)}
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Empty description="Không có sản phẩm mới" />
                        </Col>
                    )}
                </Row>

                {/* BEST SELLING */}
                <Divider orientation="left">
                    🚀 Bán chạy nhất
                </Divider>

                <Row gutter={[24, 24]}>
                    {filteredBestSelling.length ? (
                        filteredBestSelling.map((product) => (
                            <Col
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                key={`best-${product.id}`}
                            >
                                {renderProductCard(product)}
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Empty description="Không có sản phẩm bán chạy" />
                        </Col>
                    )}
                </Row>

                {/* FOOT TAGS */}
                <div
                    style={{
                        marginTop: 60,
                        textAlign: 'center'
                    }}
                >
                    <Tag
                        icon={<FireOutlined />}
                        color="error"
                        style={{
                            padding: '8px 16px',
                            borderRadius: 999
                        }}
                    >
                        Hot
                    </Tag>

                    <Tag
                        icon={<StarFilled />}
                        color="warning"
                        style={{
                            padding: '8px 16px',
                            borderRadius: 999
                        }}
                    >
                        Yêu thích
                    </Tag>

                    <Tag
                        icon={<ShoppingOutlined />}
                        color="success"
                        style={{
                            padding: '8px 16px',
                            borderRadius: 999
                        }}
                    >
                        Săn sale
                    </Tag>
                </div>
            </Skeleton>
        </div>
    );
};

export default HomePage;