"use client"

import { useState, useEffect } from "react"
import { AdCard } from "@/components/ad-card"
import { EnhancedAdFilters } from "@/components/enhanced-ad-filters"
import { createClient } from "@/lib/client"
import type { Ad } from "@/lib/types"

export function AdGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [selectedTag, setSelectedTag] = useState<string>("")
  const [ads, setAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    async function fetchAds() {
      setIsLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "all") params.append("category", selectedCategory)
        if (searchQuery.trim()) params.append("q", searchQuery.trim())
        if (selectedTag.trim()) params.append("tag", selectedTag.trim())
        params.append("limit", "20")
        params.append("offset", (currentPage * 20).toString())

        const url = `/api/ads/search${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url)
        const result = await response.json()

        if (!response.ok) {
          console.error("Search error:", result.error, result.details)
          setError(result.error || "広告の取得に失敗しました")
          setAds([])
          return
        }

        const newAds = result.ads || []
        if (currentPage === 0) {
          setAds(newAds)
        } else {
          setAds(prev => [...prev, ...newAds])
        }
        
        setHasMore(newAds.length === 20)
      } catch (error) {
        console.error("Search error:", error)
        setError("ネットワークエラーが発生しました")
        setAds([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAds()
  }, [selectedCategory, searchQuery, selectedTag, currentPage])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(0)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(0)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
    setCurrentPage(0)
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const handleTagSearch = (tag: string) => {
    setSelectedTag(tag)
  }

  if (isLoading && ads.length === 0) {
    return (
      <div className="space-y-6">
        <EnhancedAdFilters 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          onTagSearch={handleTagChange}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <EnhancedAdFilters 
          selectedCategory={selectedCategory} 
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          onTagSearch={handleTagChange}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
        />
        <div className="text-center py-12">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            再読み込み
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EnhancedAdFilters 
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}
        onSearch={handleSearch}
        onTagSearch={handleTagChange}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
      />

      {ads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedTag ? "検索条件に一致する広告が見つかりませんでした" : "広告が見つかりませんでした"}
          </p>
        </div>
      ) : (
        <>
          <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4" style={{ columnFill: 'balance' }}>
            {ads.map((ad) => (
              <div key={ad.id} className="break-inside-avoid mb-4">
                <AdCard ad={ad} />
              </div>
            ))}
          </div>
          
          {hasMore && (
            <div className="text-center py-8">
              <button
                onClick={loadMore}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "読み込み中..." : "さらに読み込む"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
