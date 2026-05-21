import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Typography, Button, Empty, Input, Select, Pagination, Breadcrumb, Image, Tag, Skeleton, message } from 'antd';
import { HomeOutlined, FilterOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAllProductsStoreApi } from '../util/api/product.api';
import { getImageUrl } from '../util/helpers';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const ProductsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [products, setProducts] = useState({ rows: [], count: 0 });
    const [loading, setLoading] = useState(true);

    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const sort = searchParams.get('sort') || 'default';
    const PAGE_SIZE = 4;

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

    const handleProductClick = (product) => {
        navigate(`/product/${product.id}`);
    };

    const renderProductCard = (product) => {
        const imageUrl = product?.images?.[0]?.imageUrl || product.thumbnail;
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
                    cursor: 'pointer',
                    height: '100%'
                }}
                bodyStyle={{ padding: 18 }}
                cover={
                    <div style={{ height: 220, overflow: 'hidden', background: '#f5f5f5' }}>
                        <Image
                            preview={false}
                            fallback="https://via.placeholder.com/420x280?text=Product"
                            src={displayImage}
                            alt={product.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                    </div>
                }
            >
                <Title level={5} ellipsis={{ rows: 2 }} style={{ minHeight: 48, marginBottom: 8 }}>
                    {product.name}
                </Title>
                <Text type="secondary">
                    {product.brand?.name || 'Thương hiệu'} · {product.stock} trong kho
                </Text>
                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: 20, color: '#1677ff' }}>
                        {formatPrice(product.price)}
                    </Text>
                    <Tag color={product.sold > 20 ? 'success' : 'blue'} style={{ borderRadius: 999, paddingInline: 12 }}>
                        {product.sold} đã bán
                    </Tag>
                </div>
            </Card>
        );
    };

    return (
        <div style={{ padding: '28px 24px 70px', maxWidth: 1440, margin: '0 auto' }}>
            <style>
                {`
                    .clickable-product-card { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                    .clickable-product-card:hover { transform: translateY(-6px); box-shadow: 0 16px 36px rgba(0, 0, 0, 0.14); }
                    .clickable-product-card:active { transform: translateY(-2px) scale(0.98); box-shadow: 0 12px 28px rgba(0, 0, 0, 0.18); }
                `}
            </style>
            <Breadcrumb style={{ marginBottom: '24px' }}>
                <Breadcrumb.Item href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>
                    <HomeOutlined />
                </Breadcrumb.Item>
                <Breadcrumb.Item>Tất cả sản phẩm</Breadcrumb.Item>
            </Breadcrumb>

            <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
                <Col xs={24} md={8} style={{ marginBottom: 16 }}>
                    <Title level={2} style={{ margin: 0 }}>Cửa hàng</Title>
                </Col>
                <Col xs={24} md={16}>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                        <Search
                            placeholder="Tìm kiếm sản phẩm..."
                            allowClear
                            defaultValue={search}
                            onSearch={handleSearch}
                            style={{ width: 280 }}
                        />
                        <Select
                            value={sort}
                            style={{ width: 200 }}
                            onChange={handleSortChange}
                            suffixIcon={<FilterOutlined />}
                        >
                            <Option value="default">Sắp xếp mặc định</Option>
                            <Option value="price-asc">Giá: Thấp đến Cao</Option>
                            <Option value="price-desc">Giá: Cao xuống Thấp</Option>
                        </Select>
                    </div>
                </Col>
            </Row>

            <Skeleton active loading={loading}>
                <Row gutter={[24, 24]} style={{ marginBottom: 40 }}>
                    {products.rows.length > 0 ? (
                        products.rows.map((product) => (
                            <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                                {renderProductCard(product)}
                            </Col>
                        ))
                    ) : (
                        <Col span={24}>
                            <Empty description="Không tìm thấy sản phẩm nào" />
                        </Col>
                    )}
                </Row>
                
                {products.count > 0 && (
                    <Row justify="center" style={{ marginTop: 32, marginBottom: 60 }}>
                        <Pagination
                            current={page}
                            total={products.count}
                            pageSize={PAGE_SIZE}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                        />
                    </Row>
                )}
            </Skeleton>
        </div>
    );
};

export default ProductsPage;