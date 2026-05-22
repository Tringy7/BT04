import React, { useContext, useState } from 'react';
import { UserOutlined, HomeOutlined, SettingOutlined, ShoppingOutlined, ShoppingCartOutlined, LogoutOutlined, HistoryOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';

const Header = () => {

    const navigate = useNavigate();
    const { auth, dispatch } = useContext(AuthContext);
    const [current, setCurrent] = useState('home');

    const items = [
        {
            label: <Link to="/home">Home Page</Link>,
            key: 'home',
            icon: <HomeOutlined />,
        },
        {
            label: <Link to="/products">Products</Link>,
            key: 'products',
            icon: <ShoppingOutlined />,
        },
        {
            label: <Link to="/cart">Cart</Link>,
            key: 'cart',
            icon: <ShoppingCartOutlined />,
        },
        {
            label: <Link to="/history">Lịch sử đơn hàng</Link>,
            key: 'history',
            icon: <HistoryOutlined />,
        },
        {
            label: <Link to="/user/profile">Profile</Link>,
            key: 'user',
            icon: <UserOutlined />,
        },

        {
            label: `Setting ${auth?.user?.email ?? ""}`,
            key: 'settings',
            icon: <SettingOutlined />,
            style: { marginLeft: 'auto' },
            children: [
                ...(auth.isAuthenticated ? [{
                    label: <span onClick={() => {
                        localStorage.removeItem("access_token");
                        setCurrent("home");
                        dispatch({ type: 'LOGOUT' });
                        navigate("/login");
                    }}>Đăng xuất</span>,
                    key: 'logout',
                    icon: <LogoutOutlined />,
                }] : [
                    {
                        label: <Link to="/login">Đăng nhập</Link>,
                        key: 'login',
                    }
                ]),
            ],
        },
    ];

    const onClick = (e) => {
        setCurrent(e.key);
    };
    return <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={items} />;
};
export default Header;