import React, { useState, useEffect } from "react"
import { Search } from 'lucide-react'
import UploadPopup from "./UploadPopup"
import ResourceCard from "./ResourceCard"
import { API_BASE_URL } from '../config/api'

const Hero = ({ user }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        performSearch(searchQuery)
      } else {
        setSearchResults([])
        setHasSearched(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const performSearch = async (query) => {
    setIsSearching(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/search?q=${encodeURIComponent(query)}`)

      if (!response.ok) {
        throw new Error('Search failed')
      }

      const data = await response.json()
      setSearchResults(data)
      setHasSearched(true)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    }
  }



  return (
    <>
      <div className="relative h-[70vh] bg-cover bg-center text-white px-4 py-10 flex items-center"
        style={{ backgroundImage: 'url("https://cdn.pixabay.com/photo/2023/10/12/17/56/after-the-rain-8311416_1280.jpg")' }}>
        <div className="absolute inset-0 bg-black/60 z-0"></div>

        <div className="z-10 mx-auto text-center max-w-4xl">
          <div>

            <h1 className="text-4xl sm:text-6xl font-bold mb-8">
              Free web templates, Books & design assets
            </h1>

            <p className="text-xl mb-8 text-gray-200">
              Discover thousands of free resources to build your next project
            </p>

            <form onSubmit={handleSearch} className="flex gap-4 justify-center mb-8">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search NexLoad for free HTML templates, CSS tools, eBooks & more"
                  className="w-full px-6 py-4 rounded-full text-white bg-white/20 backdrop-blur-md focus:outline-none pr-12"
                />
                <button
                  type="submit"
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
                  disabled={isSearching}
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </form>
          </div>
        </div>


      </div>

      <UploadPopup isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />

      {hasSearched && (
        <div className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            {searchResults.length > 0 ? (
              <>
                <h2 className="text-3xl font-bold mb-8">Search Results ({searchResults.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {searchResults.map(resource => (
                    <ResourceCard key={resource.id} resource={resource} />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-3xl font-bold mb-4">No results found for "{searchQuery}"</h2>
                <p className="text-xl text-gray-600 mb-8">
                  We couldn't find any resources matching your search.
                </p>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default Hero
