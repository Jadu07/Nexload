import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';

const categoriesData = [
  { id: 'templates', name: 'Templates', image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=3269&auto=format&fit=crop' },
  { id: 'books', name: 'Books', image: 'https://images.unsplash.com/photo-1605647601778-865aeff15565?q=80&w=3130&auto=format&fit=crop' },
  { id: 'icons', name: 'Icons', image: 'https://images.unsplash.com/photo-1659738943713-92e7cb7fc087?q=80&w=3028&auto=format&fit=crop' },
  { id: 'tools', name: 'Tools', image: 'https://images.unsplash.com/photo-1614585849038-272ee92d30fa?q=80&w=3270&auto=format&fit=crop' },
  { id: 'fonts', name: 'Fonts', image: 'https://images.unsplash.com/photo-1602832168038-3675d9a5cff7?q=80&w=3270&auto=format&fit=crop' },
  { id: 'themes', name: 'Themes', image: 'https://images.unsplash.com/photo-1605127605051-126cba2a73d8?q=80&w=3270&auto=format&fit=crop' },
  { id: 'plugins', name: 'Plugins', image: 'https://images.unsplash.com/photo-1655931546450-77dc6f3155aa?q=80&w=3270&auto=format&fit=crop' },
  { id: 'graphics', name: 'Graphics', image: 'https://images.unsplash.com/photo-1684503830891-27e71ff697e3?q=80&w=3101&auto=format&fit=crop' }
];

function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('resources').select('category');
      const counts = data?.reduce((acc, item) => ({ ...acc, [item.category]: (acc[item.category] || 0) + 1 }), {}) || {};
      setCategories(categoriesData.map(cat => ({ ...cat, count: counts[cat.id] || 0 })));
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">Browse Categories</h2>
          <p className="text-xl text-gray-600">Explore our handpicked collection of premium resources</p>
          <hr className="mt-6" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="group cursor-pointer" onClick={() => navigate(`/${cat.id}`)}>
              <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{cat.name}</h3>
                    <p className="text-sm text-gray-200">{cat.count} resources</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Categories;
