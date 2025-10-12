"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users } from "lucide-react"

interface PricingInfo {
  currentPrice: number
  isSale: boolean
  saleCount: number
  maxSaleCount: number
}

export function PricingDisplay() {
  const [pricingInfo, setPricingInfo] = useState<PricingInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const response = await fetch("/api/payments/pricing")
        if (response.ok) {
          const data = await response.json()
          setPricingInfo(data)
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPricing()
  }, [])

  if (isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">価格情報を読み込み中...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (!pricingInfo) {
    return null
  }

  const { currentPrice, isSale, saleCount, maxSaleCount } = pricingInfo
  const remainingSale = maxSaleCount - saleCount

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          広告投稿料金
          {isSale && (
            <Badge variant="destructive" className="animate-pulse">
              セール中
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className="text-4xl font-bold text-primary">
            ¥{currentPrice.toLocaleString()}
          </div>
          {isSale && (
            <div className="text-sm text-muted-foreground line-through">
              通常価格: ¥5,000
            </div>
          )}
        </div>

        {isSale && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>先着{maxSaleCount}投稿限定</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-orange-600 font-medium">
                残り{remainingSale}投稿
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(saleCount / maxSaleCount) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>広告の公開</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>分析ダッシュボード</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>編集・削除機能</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

