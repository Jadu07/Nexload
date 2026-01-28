import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config/api';
import ResourceCard from './ResourceCard';

const categoriesData = {
    templates: { name: 'Templates', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=3269&auto=format&fit=crop' },
    books: { name: 'Books', image: 'https://images.unsplash.com/photo-1605647601778-865aeff15565?q=80&w=3130&auto=format&fit=crop' },
    icons: { name: 'Icons', image: 'https://images.unsplash.com/photo-1659738943713-92e7cb7fc087?q=80&w=3028&auto=format&fit=crop' },
    tools: { name: 'Tools', image: 'https://images.unsplash.com/photo-1614585849038-272ee92d30fa?q=80&w=3270&auto=format&fit=crop' },
    fonts: { name: 'Fonts', image: 'https://images.unsplash.com/photo-1602832168038-3675d9a5cff7?q=80&w=3270&auto=format&fit=crop' },
    themes: { name: 'Themes', image: 'https://images.unsplash.com/photo-1605127605051-126cba2a73d8?q=80&w=3270&auto=format&fit=crop' },
    plugins: { name: 'Plugins', image: 'https://images.unsplash.com/photo-1655931546450-77dc6f3155aa?q=80&w=3270&auto=format&fit=crop' },
    graphics: { name: 'Graphics', image: 'https://images.unsplash.com/photo-1684503830891-27e71ff697e3?q=80&w=3101&auto=format&fit=crop' }
};

const CategoryPage = ({ categoryId }) => {
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const category = categoriesData[categoryId] || { name: categoryId, image: '' };

    useEffect(() => {
        const fetchResources = async () => {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/api/resources?limit=1000`);
            if (response.ok) {
                const data = await response.json();
                setResources(data.filter(r => r.category === categoryId));
            }
            setLoading(false);
        };
        fetchResources();
    }, [categoryId]);

    return (
        <>
            <div className="relative h-[50vh] bg-cover bg-center text-white px-4 py-10 flex items-center justify-center" style={{ backgroundImage: `url("${category.image}")` }}>
                <div className="absolute inset-0 bg-black/60"></div>
                <div className="relative z-10 text-center max-w-4xl mx-auto">
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 tracking-tight uppercase">{category.name}</h1>
                    <p className="text-lg text-gray-200">{resources.length} resources available</p>
                </div>
            </div>
            <div className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 className="inline-block animate-spin h-12 w-12 text-blue-600" />
                            <p className="mt-4 text-gray-500">Loading resources...</p>
                        </div>
                    ) : resources.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {resources.map(resource => <ResourceCard key={resource.id} resource={resource} />)}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No resources yet</h3>
                            <p className="text-gray-500">Be the first to upload a {category.name.toLowerCase()} resource!</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CategoryPage;
