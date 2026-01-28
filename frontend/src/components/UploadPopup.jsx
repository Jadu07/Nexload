import React, { useState, useEffect } from 'react'
import { X, XCircle, Image as ImageIcon, CloudUpload, Loader2 } from 'lucide-react'
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

function UploadPopup({ isOpen, onClose, editResource = null, onUpdate = null }) {
  const isEditMode = !!editResource

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

  // Pre-fill form when editing
  useEffect(() => {
    if (editResource) {
      setFormData({
        title: editResource.title || '',
        description: editResource.description || '',
        category: editResource.category || 'templates',
        tags: editResource.tags ? editResource.tags.join(', ') : '',
        file: null,
        image: null
      })
      setImagePreview(editResource.image_url || null)
    } else {
      // Reset form when creating new
      setFormData({
        title: '',
        description: '',
        category: 'templates',
        tags: '',
        file: null,
        image: null
      })
      setImagePreview(null)
    }
    setError(null)
  }, [editResource, isOpen])

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

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isEditMode) {
        // Update existing resource
        let imageUrl = editResource.image_url
        let fileUrl = editResource.file_url

        // Upload new image if provided
        if (formData.image) {
          const imageFileName = `${Date.now()}_${formData.image.name}`
          const { error: imageError } = await supabase
            .storage
            .from('resources')
            .upload(imageFileName, formData.image)

          if (imageError) throw imageError

          const { data: { publicUrl } } = supabase
            .storage
            .from('resources')
            .getPublicUrl(imageFileName)

          imageUrl = publicUrl
        }

        // Upload new file if provided
        if (formData.file) {
          const fileFileName = `${Date.now()}_${formData.file.name}`
          const { error: fileError } = await supabase
            .storage
            .from('resources')
            .upload(fileFileName, formData.file)

          if (fileError) throw fileError

          const { data: { publicUrl } } = supabase
            .storage
            .from('resources')
            .getPublicUrl(fileFileName)

          fileUrl = publicUrl
        }

        const response = await fetch(`${API_BASE_URL}/api/resources/${editResource.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: formData.tags,
            image_url: imageUrl,
            file_path: fileUrl
          }),
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to update resource')
        }

        const updatedResource = await response.json()

        if (onUpdate) {
          onUpdate(updatedResource)
        }

        onClose()
      } else {
        // Create new resource
        if (!formData.image || !formData.file) {
          setError('Please select both an image and a file')
          setIsLoading(false)
          return
        }

        // Upload image to Supabase
        const imageFileName = `${Date.now()}_${formData.image.name}`
        const { data: imageData, error: imageError } = await supabase
          .storage
          .from('resources')
          .upload(imageFileName, formData.image)

        if (imageError) throw imageError

        const { data: { publicUrl: imageUrl } } = supabase
          .storage
          .from('resources')
          .getPublicUrl(imageFileName)

        // Upload file to Supabase
        const fileFileName = `${Date.now()}_${formData.file.name}`
        const { data: fileData, error: fileError } = await supabase
          .storage
          .from('resources')
          .upload(fileFileName, formData.file)

        if (fileError) throw fileError

        const { data: { publicUrl: fileUrl } } = supabase
          .storage
          .from('resources')
          .getPublicUrl(fileFileName)

        // Save to backend
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: formData.tags,
            image_url: imageUrl,
            file_path: fileUrl
          })
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Upload failed')
        }

        // Reset form
        setFormData({
          title: '',
          description: '',
          category: 'templates',
          tags: '',
          file: null,
          image: null
        })
        setImagePreview(null)
        onClose()
        window.location.reload()
      }
    } catch (error) {
      console.error('Error:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200 z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {isEditMode ? 'Edit Resource' : 'Upload Resource'}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {isEditMode ? 'Update your resource details' : 'Share your work with the community'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-2 hover:bg-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-8 mt-6 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 flex items-start gap-3">
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
              placeholder="Resource name"
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
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 resize-none transition-all"
              placeholder="Brief description..."
              required
            />
            <p className="mt-2 text-xs text-gray-400 text-right">
              {formData.description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>

          {/* Category and Tags */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white transition-all"
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
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                placeholder="e.g., minimal, dark"
              />
            </div>
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Cover Image {isEditMode && <span className="text-xs text-gray-500">(optional - leave blank to keep current)</span>}
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
                    <ImageIcon className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
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
                  required={!isEditMode}
                />
              </label>
            )}
          </div>

          {/* Resource File */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Resource File {isEditMode && <span className="text-xs text-gray-500">(optional - leave blank to keep current)</span>}
            </label>
            <label className="cursor-pointer group block">
              <div className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-gray-200 rounded-xl group-hover:border-blue-400 transition-all bg-gray-50 group-hover:bg-blue-50/50">
                <div className="text-center">
                  <CloudUpload className="mx-auto h-8 w-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                  <p className="mt-1 text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                    {formData.file ? formData.file.name : isEditMode ? 'Click to change file' : 'Click to upload'}
                  </p>
                </div>
              </div>
              <input
                type="file"
                name="file"
                onChange={handleFileChange}
                className="hidden"
                required={!isEditMode}
              />
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
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
                  <Loader2 className="animate-spin h-5 w-5" />
                  {isEditMode ? 'Updating...' : 'Uploading...'}
                </span>
              ) : (isEditMode ? 'Update' : 'Upload')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UploadPopup
