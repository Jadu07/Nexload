import React, { useState, useEffect } from 'react';
import { CloudUpload, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import ResourceCard from './ResourceCard';
import UploadPopup from './UploadPopup';

const Profile = ({ user }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingResource, setEditingResource] = useState(null);
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);

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

    const handleEdit = (resource) => {
        setEditingResource(resource);
        setIsEditPopupOpen(true);
    };

    const handleUpdate = (updatedResource) => {
        setResources(resources.map(r =>
            r.id === updatedResource.id ? updatedResource : r
        ));
    };

    const handleDelete = (resourceId) => {
        setResources(resources.filter(r => r.id !== resourceId));
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
                    <p className="text-gray-200 text-sm">
                        {resources.length} Resources
                    </p>
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
                            <Loader2 className="inline-block animate-spin h-12 w-12 text-blue-600" />
                            <p className="mt-4 text-gray-500">Loading resources...</p>
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {resources.map(resource => (
                                <ResourceCard
                                    key={resource.id}
                                    resource={resource}
                                    currentUser={user}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <CloudUpload className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No uploads yet</h3>
                            <p className="text-gray-500 mb-6">Start by uploading your first resource</p>
                        </div>
                    )}
                </div>
            </div>

            <UploadPopup
                isOpen={isEditPopupOpen}
                onClose={() => {
                    setIsEditPopupOpen(false);
                    setEditingResource(null);
                }}
                editResource={editingResource}
                onUpdate={handleUpdate}
            />
        </>
    );
};

export default Profile;
