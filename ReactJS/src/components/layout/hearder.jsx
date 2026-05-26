import React, { useContext, useState, useEffect } from 'react';
import {
    UserOutlined,
    ShoppingCartOutlined,
    SearchOutlined,
    MenuOutlined,
} from '@ant-design/icons';
import { Button, Drawer, Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { logoutApi } from '../util/api/auth.api'; // Thêm dòng này

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { auth, dispatch } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);

    useEffect(() => {
        const currentPath = location.pathname.split('/')[1] || 'home';
        setCurrent(currentPath);
    }, [location]);

    const handleLogout = async () => {
        try {
            await logoutApi(); // Gọi API logout để clear cookie phía backend
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            setCurrent("home");
            dispatch({ type: 'LOGOUT' });
            navigate("/login");
        }
    };

    const mainMenuItems = [
        { label: 'Home', key: 'home', path: '/home' },
        { label: 'Shop', key: 'products', path: '/products' },
        { label: 'Orders', key: 'history', path: '/history' },
        { label: 'About', key: 'about', path: '#' }
    ];

    const profileMenuItems = [
        {
            key: 'profile',
            label: <Link to="/user/profile" style={{ fontSize: '13px', fontWeight: 500 }}>My Profile</Link>,
        },
        {
            key: 'logout',
            danger: true,
            label: <span onClick={handleLogout} style={{ fontSize: '13px', fontWeight: 500 }}>Logout</span>,
        },
    ];

    return (
        <div className="header-wrapper">
            <style>
                {`
                .header-wrapper {
                    position: sticky;
                    top: 0;
                    z-index: 1000;
                    width: 100%;
                    padding: 12px 32px;
                    display: flex;
                    justify-content: center;
                }

                @media (max-width: 768px) {
                    .header-wrapper {
                        padding: 12px 14px;
                    }
                }

                .header-container {
                    width: 100%;
                    max-width: 1280px;
                    height: 72px;
                    background: rgba(255, 255, 255, 0.75);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
                    border-radius: 999px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 0 32px;
                }

                @media (max-width: 768px) {
                    .header-container {
                        padding: 0 20px;
                        border-radius: 24px;
                    }
                }

                .header-logo {
                    font-size: 12px;
                    font-weight: 800;
                    letter-spacing: 2px;
                    color: #111;
                    text-decoration: none;
                    text-transform: uppercase;
                }

                .header-menu {
                    display: flex;
                    gap: 32px;
                    align-items: center;
                }

                @media (max-width: 768px) {
                    .header-menu {
                        display: none;
                    }
                }

                .header-menu-item {
                    font-size: 13px;
                    font-weight: 500;
                    color: #666;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .header-menu-item:hover, .header-menu-item.active {
                    color: #111;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                @media (max-width: 768px) {
                    .header-actions .desktop-only {
                        display: none;
                    }
                }

                .icon-btn {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #111;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    text-decoration: none;
                }

                .icon-btn:hover {
                    background: rgba(0, 0, 0, 0.05);
                }

                .icon-btn svg {
                    width: 18px;
                    height: 18px;
                }
                `}
            </style>

            <div className="header-container">
                <Link to="/" className="header-logo">
                    UTESHOP
                </Link>

                <div className="header-menu">
                    {mainMenuItems.map(item => (
                        <Link 
                            key={item.key} 
                            to={item.path} 
                            className={`header-menu-item ${current === item.key ? 'active' : ''}`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="header-actions">
                    <button className="icon-btn desktop-only" onClick={() => navigate('/products')}>
                        <SearchOutlined style={{ fontSize: '18px' }} />
                    </button>
                    
                    <Link to="/cart" className="icon-btn">
                        <ShoppingCartOutlined style={{ fontSize: '18px' }} />
                    </Link>

                    {auth.isAuthenticated ? (
                        <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
                            <button className="icon-btn desktop-only">
                                <UserOutlined style={{ fontSize: '18px' }} />
                            </button>
                        </Dropdown>
                    ) : (
                        <Button type="text" onClick={() => navigate('/login')} style={{fontWeight: 600}}>Login</Button>
                    )}

                    <Button 
                        type="text" 
                        icon={<MenuOutlined />} 
                        onClick={() => setIsDrawerVisible(true)}
                        style={{ display: 'none' }}
                        className="mobile-only-btn"
                    />
                    <style>{`@media (max-width: 768px) { .mobile-only-btn { display: inline-block !important; } }`}</style>
                </div>
            </div>

            <Drawer
                placement="right"
                onClose={() => setIsDrawerVisible(false)}
                open={isDrawerVisible}
                width={280}
                styles={{ body: { padding: '24px' } }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {mainMenuItems.map(item => (
                        <Link 
                            key={item.key} 
                            to={item.path} 
                            style={{ 
                                fontSize: '16px', 
                                fontWeight: 600, 
                                color: current === item.key ? '#111' : '#666',
                                textDecoration: 'none'
                            }}
                            onClick={() => setIsDrawerVisible(false)}
                        >
                            {item.label}
                        </Link>
                    ))}
                    
                    <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />
                    
                    {auth.isAuthenticated ? (
                        <>
                            <Link to="/user/profile" style={{ fontSize: '16px', fontWeight: 600, color: '#666', textDecoration: 'none' }} onClick={() => setIsDrawerVisible(false)}>
                                Profile
                            </Link>
                            <span onClick={() => { handleLogout(); setIsDrawerVisible(false); }} style={{ fontSize: '16px', fontWeight: 600, color: '#ff4d4f', cursor: 'pointer' }}>
                                Logout
                            </span>
                        </>
                    ) : (
                        <Link to="/login" style={{ fontSize: '16px', fontWeight: 600, color: '#111', textDecoration: 'none' }} onClick={() => setIsDrawerVisible(false)}>
                            Sign In
                        </Link>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default Header;