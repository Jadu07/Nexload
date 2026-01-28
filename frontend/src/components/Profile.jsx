import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';
import ResourceCard from './ResourceCard';

const Profile = ({ user }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchUserResources();
        }
    }, [user]);

    const fetchUserResources = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/user/resources`, {
                credentials: 'include'
            });
            if (response.ok) {
                const data = await response.json();
                setResources(data);
            }
        } catch (error) {
            console.error('Error fetching resources:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Hero Section */}
            <div
                className="relative h-[50vh] bg-cover bg-center text-white px-4 py-10 flex items-center justify-center"
                style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2020/12/14/10/40/leaves-5830590_1280.jpg")' }}
            >
                <div className="absolute inset-0 bg-black/70"></div>

                <div className="relative z-10 text-center max-w-2xl mx-auto pt-20">
                    {/* Avatar */}
                    {user.image ? (
                        <img
                            src={user.image}
                            alt={user.displayName}
                            className="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-white/30 shadow-2xl ring-4 ring-white/10"
                        />
                    ) : (
                        <div className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl mx-auto mb-6 border-4 border-white/30 shadow-2xl ring-4 ring-white/10">
                            {user.displayName?.charAt(0)}
                        </div>
                    )}

                    {/* User Info */}
                    <h1 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight">{user.displayName}</h1>
                    <p className="text-gray-200 text-lg mb-4">{user.email}</p>

                    {/* Stats */}
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                        <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <span className="text-white font-semibold">{resources.length} Resources</span>
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">My Uploads</h2>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
                            <p className="mt-4 text-gray-500">Loading resources...</p>
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {resources.map(resource => (
                                <ResourceCard key={resource.id} resource={resource} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No uploads yet</h3>
                            <p className="text-gray-500 mb-6">Start by uploading your first resource</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Profile;
