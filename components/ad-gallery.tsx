"use client"

import { useState, useEffect, useCallback, useRef } from "react"
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
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const fetchAds = useCallback(async (page: number, isInitial = false) => {
    console.log("fetchAds called:", { page, isInitial })
    
    if (isInitial) {
      setIsLoading(true)
      setIsInitialLoad(true)
    } else {
      setIsLoadingMore(true)
    }
    setError(null)
    
    // フォールバック機能のヘルパー関数
    const showFallbackAds = () => {
      console.log("Showing fallback ads due to error")
      const fallbackAds = [
        {
          id: "00000000-0000-0000-0000-000000000001",
          title: "サンプル広告1",
          company: "サンプル会社",
          description: "これはサンプル広告です。",
          category: "tech",
          tags: ["サンプル", "テクノロジー"],
          image_url: "https://picsum.photos/400/300?random=1",
          link_url: "https://example.com",
          created_at: new Date().toISOString(),
          views: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 20),
          is_published: true
        },
        {
          id: "00000000-0000-0000-0000-000000000002",
          title: "サンプル広告2",
          company: "サンプル会社2",
          description: "これはサンプル広告です。",
          category: "fashion",
          tags: ["サンプル", "ファッション"],
          image_url: "https://picsum.photos/400/300?random=2",
          link_url: "https://example.com",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          views: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 20),
          is_published: true
        }
      ]
      setAds(fallbackAds)
      setIsInitialLoad(false)
      setError("データベースの応答が遅いため、サンプル広告を表示しています。")
      setIsLoading(false)
      setIsLoadingMore(false)
    }

    try {
      const params = new URLSearchParams()
      if (selectedCategory !== "all") params.append("category", selectedCategory)
      if (searchQuery.trim()) params.append("q", searchQuery.trim())
      if (selectedTag.trim()) params.append("tag", selectedTag.trim())
      params.append("limit", "20")
      params.append("offset", (page * 20).toString())
      params.append("_t", Date.now().toString()) // キャッシュバスター

      const url = `/api/ads/search${params.toString() ? `?${params.toString()}` : ''}`
      
      // タイムアウト設定
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30秒でタイムアウト
      
      const response = await fetch(url, {
        signal: controller.signal,
        cache: 'no-store', // キャッシュを無効化
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      clearTimeout(timeoutId)
      const result = await response.json()

      if (!response.ok) {
        const errorMessage = result.error || "広告の取得に失敗しました"
        console.error("Search error:", errorMessage)
        showFallbackAds()
        return
      }

      const newAds = result.ads || []
      
      // データが空の場合のフォールバック
      if (newAds.length === 0 && isInitial) {
        console.warn("No ads returned, using fallback data")
        // ローカルフォールバックデータ
        const fallbackAds = [
          {
            id: "00000000-0000-0000-0000-000000000001",
            title: "サンプル広告1",
            company: "サンプル会社",
            category: "tech",
            image_url: "https://picsum.photos/400/300?random=1",
            link_url: "https://example.com",
            created_at: new Date().toISOString(),
            views: Math.floor(Math.random() * 100),
            likes: Math.floor(Math.random() * 20)
          },
          {
            id: "00000000-0000-0000-0000-000000000002", 
            title: "サンプル広告2",
            company: "サンプル会社2",
            category: "fashion",
            image_url: "https://picsum.photos/400/300?random=2",
            link_url: "https://example.com",
            created_at: new Date(Date.now() - 86400000).toISOString(),
            views: Math.floor(Math.random() * 100),
            likes: Math.floor(Math.random() * 20)
          },
          {
            id: "00000000-0000-0000-0000-000000000003",
            title: "サンプル広告3",
            company: "サンプル会社3",
            description: "これはサンプル広告です。",
            category: "food",
            tags: ["サンプル", "フード"],
            image_url: "https://picsum.photos/400/300?random=3",
            link_url: "https://example.com",
            created_at: new Date(Date.now() - 172800000).toISOString(),
            views: Math.floor(Math.random() * 100),
            likes: Math.floor(Math.random() * 20),
            is_published: true
          }
        ]
        setAds(fallbackAds)
        setIsInitialLoad(false)
        setHasMore(false)
        return
      }
      
      if (isInitial) {
        setAds(newAds)
        setIsInitialLoad(false)
      } else {
        setAds(prev => [...prev, ...newAds])
      }
      
      setHasMore(newAds.length === 20)
    } catch (error) {
      console.error("Search error:", error instanceof Error ? error.message : "Unknown error")
      showFallbackAds()
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [selectedCategory, searchQuery, selectedTag])

  // 初期読み込み
  useEffect(() => {
    setCurrentPage(0)
    setHasMore(true)
    
    // デバッグ用のログ
    console.log("Initial load starting...")
    
    fetchAds(0, true).catch((error) => {
      console.error("Initial fetch error:", error)
      // 初期読み込みエラー時のフォールバック
      const fallbackAds = [
        {
          id: "00000000-0000-0000-0000-000000000001",
          title: "サンプル広告1",
          company: "サンプル会社",
          category: "tech",
          image_url: "https://picsum.photos/400/300?random=1",
          link_url: "https://example.com",
          created_at: new Date().toISOString(),
          views: Math.floor(Math.random() * 100),
          likes: Math.floor(Math.random() * 20)
        }
      ]
      setAds(fallbackAds)
      setIsInitialLoad(false)
      setError("データベースの応答が遅いため、サンプル広告を表示しています。")
    })
  }, [selectedCategory, searchQuery, selectedTag, fetchAds])

  // 無限スクロール用のIntersection Observer
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
          const nextPage = currentPage + 1
          setCurrentPage(nextPage)
          fetchAds(nextPage, false)
        }
      },
      { threshold: 0.1 }
    )

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, isLoadingMore, currentPage, fetchAds])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag)
  }

  const handleTagSearch = (tag: string) => {
    setSelectedTag(tag)
  }

  if (isLoading && ads.length === 0 && isInitialLoad) {
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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">広告を読み込み中...</p>
        </div>
      </div>
    )
  }

  // エラー時でも広告が表示されている場合は、エラーメッセージを表示しない
  if (error && ads.length === 0) {
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
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
            <p className="text-orange-800 font-medium">⚠️ データベース接続エラー</p>
            <p className="text-orange-700 text-sm mt-2">{error}</p>
            <p className="text-orange-600 text-xs mt-1">
              現在、サンプル広告を表示しています。しばらく待ってから再試行してください。
            </p>
          </div>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={() => {
                setError(null)
                setCurrentPage(0)
                setHasMore(true)
                fetchAds(0, true)
              }} 
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 再試行
            </button>
            <button 
              onClick={() => {
                setError(null)
                window.location.reload()
              }} 
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              🔄 ページリロード
            </button>
          </div>
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
      
      {/* エラー時でも広告が表示されている場合の通知 */}
      {error && ads.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
          <p className="text-yellow-800 text-sm">
            ⚠️ データベース接続に問題があります。現在、サンプル広告を表示しています。
          </p>
          <button 
            onClick={() => {
              setError(null)
              setCurrentPage(0)
              setHasMore(true)
              fetchAds(0, true)
            }} 
            className="mt-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
          >
            🔄 再試行
          </button>
        </div>
      )}

      {ads.length === 0 && !isLoading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery || selectedTag ? "検索条件に一致する広告が見つかりませんでした" : "広告が見つかりませんでした"}
          </p>
        </div>
      ) : (
        <>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-3 sm:gap-4" style={{ columnFill: 'balance' }}>
            {ads.map((ad, index) => (
              <div 
                key={ad.id} 
                className="break-inside-avoid mb-3 sm:mb-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out forwards',
                  opacity: 0
                }}
              >
                <AdCard ad={ad} />
              </div>
            ))}
          </div>
          
          {/* 無限スクロールのトリガー要素 */}
          <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
            {isLoadingMore && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-muted-foreground">読み込み中...</span>
              </div>
            )}
            {!hasMore && ads.length > 0 && (
              <p className="text-muted-foreground text-sm">すべての広告を表示しました</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
