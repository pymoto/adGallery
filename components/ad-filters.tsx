"use client"

import { Button } from "@/components/ui/button"

const categories = [
  { id: "all", label: "すべて" },
  { id: "fashion", label: "ファッション" },
  { id: "tech", label: "テクノロジー" },
  { id: "food", label: "飲食" },
  { id: "travel", label: "旅行" },
  { id: "beauty", label: "美容" },
  { id: "sports", label: "スポーツ" },
]

interface AdFiltersProps {
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function AdFilters({ selectedCategory, onCategoryChange }: AdFiltersProps) {
  return (
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
  )
}
