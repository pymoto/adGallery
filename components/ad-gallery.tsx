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

  useEffect(() => {
    async function fetchAds() {
      setIsLoading(true)

      try {
        const params = new URLSearchParams()
        if (selectedCategory !== "all") params.append("category", selectedCategory)
        if (searchQuery.trim()) params.append("q", searchQuery.trim())
        if (selectedTag.trim()) params.append("tag", selectedTag.trim())

        const url = `/api/ads/search${params.toString() ? `?${params.toString()}` : ''}`
        const response = await fetch(url)
        const result = await response.json()

        if (!response.ok) {
          console.error("Search error:", result.error, result.details)
          setAds([])
          return
        }

        setAds(result.ads || [])
      } catch (error) {
        console.error("Search error:", error)
        setAds([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAds()
  }, [selectedCategory, searchQuery, selectedTag])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleTagSearch = (tag: string) => {
    setSelectedTag(tag)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <EnhancedAdFilters 
          selectedCategory={selectedCategory} 
          onCategoryChange={setSelectedCategory}
          onSearch={handleSearch}
          onTagSearch={handleTagSearch}
          searchQuery={searchQuery}
          selectedTag={selectedTag}
        />
        <div className="text-center py-12">
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EnhancedAdFilters 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory}
        onSearch={handleSearch}
        onTagSearch={handleTagSearch}
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
        <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4" style={{ columnFill: 'balance' }}>
          {ads.map((ad) => (
            <div key={ad.id} className="break-inside-avoid mb-4">
              <AdCard ad={ad} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
