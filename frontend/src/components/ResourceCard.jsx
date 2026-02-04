import React, { useState } from "react";
import { Download, Loader2, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../config/supabase';
import { API_BASE_URL } from '../config/api';

export default function ResourceCard({ resource, currentUser, onEdit, onDelete }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const MAX_DESCRIPTION_LENGTH = 60;

  const isOwner = currentUser && resource.userId === currentUser.id;

  const truncateDescription = (text) => {
    if (!text) return '';
    return text.length > MAX_DESCRIPTION_LENGTH
      ? text.substring(0, MAX_DESCRIPTION_LENGTH) + '...'
      : text;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {

      const filePath = resource.file_url.includes('resources/')
        ? decodeURIComponent(resource.file_url.match(/resources\/([^?#]+)/)[1])
        : resource.file_url;

      const { data, error } = await supabase
        .storage
        .from('resources')
        .createSignedUrl(filePath, 60);

      if (error) throw error;
      if (!data?.signedUrl) throw new Error('Failed to generate signed URL');

      const { error: updateError } = await supabase
        .from('resources')
        .update({ downloads: resource.downloads + 1 })
        .eq('id', resource.id);

      if (updateError) throw updateError;

      window.open(data.signedUrl, '_blank');
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download resource. Please try again later.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this resource?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/resources/${resource.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      if (onDelete) {
        onDelete(resource.id);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete resource. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <img
          src={resource.image_url}
          alt={resource.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 left-3">
          <span className="text-xs font-medium text-white px-2 py-1 bg-black/50 rounded-md">
            {resource.category}
          </span>
        </div>
        {isOwner && (
          <div className="absolute top-3 right-3 flex gap-2">
            <button
              onClick={() => onEdit(resource)}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              title="Edit resource"
            >
              <Edit2 className="w-4 h-4 text-gray-700" />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors"
              title="Delete resource"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-medium text-lg mb-2">
          {resource.title}
        </h3>

        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span>{resource.author}</span>
          <span>{resource.downloads.toLocaleString()} downloads</span>
        </div>

        <p className="text-gray-600 text-sm mb-4">
          {truncateDescription(resource.description)}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {resource.tags.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className="w-full bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isDownloading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
