import React, { useEffect, useState } from 'react';
import {
    Button,
    Card,
    Carousel,
    Col,
    Empty,
    Image,
    Input,
    message,
    Pagination,
    Row,
    Skeleton,
    Tag,
    Typography,
    Space
} from 'antd';

import {
    ArrowRightOutlined,
    SearchOutlined,
    EyeOutlined,
    HeartOutlined,
    FireFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import { getHomePageApi } from '../util/api/home.api';
import { getBestSellingProductsApi } from '../util/api/product.api';
import { getImageUrl } from '../util/helpers';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;

const HomePage = () => {
    const [promotions, setPromotions] = useState([]);
    const [bestSellingProducts, setBestSellingProducts] = useState({ rows: [], count: 0 });

    const [loading, setLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState({
        bestSelling: false
    });

    const [bestSellingPage, setBestSellingPage] = useState(1);
    const PRODUCT_PAGE_SIZE = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const loadHomeData = async () => {
            setLoading(true);
            try {
                const res = await getHomePageApi();
                const data = res?.data || res;

                if (data) {
                    setPromotions(data.promotions || []);
                    setBestSellingProducts(data.bestSellingProducts || { rows: [], count: 0 });
                } else {
                    message.error(res?.message || 'Không tải được dữ liệu trang chủ');
                }
            } catch (error) {
                message.error('Lỗi khi tải dữ liệu trang chủ');
            } finally {
                setLoading(false);
            }
        };

        loadHomeData();
    }, []);

    const handleBestSellingPageChange = async (page) => {
        setProductsLoading((prev) => ({ ...prev, bestSelling: true }));
        window.scrollTo({ top: document.getElementById('bestselling-section')?.offsetTop - 100, behavior: 'smooth' });
        try {
            const res = await getBestSellingProductsApi(page, PRODUCT_PAGE_SIZE);
            const data = res?.data || res;
            if (data?.rows) {
                setBestSellingProducts(data);
                setBestSellingPage(page);
            }
        } catch (error) {
            message.error('Lỗi khi tải trang sản phẩm bán chạy');
        } finally {
            setProductsLoading((prev) => ({ ...prev, bestSelling: false }));
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const renderPromotionCard = (promotion) => {
        const productImage = promotion?.products?.[0]?.images?.[0]?.imageUrl;
        const displayImage = getImageUrl(promotion.image || productImage);

        return (
            <div key={promotion.id} className="promo-slide-wrapper">
                <Card
                    bordered={false}
                    className="promo-card"
                    bodyStyle={{ padding: 0 }}
                >
                    <Row align="middle" style={{ height: '100%' }}>
                        <Col xs={24} md={12} className="promo-content-col">
                            <div className="promo-content-inner">
                                <div className="promo-badge">
                                    SALE {promotion.discountPercent}%
                                </div>

                                <Title level={2} className="promo-title">
                                    {promotion.title}
                                </Title>

                                <Paragraph className="promo-desc">
                                    {promotion.products?.length
                                        ? `Áp dụng cho ${promotion.products.length} sản phẩm cao cấp`
                                        : 'Ưu đãi đặc quyền dành riêng cho bạn'}
                                </Paragraph>

                                <Button
                                    type="primary"
                                    shape="round"
                                    size="large"
                                    className="promo-btn"
                                    onClick={() => navigate('/products')}
                                >
                                    Khám phá ngay
                                </Button>
                            </div>
                        </Col>
                        <Col xs={24} md={12} style={{ height: '100%' }}>
                            <div className="promo-image-container">
                                <Image
                                    preview={false}
                                    fallback="https://via.placeholder.com/800x600?text=Promotion"
                                    src={displayImage}
                                    alt={promotion.title}
                                    className="promo-image"
                                />
                                <div className="promo-image-glow" />
                            </div>
                        </Col>
                    </Row>
                </Card>
            </div>
        );
    };

    const renderProductCard = (product) => {
        const imageUrl = product?.images?.[0]?.imageUrl || product.thumbnail;
        const displayImage = getImageUrl(imageUrl);

        return (
            <Card
                key={product.id}
                className="minimal-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
                bordered={false}
                bodyStyle={{ padding: '0' }}
            >
                <div className="product-image-area">
                    <Image
                        preview={false}
                        fallback="https://via.placeholder.com/420x280?text=Product"
                        src={displayImage}
                        alt={product.name}
                        className="product-image"
                    />
                    <div className="product-actions">
                        <Button shape="circle" icon={<HeartOutlined />} className="action-btn" onClick={(e) => { e.stopPropagation(); }} />
                        <Button shape="circle" icon={<EyeOutlined />} className="action-btn" onClick={(e) => { e.stopPropagation(); navigate(`/product/${product.id}`); }} />
                    </div>
                </div>

                <div className="product-info">
                    <Text className="product-brand">
                        {product.brand?.name || 'PREMIUM'}
                    </Text>

                    <Title level={5} ellipsis={{ rows: 2 }} className="product-name">
                        {product.name}
                    </Title>

                    <div className="product-price-row">
                        <Text strong className="product-price">
                            {formatPrice(product.price)}
                        </Text>
                        <Text className="product-stock">
                            Kho: {product.stock}
                        </Text>
                    </div>
                </div>
            </Card>
        );
    };

    const filteredBestSelling = bestSellingProducts.rows;

    return (
        <div className="page-wrapper">
            <style>
                {`
                    :root {
                        --bg-main: #f5f5f3;
                        --text-dark: #111;
                        --text-gray: #777;
                        --text-light: #888;
                        --brand-blue: #1677ff;
                        --brand-purple: #4f46e5;
                    }

                    body {
                        background-color: var(--bg-main);
                        font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    }

                    .page-wrapper {
                        max-width: 1280px;
                        margin: 0 auto;
                        padding: 0 32px;
                        padding-bottom: 120px;
                    }

                    @media (max-width: 992px) {
                        .page-wrapper { padding: 0 20px; }
                    }
                    @media (max-width: 576px) {
                        .page-wrapper { padding: 0 14px; }
                    }

                    /* HERO SECTION */
                    .hero-container {
                        margin-top: 28px;
                        background: #efefef;
                        border-radius: 28px;
                        padding: 56px;
                        overflow: hidden;
                    }

                    @media (max-width: 768px) {
                        .hero-container {
                            padding: 32px 24px;
                            border-radius: 20px;
                        }
                    }

                    .hero-badge {
                        background: #e0e7ff;
                        color: #4338ca;
                        padding: 6px 16px;
                        border-radius: 999px;
                        font-size: 13px;
                        font-weight: 600;
                        display: inline-block;
                        margin-bottom: 24px;
                        border: none;
                    }

                    .hero-title {
                        font-size: 72px !important;
                        font-weight: 900 !important;
                        line-height: 1 !important;
                        letter-spacing: -3px;
                        color: var(--text-dark) !important;
                        margin-bottom: 24px !important;
                    }

                    @media (max-width: 992px) {
                        .hero-title { font-size: 54px !important; letter-spacing: -2px; }
                    }
                    @media (max-width: 576px) {
                        .hero-title { font-size: 38px !important; letter-spacing: -1px; }
                    }

                    .hero-desc {
                        color: var(--text-gray);
                        font-size: 16px;
                        line-height: 1.8;
                        max-width: 400px;
                        margin-bottom: 40px;
                    }

                    .btn-primary {
                        background: var(--brand-purple);
                        height: 46px;
                        border-radius: 999px;
                        padding: 0 32px;
                        font-weight: 500;
                        border: none;
                    }

                    .btn-secondary {
                        background: #fff;
                        height: 46px;
                        border-radius: 999px;
                        padding: 0 32px;
                        font-weight: 500;
                        border: 1px solid rgba(0,0,0,0.1);
                        color: var(--text-dark);
                    }

                    .hero-image-wrapper {
                        position: relative;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    .hero-image {
                        border-radius: 20px;
                        object-fit: cover;
                        box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                        animation: float 6s ease-in-out infinite;
                    }

                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-10px); }
                        100% { transform: translateY(0px); }
                    }

                    /* SECTION HEADERS */
                    .section-title {
                        font-size: 24px !important;
                        font-weight: 700 !important;
                        color: var(--text-dark) !important;
                        margin: 0 !important;
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }
                    
                    .section-icon {
                        color: #f97316;
                        font-size: 20px;
                    }

                    /* PROMOTION SECTION */
                    .promo-section {
                        margin-top: 80px;
                    }

                    .promo-slide-wrapper {
                        padding: 24px 0 40px;
                    }

                    .promo-card {
                        background: linear-gradient(135deg, #111827 0%, #1e3a8a 100%);
                        border-radius: 22px;
                        overflow: hidden;
                        height: 280px;
                    }

                    .promo-content-col {
                        padding: 40px 48px;
                        display: flex;
                        align-items: center;
                    }
                    
                    @media (max-width: 768px) {
                        .promo-card { height: auto; }
                        .promo-content-col { padding: 32px; text-align: center; }
                    }

                    .promo-badge {
                        background: #ef4444;
                        color: #fff;
                        padding: 4px 12px;
                        border-radius: 6px;
                        font-size: 12px;
                        font-weight: 700;
                        display: inline-block;
                        margin-bottom: 16px;
                    }

                    .promo-title {
                        color: #fff !important;
                        font-size: 32px !important;
                        font-weight: 700 !important;
                        margin-bottom: 12px !important;
                        line-height: 1.2 !important;
                    }

                    .promo-desc {
                        color: rgba(255,255,255,0.7) !important;
                        font-size: 15px !important;
                        margin-bottom: 24px !important;
                    }

                    .promo-btn {
                        background: var(--brand-purple);
                        border: none;
                        font-weight: 600;
                    }

                    .promo-image-container {
                        position: relative;
                        height: 100%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding: 0 40px;
                    }
                    
                    @media (max-width: 768px) {
                         .promo-image-container { display: none; }
                    }

                    .promo-image {
                        max-height: 220px;
                        object-fit: contain;
                        position: relative;
                        z-index: 2;
                        transform: perspective(1000px) rotateY(-10deg);
                    }

                    .promo-image-glow {
                        position: absolute;
                        width: 200px;
                        height: 200px;
                        background: rgba(96, 165, 250, 0.4);
                        filter: blur(50px);
                        border-radius: 50%;
                        z-index: 1;
                        right: 10%;
                    }

                    /* Minimal Carousel Dots */
                    .ant-carousel .slick-dots li {
                        width: 8px;
                        margin: 0 4px;
                    }
                    .ant-carousel .slick-dots li button {
                        width: 8px !important;
                        height: 8px !important;
                        border-radius: 50%;
                        background: #d1d5db !important;
                        opacity: 1;
                    }
                    .ant-carousel .slick-dots li.slick-active button {
                        background: var(--text-dark) !important;
                    }

                    /* TOOLBAR */
                    .toolbar-section {
                        margin-top: 80px;
                        margin-bottom: 32px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .toolbar-search .ant-input-wrapper {
                        background: #fff;
                        border-radius: 8px;
                        border: 1px solid rgba(0,0,0,0.08);
                        overflow: hidden;
                    }
                    .toolbar-search .ant-input {
                        border: none;
                        height: 38px;
                        padding-left: 16px;
                        font-size: 14px;
                    }
                    .toolbar-search .ant-input:focus {
                        box-shadow: none;
                    }
                    .toolbar-search .ant-btn {
                        border: none;
                        height: 38px;
                        background: transparent;
                        color: var(--text-light);
                    }

                    .btn-view-all {
                        background: #1e293b;
                        color: #fff;
                        border-radius: 999px;
                        height: 38px;
                        padding: 0 20px;
                        border: none;
                        font-weight: 500;
                        font-size: 13px;
                    }

                    /* PRODUCT CARD */
                    .minimal-product-card {
                        background: #fff;
                        border-radius: 18px;
                        padding: 16px;
                        border: 1px solid rgba(0,0,0,0.04);
                        box-shadow: 0 4px 12px rgba(0,0,0,0.02);
                        transition: all 0.3s ease;
                        cursor: pointer;
                        height: 100%;
                    }

                    .minimal-product-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                    }

                    .product-image-area {
                        background: #f3f4f6;
                        border-radius: 14px;
                        height: 180px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        padding: 24px;
                        margin-bottom: 16px;
                        overflow: hidden;
                    }

                    .product-image {
                        width: 100%;
                        height: 100%;
                        object-fit: contain;
                    }

                    .product-actions {
                        position: absolute;
                        bottom: 12px;
                        display: flex;
                        gap: 8px;
                        opacity: 0;
                        transform: translateY(10px);
                        transition: all 0.3s ease;
                    }

                    .minimal-product-card:hover .product-actions {
                        opacity: 1;
                        transform: translateY(0);
                    }

                    .action-btn {
                        width: 32px;
                        height: 32px;
                        border: none;
                        background: rgba(255,255,255,0.9);
                        backdrop-filter: blur(4px);
                        color: var(--text-dark);
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    }
                    .action-btn:hover {
                        background: #fff;
                        color: var(--brand-blue);
                    }

                    .product-info {
                        display: flex;
                        flex-direction: column;
                    }

                    .product-brand {
                        font-size: 11px;
                        text-transform: uppercase;
                        color: var(--text-light);
                        letter-spacing: 0.5px;
                        font-weight: 600;
                        margin-bottom: 4px;
                    }

                    .product-name {
                        font-size: 15px !important;
                        font-weight: 600 !important;
                        color: var(--text-dark) !important;
                        margin-bottom: 16px !important;
                        line-height: 1.5;
                        min-height: 44px;
                    }

                    .product-price-row {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-end;
                        margin-top: auto;
                    }

                    .product-price {
                        color: var(--brand-blue);
                        font-size: 20px;
                        font-weight: 800;
                    }

                    .product-stock {
                        font-size: 12px;
                        color: var(--text-light);
                    }
                `}
            </style>

            <Skeleton active loading={loading}>
                {/* HERO */}
                <div className="hero-container">
                    <Row gutter={[48, 48]} align="middle">
                        <Col xs={24} lg={12}>
                            <div className="hero-badge">
                                Next Door Performance
                            </div>
                            <Title className="hero-title">
                                Power your<br />potential.
                            </Title>
                            <div className="hero-desc">
                                Discover the ultimate collection of premium laptops designed for creators, gamers, and professionals.
                            </div>
                            <Space size={16}>
                                <Button type="primary" className="btn-primary" onClick={() => navigate('/products')}>
                                    Shop Collection
                                </Button>
                                <Button className="btn-secondary" onClick={() => window.scrollTo({ top: document.getElementById('promo-section').offsetTop - 100, behavior: 'smooth' })}>
                                    View Offers
                                </Button>
                            </Space>
                        </Col>
                        <Col xs={24} lg={12}>
                            <div className="hero-image-wrapper">
                                <Image
                                    preview={false}
                                    src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&q=80&w=1200"
                                    alt="Hero Laptop"
                                    className="hero-image"
                                />
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* PROMOTIONS */}
                <div id="promo-section" className="promo-section">
                    <Title className="section-title" style={{ marginBottom: '24px' }}>
                        <FireFilled className="section-icon" /> Special Offers
                    </Title>

                    {promotions.length ? (
                        <Carousel autoplay autoplaySpeed={6000} dots={{ className: 'minimal-dots' }}>
                            {promotions.map((promotion) => (
                                <div key={promotion.id}>
                                    {renderPromotionCard(promotion)}
                                </div>
                            ))}
                        </Carousel>
                    ) : (
                        <Empty description="No active promotions" />
                    )}
                </div>

                {/* TOOLBAR */}
                <div className="toolbar-section">
                    <Title className="section-title">
                        Explore Collection
                    </Title>
                    <Space size={16} className="toolbar-right">
                        <Search
                            placeholder="Search laptops..."
                            onSearch={(value) => { if(value) navigate(`/products?search=${value}`); }}
                            className="toolbar-search"
                            style={{ width: 260 }}
                        />
                        <Button className="btn-view-all" onClick={() => navigate('/products')}>
                            View All
                        </Button>
                    </Space>
                </div>

                {/* TRENDING GRID */}
                <div id="bestselling-section">
                    <Skeleton active loading={productsLoading.bestSelling}>
                        <Row gutter={[24, 32]}>
                            {filteredBestSelling.length > 0 ? (
                                filteredBestSelling.map((product) => (
                                    <Col xs={24} sm={12} md={8} lg={6} key={`best-${product.id}`}>
                                        {renderProductCard(product)}
                                    </Col>
                                ))
                            ) : (
                                <Col span={24}>
                                    <Empty description="No products found" />
                                </Col>
                            )}
                        </Row>
                        {bestSellingProducts.count > PRODUCT_PAGE_SIZE && (
                            <Row justify="center" style={{ marginTop: 48 }}>
                                <Pagination
                                    current={bestSellingPage}
                                    total={bestSellingProducts.count}
                                    pageSize={PRODUCT_PAGE_SIZE}
                                    onChange={handleBestSellingPageChange}
                                    showSizeChanger={false}
                                    className="minimal-pagination"
                                />
                            </Row>
                        )}
                    </Skeleton>
                </div>
            </Skeleton>
        </div>
    );
};

export default HomePage;