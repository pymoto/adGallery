"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SearchBar } from "@/components/search-bar"
import { createClient } from "@/lib/client"
import { X } from "lucide-react"

const categories = [
  { id: "all", label: "すべて" },
  { id: "fashion", label: "ファッション" },
  { id: "tech", label: "テクノロジー" },
  { id: "food", label: "飲食" },
  { id: "travel", label: "旅行" },
  { id: "beauty", label: "美容" },
  { id: "sports", label: "スポーツ" },
]

interface EnhancedAdFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
  onSearch: (query: string) => void
  onTagSearch: (tag: string) => void
  searchQuery: string
  selectedTag: string
}

export function EnhancedAdFilters({ 
  selectedCategory, 
  onCategoryChange, 
  onSearch, 
  onTagSearch,
  searchQuery,
  selectedTag 
}: EnhancedAdFiltersProps) {
  const [popularTags, setPopularTags] = useState<string[]>([])

  useEffect(() => {
    const fetchPopularTags = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("ads")
        .select("tags")
      
      if (data) {
        // nullを除外して全タグをフラット化してカウント
        const allTags = data
          .filter(ad => ad.tags && ad.tags.length > 0)
          .flatMap(ad => ad.tags || [])
        
        const tagCounts = allTags.reduce((acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1
          return acc
        }, {} as Record<string, number>)
        
        // 人気順でソートして上位10個を取得
        const sortedTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => (b as number) - (a as number))
          .slice(0, 10)
          .map(([tag]) => tag)
        
        setPopularTags(sortedTags)
      }
    }

    fetchPopularTags()
  }, [])

  return (
    <div className="space-y-6">
      {/* 検索バー */}
      <SearchBar 
        onSearch={onSearch}
        placeholder="タイトル、説明、会社名で検索..."
        className="max-w-md"
      />

      {/* カテゴリフィルター */}
      <div>
        <h3 className="text-sm font-medium mb-3">カテゴリ</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => onCategoryChange(category.id)}
              className="rounded-full"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* 人気タグ */}
      {popularTags.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-3">人気タグ</h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "secondary"}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => onTagSearch(tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* アクティブフィルターの表示 */}
      {(searchQuery || selectedTag) && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">アクティブフィルター:</span>
          {searchQuery && (
            <Badge variant="outline" className="gap-1">
              <span>検索: {searchQuery}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-muted"
                onClick={() => onSearch("")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
          {selectedTag && (
            <Badge variant="outline" className="gap-1">
              <span>タグ: {selectedTag}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-muted"
                onClick={() => onTagSearch("")}
              >
                <X className="w-3 h-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
