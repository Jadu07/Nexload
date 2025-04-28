import React, { useState, useEffect } from "react";
import ResourceCard from "./ResourceCard";
import { supabase } from '../config/supabase';

function LatestResources() {
  const [resourceList, setResourceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 8;

  const fetchResources = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('*')
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (page === 0) {
        setResourceList(data);
      } else {
        setResourceList(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [page]);

  const loadMoreResources = () => {
    setPage(prev => prev + 1);
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        <div className="max-w-3xl mx-auto mb-20">
          <div className="space-y-4 text-center">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight">
              Latest Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover our newest collection of templates, tools, and design assets.
            </p>
            <hr className="w-full border-t border-gray-200 my-8" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {resourceList.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={loadMoreResources}
            disabled={isLoading}
            className="bg-black text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>
    </section>
  );
}

export default LatestResources;
