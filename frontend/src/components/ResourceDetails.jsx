import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Download, Loader2, Share2, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import { supabase } from '../config/supabase';

export default function ResourceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resource, setResource] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchResource = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/api/resources/${id}`);
                if (!response.ok) throw new Error('Failed to fetch resource');
                setResource(await response.json());
            } catch (err) {
                setError("Resource not found or has been removed.");
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchResource();
    }, [id]);

    const handleDownload = async () => {
        if (!resource) return;
        setIsDownloading(true);
        try {
            const filePath = resource.file_url.includes('resources/')
                ? decodeURIComponent(resource.file_url.match(/resources\/([^?#]+)/)[1])
                : resource.file_url;

            const { data, error } = await supabase.storage
                .from('resources')
                .createSignedUrl(filePath, 60);

            if (error || !data?.signedUrl) throw new Error('Failed to generate URL');

            // Optimistic update
            setResource(prev => ({ ...prev, downloads: (prev?.downloads || 0) + 1 }));

            await supabase.from('resources')
                .update({ downloads: resource.downloads + 1 })
                .eq('id', resource.id);

            window.open(data.signedUrl, '_blank');
        } catch (error) {
            alert('Failed to download resource. Please try again later.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: resource.title,
            text: resource.description,
            url: window.location.href,
        };
        try {
            if (navigator.share) await navigator.share(shareData);
            else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        } catch (err) { /* Silent fail */ }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-black animate-spin mb-3" />
                <p className="text-gray-500 text-sm font-medium">Loading...</p>
            </div>
        );
    }

    if (error || !resource) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
                <div className="text-center max-w-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Resource Not Found</h2>
                    <p className="text-gray-500 mb-6 text-sm">{error || "This resource may have been deleted."}</p>
                    <button onClick={() => navigate('/')} className="px-5 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="h-[35vh] relative bg-gray-900 overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-40 blur-sm scale-110" style={{ backgroundImage: `url("${resource.image_url}")` }}></div>
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80"></div>
                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
                    <div className="max-w-3xl pt-8">
                        <div className="flex items-center gap-3 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase">
                            <span>{resource.category}</span>
                            <ChevronRight className="w-3 h-3 text-gray-500" />
                            <span className="text-gray-400">Resource Details</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight">
                            {resource.title}
                        </h1>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white p-1.5 rounded-xl shadow-lg border border-gray-100/50">
                            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 relative group">
                                <img src={resource.image_url} alt={resource.title} className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Description</h3>
                            <div className="prose prose-sm prose-gray max-w-none text-gray-600">
                                <p className="whitespace-pre-line leading-relaxed">{resource.description}</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-4">
                            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                                <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-50">
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Downloads</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{resource.downloads?.toLocaleString() || 0}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium text-right">License</p>
                                        <p className="text-base font-bold text-gray-900 mt-1 text-right">Free</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={handleDownload}
                                        disabled={isDownloading}
                                        className="w-full bg-black hover:bg-gray-900 text-white py-3.5 px-4 rounded-lg font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isDownloading ? (
                                            <>
                                                <Loader2 className="animate-spin w-4 h-4" />
                                                <span>Processing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Download className="w-4 h-4" />
                                                <span>Download Now</span>
                                            </>
                                        )}
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className="w-full bg-white border border-gray-200 text-gray-700 py-3 px-4 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        <span>Share</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                                {resource.user?.image ? (
                                    <img src={resource.user.image} alt={resource.author} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                        {resource.author?.charAt(0) || 'N'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm font-bold text-gray-900">{resource.user?.displayName || resource.author || 'NexLoad User'}</p>
                                    <p className="text-xs text-gray-500">Author • {new Date(resource.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {resource.tags?.length > 0 && (
                                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tags</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {resource.tags.map((tag, idx) => (
                                            <span key={idx} className="inline-block px-2.5 py-1 bg-gray-50 text-gray-600 rounded-md text-xs font-medium border border-gray-100">
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}