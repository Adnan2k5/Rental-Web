import { useAuth } from '../Middleware/AuthProvider'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { MessageCircleMore, ShoppingCart } from 'lucide-react';
import { Badge } from './ui/badge';
import { getCartCountApi } from '../api/carts.api';
import { useTranslation } from 'react-i18next';

export const Navbar = () => {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchCartCount = async () => {
            if (user) {
                try {
                    const response = await getCartCountApi();
                    if (response.data.data && response.data.data.count !== undefined) {
                        setCartCount(response.data.data.count);
                    }
                } catch (error) {
                    return error;
                }
            }
        };

        fetchCartCount();
    }, [user]);

    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-700"
                >
                    Noleggiarmi
                </Link>

                <div className="hidden md:flex items-center space-x-1">
                    <Link
                        to="/"
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                    >
                        {t('navbar.home')}
                    </Link>
                    <Link
                        to="/browse"
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                    >
                        {t('navbar.browse')}
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    <Link
                        to="/chat"
                        className="hidden md:flex items-center text-gray-700 hover:text-primary"
                    >
                        <MessageCircleMore className="h-5 w-5" />
                    </Link>
                    <Link to="/cart" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {cartCount > 0 && (
                            <Badge
                                variant="outline"
                                className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-black text-white border-black"
                            >
                                {cartCount}
                            </Badge>
                        )}
                    </Link>
                    {user ? (
                        <Link to="/dashboard">
                            {user.profilePicture ? (
                                <img
                                    src={user.profilePicture}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                                />
                            ) : (
                                <Avatar
                                    variant="ghost"
                                    className="w-8 h-8 flex items-center justify-center bg-accent-foreground hover:bg-accent-foreground/50 duration-[400ms] transition-all hover:text-white rounded-3xl text-white"
                                    size="sm"
                                >
                                    {user.name?.charAt(0).toUpperCase()}
                                </Avatar>
                            )}
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                {t('navbar.signin')}
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
