import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Empty, Input, Select, Pagination, Breadcrumb, Image, Tag, Skeleton, message, Checkbox, Slider, Space } from 'antd';
import { HomeOutlined, DownOutlined, AppstoreOutlined, BarsOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllProductsStoreApi } from '../util/api/product.api';
import { getImageUrl } from '../util/helpers';

const { Title, Paragraph, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState({ rows: [], count: 0 });
    const [loading, setLoading] = useState(true);

    // Logic hooks and state are kept unchanged
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'default';
    const PAGE_SIZE = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const res = await getAllProductsStoreApi(page, PAGE_SIZE, search, sort);
                const data = res?.data || res;
                if (data?.rows || data?.data?.rows) {
                    setProducts(data.rows ? data : data.data);
                } else {
                    setProducts({ rows: [], count: 0 });
                }
            } catch (error) {
                message.error('Lỗi khi tải danh sách sản phẩm');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page, search, sort]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage, search, sort });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSearch = (value) => {
        setSearchParams({ page: 1, search: value, sort });
    };

    const handleSortChange = (value) => {
        setSearchParams({ page: 1, search, sort: value });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    // UI Rendering Functions
    const renderProductCard = (product) => {
        const imageUrl = product?.images?.[0]?.imageUrl || product.thumbnail;
        const displayImage = getImageUrl(imageUrl);

        return (
            <Card
                key={product.id}
                className="premium-product-card"
                onClick={() => navigate(`/product/${product.id}`)}
                bordered={false}
                bodyStyle={{ padding: 0 }}
            >
                <div className="card-image-wrapper">
                    <Image
                        preview={false}
                        fallback="https://via.placeholder.com/400x400?text=Image"
                        src={displayImage}
                        alt={product.name}
                        className="card-image"
                    />
                    {product.isNew && <Tag className="card-badge new">NEW</Tag>}
                    {product.discount > 0 && <Tag className="card-badge discount">-{product.discount}%</Tag>}
                </div>
                <div className="card-content">
                    <Text className="card-brand">{product.brand?.name || 'BRAND'}</Text>
                    <Title level={5} ellipsis={{ rows: 2 }} className="card-title">
                        {product.name}
                    </Title>
                    <div className="card-specs">
                        {product.specs?.slice(0, 3).map(spec => <Tag key={spec}>{spec}</Tag>)}
                    </div>
                    <div className="card-footer">
                        <Text strong className="card-price">{formatPrice(product.price)}</Text>
                        <Button shape="circle" icon={<PlusCircleOutlined />} className="add-to-cart-btn" onClick={(e) => e.stopPropagation()} />
                    </div>
                </div>
            </Card>
        );
    };

    const renderFilterSidebar = () => (
        <div className="filter-sidebar">
            <div className="filter-section">
                <Title level={5} className="filter-title">Category</Title>
                <Checkbox.Group style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Checkbox value="gaming">Gaming Laptops</Checkbox>
                        <Checkbox value="creator">Creator Laptops</Checkbox>
                        <Checkbox value="business">Business Laptops</Checkbox>
                        <Checkbox value="ultrabook">Ultrabooks</Checkbox>
                    </Space>
                </Checkbox.Group>
            </div>
            <div className="filter-section">
                <Title level={5} className="filter-title">Brand</Title>
                <Checkbox.Group style={{ width: '100%' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                        <Checkbox value="asus">Asus</Checkbox>
                        <Checkbox value="dell">Dell</Checkbox>
                        <Checkbox value="hp">HP</Checkbox>
                        <Checkbox value="lenovo">Lenovo</Checkbox>
                    </Space>
                </Checkbox.Group>
            </div>
            <div className="filter-section">
                <Title level={5} className="filter-title">Price Range</Title>
                <Slider range defaultValue={[10000000, 50000000]} max={100000000} step={1000000} tooltip={{ formatter: formatPrice }} />
            </div>
            <div className="filter-section">
                <Title level={5} className="filter-title">RAM</Title>
                <Space wrap>
                    <Button className="filter-chip">16GB</Button>
                    <Button className="filter-chip active">32GB</Button>
                    <Button className="filter-chip">64GB</Button>
                </Space>
            </div>
        </div>
    );

    return (
        <div className="products-page-container">
            <style>{`
                /* GLOBAL STYLES */
                .products-page-container {
                    max-width: 1500px;
                    margin: 0 auto;
                    padding: 40px 32px 100px;
                    background: #f8fafc;
                }
                @media (max-width: 768px) { .products-page-container { padding: 24px 16px 80px; } }

                /* HEADER SECTION */
                .page-header-section {
                    background: #fff;
                    border-radius: 28px;
                    padding: 40px;
                    margin-bottom: 32px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                }
                .page-title {
                    font-size: 48px !important;
                    font-weight: 800 !important;
                    letter-spacing: -1px;
                    color: #0f172a !important;
                    margin: 8px 0 12px !important;
                }
                .page-subtitle {
                    font-size: 16px;
                    color: #64748b;
                    max-width: 500px;
                }
                .toolbar-controls {
                    background: rgba(248, 250, 252, 0.8);
                    backdrop-filter: blur(10px);
                    border-radius: 16px;
                    padding: 12px;
                    border: 1px solid #f1f5f9;
                }
                .custom-search-bar .ant-input-wrapper {
                    height: 52px;
                    border-radius: 999px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                }
                .custom-search-bar .ant-input {
                    height: 100%;
                    border: none;
                    padding-left: 24px;
                }
                .custom-search-bar .ant-input-wrapper:focus-within {
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
                }
                .custom-sort-select .ant-select-selector {
                    height: 52px !important;
                    border-radius: 999px !important;
                    border: 1px solid #e5e7eb !important;
                    background: #fff !important;
                    display: flex;
                    align-items: center;
                    padding: 0 24px !important;
                }

                /* MAIN LAYOUT */
                .main-content-row {
                    margin-top: 32px;
                }

                /* FILTER SIDEBAR */
                .filter-sidebar {
                    background: #fff;
                    border-radius: 28px;
                    padding: 28px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                    position: sticky;
                    top: 100px;
                }
                .filter-section { margin-bottom: 32px; }
                .filter-title {
                    font-size: 16px !important;
                    font-weight: 600 !important;
                    color: #0f172a !important;
                    margin-bottom: 16px !important;
                    padding-bottom: 12px;
                    border-bottom: 1px solid #f1f5f9;
                }
                .ant-checkbox-wrapper { font-size: 14px; color: #475569; }
                .filter-chip {
                    border-radius: 999px;
                    border: 1px solid #e5e7eb;
                    background: #f8fafc;
                }
                .filter-chip.active {
                    background: #e0e7ff;
                    color: #2563eb;
                    border-color: #a5b4fc;
                }

                /* PRODUCT CARD */
                .premium-product-card {
                    background: #fff;
                    border-radius: 26px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    border: 1px solid transparent;
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    cursor: pointer;
                    height: 100%;
                }
                .premium-product-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 25px 50px rgba(37,99,235,0.12);
                    border-color: rgba(37, 99, 235, 0.3);
                }
                .card-image-wrapper {
                    background: #f5f7fb;
                    height: 240px;
                    padding: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    border-radius: 26px 26px 0 0;
                }
                .card-image {
                    object-fit: contain;
                    height: 100%;
                    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .premium-product-card:hover .card-image { transform: scale(1.08); }
                .card-badge {
                    position: absolute;
                    top: 16px;
                    left: 16px;
                    border: none;
                    font-weight: 600;
                }
                .card-badge.new { background: #dbeafe; color: #1e40af; }
                .card-badge.discount { background: #fee2e2; color: #991b1b; }
                .card-content { padding: 24px; }
                .card-brand {
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1.5px;
                    color: #94a3b8;
                    font-weight: 600;
                    margin-bottom: 8px;
                    display: block;
                }
                .card-title {
                    font-size: 17px !important;
                    font-weight: 600 !important;
                    color: #0f172a !important;
                    line-height: 1.5;
                    margin-bottom: 12px !important;
                    min-height: 50px;
                }
                .card-specs { margin-bottom: 16px; }
                .card-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 16px;
                    border-top: 1px solid #f1f5f9;
                }
                .card-price {
                    font-size: 24px;
                    font-weight: 800;
                    color: #2563eb;
                }
                .add-to-cart-btn {
                    width: 44px;
                    height: 44px;
                    background: #f1f5f9;
                    border: none;
                    color: #475569;
                    font-size: 20px;
                }
                .add-to-cart-btn:hover {
                    background: #2563eb;
                    color: #fff;
                }

                /* PAGINATION */
                .pagination-container {
                    margin-top: 60px;
                    text-align: center;
                }
                .custom-pagination {
                    background: #fff;
                    padding: 16px 28px;
                    border-radius: 999px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    display: inline-block;
                }
                .custom-pagination .ant-pagination-item, .custom-pagination .ant-pagination-prev, .custom-pagination .ant-pagination-next {
                    border-radius: 50%;
                    border: none;
                    background: #f1f5f9;
                }
                .custom-pagination .ant-pagination-item-active {
                    background: #2563eb;
                }
                .custom-pagination .ant-pagination-item-active a {
                    color: #fff;
                }
            `}</style>

            {/* HEADER SECTION */}
            <div className="page-header-section">
                <Row justify="space-between" align="middle" gutter={[24, 24]}>
                    <Col xs={24} lg={12}>
                        <Breadcrumb separator=">">
                            <Breadcrumb.Item href="/"><HomeOutlined /></Breadcrumb.Item>
                            <Breadcrumb.Item>Products</Breadcrumb.Item>
                        </Breadcrumb>
                        <Title className="page-title">Premium Laptops</Title>
                        <Paragraph className="page-subtitle">
                            Explore high-end performance laptops for gaming, creators and professionals. Find the perfect machine that fits your needs.
                        </Paragraph>
                    </Col>
                    <Col xs={24} lg={12}>
                        <Space wrap size={16} className="toolbar-controls" style={{ float: 'right' }}>
                            <Search
                                placeholder="Search in collection..."
                                allowClear
                                defaultValue={search}
                                onSearch={handleSearch}
                                className="custom-search-bar"
                                style={{ width: 280 }}
                            />
                            <Select
                                value={sort}
                                style={{ width: 200 }}
                                onChange={handleSortChange}
                                suffixIcon={<DownOutlined />}
                                className="custom-sort-select"
                            >
                                <Option value="default">Default Sorting</Option>
                                <Option value="price-asc">Price: Low to High</Option>
                                <Option value="price-desc">Price: High to Low</Option>
                            </Select>
                        </Space>
                    </Col>
                </Row>
            </div>

            {/* MAIN CONTENT */}
            <Row gutter={32} className="main-content-row">
                {/* SIDEBAR */}
                <Col xs={24} lg={5}>
                    {renderFilterSidebar()}
                </Col>

                {/* PRODUCT GRID */}
                <Col xs={24} lg={19}>
                    <Skeleton active loading={loading} paragraph={{ rows: 12 }}>
                        {products.rows.length > 0 ? (
                            <Row gutter={[28, 40]}>
                                {products.rows.map((product) => (
                                    <Col xs={24} sm={12} md={8} xl={6} key={product.id}>
                                        {renderProductCard(product)}
                                    </Col>
                                ))}
                            </Row>
                        ) : (
                            <div style={{ background: '#fff', borderRadius: '24px', padding: '80px' }}>
                                <Empty description="No products found matching your criteria." />
                            </div>
                        )}
                        
                        {products.count > PAGE_SIZE && (
                            <div className="pagination-container">
                                <Pagination
                                    current={page}
                                    total={products.count}
                                    pageSize={PAGE_SIZE}
                                    onChange={handlePageChange}
                                    showSizeChanger={false}
                                    className="custom-pagination"
                                />
                            </div>
                        )}
                    </Skeleton>
                </Col>
            </Row>
        </div>
    );
};

export default ProductsPage;