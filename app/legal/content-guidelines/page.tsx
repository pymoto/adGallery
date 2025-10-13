"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { AlertTriangle, Shield, Eye, Flag } from "lucide-react"

export default function ContentGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Shield className="h-6 w-6" />
                投稿ガイドライン
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">投稿前に必ずお読みください</h3>
                </div>
                <p className="text-sm text-blue-700">
                  すべての投稿は、以下のガイドラインに従ってください。不適切なコンテンツは削除される場合があります。
                  投稿された広告は管理者による承認が必要です。承認には通常1-3営業日程度かかります。
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    禁止事項
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-red-800 mb-2">違法・有害なコンテンツ</h4>
                      <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                        <li>暴力、脅迫、ハラスメントを助長する内容</li>
                        <li>差別的、攻撃的な表現</li>
                        <li>未成年者に不適切な内容</li>
                        <li>違法行為を助長する内容</li>
                        <li>自殺、自傷行為を助長する内容</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-red-800 mb-2">スパム・詐欺</h4>
                      <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                        <li>虚偽の情報や誇大広告</li>
                        <li>スパム、フィッシング、詐欺的な内容</li>
                        <li>無断転載、著作権侵害</li>
                        <li>個人情報の不正取得</li>
                        <li>マルチレベルマーケティング（MLM）</li>
                      </ul>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-red-800 mb-2">不適切な画像・動画</h4>
                      <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
                        <li>ヌード、性的な内容</li>
                        <li>暴力的、グロテスクな画像</li>
                        <li>他人の顔や個人情報が含まれる画像（許可なし）</li>
                        <li>低品質、不適切な画像</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-500" />
                    推奨事項
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-medium text-green-800 mb-2">高品質なコンテンツ</h4>
                      <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                        <li>明確で読みやすい画像</li>
                        <li>適切なタイトルと説明</li>
                        <li>関連性の高いタグ</li>
                        <li>創造的で魅力的な内容</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <h4 className="font-medium text-green-800 mb-2">コミュニティへの配慮</h4>
                      <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                        <li>他者への敬意と礼儀</li>
                        <li>建設的なフィードバック</li>
                        <li>多様性とインクルージョンの尊重</li>
                        <li>安全で快適な環境の維持</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Flag className="h-5 w-5 text-orange-500" />
                    通報システム
                  </h3>
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-sm text-orange-700 mb-2">
                      不適切なコンテンツを発見した場合は、以下の方法で通報してください：
                    </p>
                    <ul className="text-sm text-orange-700 space-y-1 list-disc list-inside">
                      <li>各広告の「通報」ボタンを使用</li>
                      <li>support@adscopia.com にメール送信</li>
                      <li>具体的な理由と共に通報してください</li>
                      <li>通報されたコンテンツは管理者が確認し、適切に対処します</li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">違反時の対応</h3>
                  <div className="space-y-2">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <h4 className="font-medium text-gray-800 mb-1">軽微な違反</h4>
                      <p className="text-sm text-gray-700">警告とコンテンツの修正依頼</p>
                    </div>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                      <h4 className="font-medium text-yellow-800 mb-1">中程度の違反</h4>
                      <p className="text-sm text-yellow-700">一時的な投稿制限（1-7日）</p>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <h4 className="font-medium text-red-800 mb-1">重大な違反</h4>
                      <p className="text-sm text-red-700">アカウントの永久停止</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    最終更新日：2024年10月12日<br />
                    このガイドラインは、コミュニティの安全と品質を維持するために定められています。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
