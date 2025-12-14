import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import { Map, LogOut, Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import EditProfile from './EditProfile';

const Navbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const navLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        // Add more links here later if needed
    ];

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
                                <Map className="h-5 w-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-white tracking-tight">Travel<span className="text-indigo-400">Companion</span></span>
                        </Link>

                        

                        {/* User Actions */}
                        <div className="hidden md:flex items-center gap-4">
                            {user ? (
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-slate-300">
                                        
                                        <Button variant="ghost" size="sm" onClick={() => setIsEditProfileOpen(true)} className="text-slate-400 hover:text-white">
                                            <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                             <User className="h-4 w-4" />  <p>   </p>
                                            </div>
                                            <span className="text-sm font-medium">{user.username}</span>
                                        </Button>

                                    </div>
                                    <Button variant="ghost" size="sm" onClick={logout} className="text-slate-400 hover:text-red-400">
                                        <LogOut className="h-4 w-4 mr-2" /> Logout
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <Link to="/login">
                                        <Button variant="ghost" size="sm">Sign In</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button variant="primary" size="sm">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-slate-900 border-b border-white/10 overflow-hidden"
                        >
                            <div className="px-4 pt-2 pb-4 space-y-1">
                                {user ? (
                                    <>
                                        <div className="pt-4 border-t border-slate-800 mt-4">
                                            <div className="flex items-center px-3 mb-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 mr-3">
                                                    <User className="h-4 w-4 text-slate-400" />
                                                </div>
                                                <Button
                                                variant="ghost"
                                                className="w-full justify-start text-slate-400 hover:text-white hover:bg-slate-800"
                                                onClick={() => {
                                                    setIsEditProfileOpen(true);
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                >
                                                    <div className="text-base font-medium text-white">{user.username}</div>
                                                </Button>
                                                
                                            
                                            </div>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-slate-400 hover:text-red-400 hover:bg-slate-800"
                                                onClick={() => {
                                                    logout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" /> Sign out
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-2 pt-2">
                                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="ghost" className="w-full justify-start">Sign In</Button>
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                            <Button variant="primary" className="w-full justify-center">Get Started</Button>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
            <EditProfile isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
        </>
    );
};

export default Navbar;
