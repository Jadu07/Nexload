import React, { useState, useEffect } from "react";
import { supabase } from '../config/supabase';

const categoriesData = [
  {
    id: 'templates',
    name: 'Templates',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?q=80&w=3269&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'books',
    name: 'Books',
    image: 'https://images.unsplash.com/photo-1605647601778-865aeff15565?q=80&w=3130&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'icons',
    name: 'Icons',
    image: 'https://images.unsplash.com/photo-1659738943713-92e7cb7fc087?q=80&w=3028&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'tools',
    name: 'Tools',
    image: 'https://images.unsplash.com/photo-1614585849038-272ee92d30fa?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'fonts',
    name: 'Fonts',
    image: 'https://images.unsplash.com/photo-1602832168038-3675d9a5cff7?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'themes',
    name: 'Themes',
    image: 'https://images.unsplash.com/photo-1605127605051-126cba2a73d8?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'plugins',
    name: 'Plugins',
    image: 'https://images.unsplash.com/photo-1655931546450-77dc6f3155aa?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  },
  {
    id: 'graphics',
    name: 'Graphics',
    image: 'https://images.unsplash.com/photo-1684503830891-27e71ff697e3?q=80&w=3101&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    count: 0
  }
];

function Categories() {
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('resources')
        .select('category')
        .then(async ({ data, error }) => {
          if (error) throw error;
          
          const counts = {};
          data.forEach(item => counts[item.category] = (counts[item.category] || 0) + 1);

          const updatedCategories = categoriesData.map(cat => ({
            ...cat,
            count: counts[cat.id] || 0
          }));

          setCategories(updatedCategories);
        });
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="max-w-3xl mx-auto mb-20">
          <div className="space-y-4 text-center">
           
            
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Browse Categories
            </h2>
            
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our handpicked collection of premium resources for your next project
            </p>
            <hr></hr>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <div 
              key={category.id}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[4/3]">
                <img 
                  src={category.image} 
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-200">{category.count} resources</p>
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
