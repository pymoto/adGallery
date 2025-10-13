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
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="font-semibold text-blue-800">個人情報保護について</h3>
                </div>
                <p className="text-sm text-blue-700 mb-3">
                  個人情報保護の観点から、事業者情報はユーザーからの請求があった場合のみ公開いたします。
                  以下の情報が必要な場合は、お問い合わせフォームまたはメールにてご請求ください。
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a 
                    href="mailto:support@adscopia.com?subject=特定商取引法に基づく表示の請求"
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    📧 メールで請求
                  </a>
                  <span className="text-sm text-blue-600 self-center">
                    件名：「特定商取引法に基づく表示の請求」
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">事業者名</h3>
                  <p className="text-muted-foreground">ユーザーからの請求があった場合のみ公開</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※個人事業主として運営しています
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">所在地</h3>
                  <p className="text-muted-foreground">ユーザーからの請求があった場合のみ公開</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※事業所として使用している場所を表示します
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">電話番号</h3>
                  <p className="text-muted-foreground">ユーザーからの請求があった場合のみ公開</p>
                  {/* <p className="text-sm text-muted-foreground mt-1">
                    営業時間：平日 9:00-18:00（土日祝日を除く）
                  </p> */}
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">メールアドレス</h3>
                  <p>warabiii.com@gmail.com</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">商品・サービスの名称</h3>
                  <p>Adscopia - 広告デザインギャラリープラットフォーム</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">販売価格</h3>
                  <p>広告投稿料金：500円（セール価格）または5,000円（通常価格）</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※価格は予告なく変更する場合があります
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">支払方法</h3>
                  <p>クレジットカード決済（Stripe）</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※Visa、Mastercard、American Express、JCB等の主要クレジットカードに対応
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">支払時期</h3>
                  <p>広告投稿時（事前決済）</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">商品・サービスの引渡時期</h3>
                  <p>決済完了後、管理者による承認を経て広告が公開されます</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    ※承認には通常1-3営業日程度かかります
                  </p>
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
