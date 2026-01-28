import React, { useState } from 'react'
import { API_BASE_URL } from '../config/api'
import { supabase } from '../config/supabase'

const categories = [
  { id: 'templates', name: 'Templates' },
  { id: 'books', name: 'Books' },
  { id: 'icons', name: 'Icons' },
  { id: 'tools', name: 'Tools' },
  { id: 'fonts', name: 'Fonts' },
  { id: 'themes', name: 'Themes' },
  { id: 'plugins', name: 'Plugins' },
  { id: 'graphics', name: 'Graphics' }
]

const MAX_DESCRIPTION_LENGTH = 60

function UploadPopup({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'templates',
    tags: '',
    file: null,
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'description' && value.length > MAX_DESCRIPTION_LENGTH) {
      return
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!formData.file || !formData.image) {
        throw new Error("File and Cover Image are required")
      }

      const imageExt = formData.image.name.split('.').pop()
      const imageName = `${Math.random().toString(36).slice(2)}.${imageExt}`
      const imagePath = `images/${imageName}`
      const { data: imageData, error: imageError } = await supabase.storage
        .from('covers')
        .upload(imagePath, formData.image)

      if (imageError) throw imageError

      const { data: { publicUrl: imageUrl } } = supabase.storage
        .from('covers')
        .getPublicUrl(imagePath)

      const fileExt = formData.file.name.split('.').pop()
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`
      const filePath = `files/${fileName}`

      const { data: fileData, error: fileError } = await supabase.storage
        .from('resources')
        .upload(filePath, formData.file)

      if (fileError) throw fileError

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        image_url: imageUrl,
        file_path: filePath
      }

      const response = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload resource')
      }

      onClose()
      window.location.reload()
    } catch (error) {
      console.error('Upload error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Upload Resource</h2>
              <p className="text-sm text-gray-500 mt-0.5">Share your work with the community</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
              placeholder="e.g., Modern Landing Page Template"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              maxLength={MAX_DESCRIPTION_LENGTH}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 resize-none transition-all bg-gray-50 focus:bg-white"
              placeholder="Briefly describe your resource..."
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-gray-400">Keep it short and descriptive</p>
              <p className="text-xs font-medium text-gray-500">
                {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
              </p>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-gray-50 focus:bg-white transition-all appearance-none cursor-pointer"
                required
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-400 transition-all bg-gray-50 focus:bg-white"
                placeholder="minimal, modern"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Cover Image
            </label>
            {imagePreview ? (
              <label className="cursor-pointer group block">
                <div className="w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm group-hover:border-blue-400 transition-all relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                    <p className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-lg">
                      Click to change
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            ) : (
              <label className="cursor-pointer group block">
                <div className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-blue-400 transition-all bg-gray-50 group-hover:bg-blue-50/50">
                  <div className="text-center">
                    <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-1 text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                      Click to upload
                    </p>
                  </div>
                </div>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  required
                />
              </label>
            )}
          </div>

          {/* Resource File */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Resource File
            </label>
            <label className="cursor-pointer group block">
              <div className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-blue-400 transition-all bg-gray-50 group-hover:bg-blue-50/50">
                <div className="text-center">
                  <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="mt-1 text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                    {formData.file ? formData.file.name : 'Click to upload'}
                  </p>
                </div>
              </div>
              <input
                type="file"
                name="file"
                onChange={(e) => setFormData(prev => ({ ...prev, file: e.target.files[0] }))}
                className="hidden"
                required
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-semibold disabled:opacity-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 font-semibold transition-all shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 disabled:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPopup
