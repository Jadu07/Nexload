import React, { useState, useEffect, useRef } from 'react';
import { Upload, ChevronDown, User, LogOut } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import UploadPopup from './UploadPopup';

const Navbar = ({ user, onNavigate }) => {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
                    {/* Logo */}
                    <div
                        className="flex items-center gap-2 cursor-pointer group"
                        onClick={() => onNavigate('home')}
                    >
                        <div className="text-2xl font-bold tracking-widest text-white group-hover:text-gray-200 transition-colors">
                            <span className="font-extrabold text-3xl">NEXLOAD</span>
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-6">
                        {!user ? (
                            <button
                                onClick={() => window.location.href = `${API_BASE_URL}/auth/google`}
                                className="px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-100 transition-all font-medium text-sm shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Login
                            </button>
                        ) : (
                            <div className="flex items-center gap-4">
                                {/* Upload Button */}
                                <button
                                    onClick={() => setIsUploadOpen(true)}
                                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 text-white transition-all text-sm font-medium backdrop-blur-sm"
                                >
                                    <Upload className="h-4 w-4" />
                                    Upload
                                </button>

                                {/* Profile Section */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:border-white/20"
                                    >
                                        {user.image ? (
                                            <img
                                                src={user.image}
                                                alt={user.displayName}
                                                className="w-8 h-8 rounded-full border border-white/20"
                                            />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/10">
                                                {user.displayName?.charAt(0)}
                                            </div>
                                        )}
                                        <span className="text-white font-medium text-sm hidden sm:block">
                                            {user.displayName.split(' ')[0]}
                                        </span>
                                        <ChevronDown
                                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`}
                                        />
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isProfileMenuOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl py-2 border border-gray-100 ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-900 truncate">{user.displayName}</p>
                                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                            </div>

                                            <div className="py-1">
                                                <button
                                                    onClick={() => {
                                                        onNavigate('profile');
                                                        setIsProfileMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                                                >
                                                    <User className="h-4 w-4 text-gray-400" />
                                                    My Profile
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setIsUploadOpen(true);
                                                        setIsProfileMenuOpen(false);
                                                    }}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 sm:hidden"
                                                >
                                                    <Upload className="h-4 w-4 text-gray-400" />
                                                    Upload Resource
                                                </button>
                                            </div>

                                            <div className="border-t border-gray-100 py-1">
                                                <button
                                                    onClick={() => window.location.href = `${API_BASE_URL}/auth/logout`}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                >
                                                    <LogOut className="h-4 w-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <UploadPopup isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        </>
    );
};

export default Navbar;
