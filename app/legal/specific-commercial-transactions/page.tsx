"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function SpecificCommercialTransactionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">特定商取引法に基づく表示</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">事業者名</h3>
                  <p>山田太郎（個人事業主）</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※個人事業主として運営しています
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">所在地</h3>
                  <p>〒389-0103<br />長野県軽井沢町軽井沢1-2-3（仮）</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※事業所として使用している場所を表示しています
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">電話番号</h3>
                  <p>03-1234-5678（仮）</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    営業時間：平日 9:00-18:00（土日祝日を除く）
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">メールアドレス</h3>
                  <p>support@adgallery.com（仮）</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">商品・サービスの名称</h3>
                  <p>広告投稿サービス</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">販売価格</h3>
                  <p>広告投稿料金：500円（セール価格）または5,000円（通常価格）</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">支払方法</h3>
                  <p>クレジットカード決済（Stripe）</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">支払時期</h3>
                  <p>広告投稿時（事前決済）</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">商品・サービスの引渡時期</h3>
                  <p>決済完了後、即座に広告が公開されます</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">返品・交換について</h3>
                  <p>デジタルコンテンツの性質上、返品・交換はお受けできません。ただし、システムの不具合等によりサービスが提供できない場合は、全額返金いたします。</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">その他</h3>
                  <p>本サービスは広告投稿プラットフォームであり、投稿された広告の内容については投稿者の責任となります。</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  最終更新日：2024年10月12日
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
