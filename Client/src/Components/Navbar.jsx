import { useAuth } from '../Middleware/AuthProvider'
import React from 'react'
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
export const Navbar = () => {
    const user = useAuth();
    return (
        <header className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link
                    to="/"
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600"
                >
                    Rental
                </Link>

                <div className="hidden md:flex items-center space-x-1">
                    <Link
                        to="/"
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                    >
                        Home
                    </Link>
                    <Link
                        to="/browse"
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                    >
                        Browse
                    </Link>
                    <Link
                        to="#"
                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary"
                    >
                        About
                    </Link>
                </div>

                <div className="flex items-center space-x-4">
                    {user.user ? (
                        <Link to="/profile">
                            <Button
                                variant="ghost"
                                className="w-8 h-8 bg-accent-foreground hover:bg-accent-foreground/50 duration-[400ms] transition-all hover:text-white rounded-3xl text-white"
                                size="sm"
                            >
                                {user.user.email.charAt(0).toUpperCase()}
                            </Button>
                        </Link>
                    ) : (
                        <Link to="/login">
                            <Button variant="ghost" size="sm">
                                Sign In
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}
