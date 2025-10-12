"use client"

import { useEffect, useState } from "react"
import { AdCard } from "@/components/ad-card"
import { createClient } from "@/lib/client"
import type { Ad } from "@/lib/types"

interface RelatedAdsProps {
  currentAdId: string
  category: string
}

export function RelatedAds({ currentAdId, category }: RelatedAdsProps) {
  const [relatedAds, setRelatedAds] = useState<Ad[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRelatedAds() {
      const supabase = createClient()
      setIsLoading(true)

      try {
        const { data, error } = await supabase
          .from("ads")
          .select("*")
          .eq("category", category)
          .neq("id", currentAdId)
          .limit(4)

        if (error) {
          console.error("[v0] Error fetching related ads:", error)
          return
        }

        setRelatedAds(data || [])
      } catch (error) {
        console.error("[v0] Error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedAds()
  }, [currentAdId, category])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">関連する広告</h2>
        <p className="text-muted-foreground">読み込み中...</p>
      </div>
    )
  }

  if (relatedAds.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">関連する広告</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {relatedAds.map((ad) => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </div>
  )
}
