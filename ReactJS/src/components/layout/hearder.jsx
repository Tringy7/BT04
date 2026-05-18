import React, { useContext, useState } from 'react';
import { UsergroupAddOutlined, HomeOutlined, SettingOutlined, ShoppingOutlined } from '@ant-design/icons';
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
        ...(auth.isAuthenticated ? [{
            label: <Link to="/user/profile">Users</Link>,
            key: 'user',
            icon: <UsergroupAddOutlined />,
        }] : []),

        {
            label: `Setting ${auth?.user?.email ?? ""}`,
            key: 'settings',
            icon: <SettingOutlined />,
            children: [
                ...(auth.isAuthenticated ? [{
                    label: <span onClick={() => {
                        localStorage.removeItem("access_token");
                        setCurrent("home");
                        dispatch({ type: 'LOGOUT' });
                        navigate("/login");
                    }}>Đăng xuất</span>,
                    key: 'logout',
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