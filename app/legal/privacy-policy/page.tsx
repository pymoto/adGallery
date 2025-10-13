"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">プライバシーポリシー</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">1. 個人情報の収集について</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスでは、以下の個人情報を収集する場合があります：
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>メールアドレス（ユーザー登録時）</li>
                    <li>パスワード（ユーザー登録時）</li>
                    <li>広告投稿時の画像・テキスト情報</li>
                    <li>決済情報（Stripe経由で安全に処理）</li>
                    <li>アクセスログ・利用状況データ</li>
                    <li>お気に入り・いいね等の行動データ</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">2. 個人情報の利用目的</h3>
                  <p className="text-sm text-muted-foreground">
                    収集した個人情報は以下の目的で利用します：
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>ユーザー認証・アカウント管理</li>
                    <li>広告投稿・表示サービス</li>
                    <li>決済処理</li>
                    <li>お気に入り・いいね機能</li>
                    <li>分析・統計データの作成</li>
                    <li>サービス改善・機能開発</li>
                    <li>お客様サポート</li>
                    <li>不正利用の防止</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">3. 個人情報の第三者提供</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、以下の場合を除き、個人情報を第三者に提供することはありません：
                  </p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside ml-4 space-y-1">
                    <li>法令に基づく場合</li>
                    <li>本人の同意がある場合</li>
                    <li>決済処理のためのStripe等の信頼できる第三者サービス</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">4. 個人情報の管理</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、個人情報の漏洩、滅失、毀損の防止その他の安全管理のために必要かつ適切な措置を講じます。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">5. Cookieの使用</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスでは、ユーザーエクスペリエンスの向上のため、Cookieを使用する場合があります。Cookieの設定は、ブラウザの設定で変更できます。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">6. 個人情報の開示・訂正・削除</h3>
                  <p className="text-sm text-muted-foreground">
                    ユーザーは、自己の個人情報について、開示、訂正、削除を求めることができます。これらの要求については、合理的な期間内に対応いたします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">7. プライバシーポリシーの変更</h3>
                  <p className="text-sm text-muted-foreground">
                    当サービスは、必要に応じて本プライバシーポリシーを変更する場合があります。変更後のプライバシーポリシーは、当サービスに掲載した時点で効力を生じるものとします。
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">8. お問い合わせ</h3>
                  <p className="text-sm text-muted-foreground">
                    個人情報の取扱いに関するお問い合わせは、以下までご連絡ください：
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    メール：warabiii.com@gmail.com<br />
                  </p>
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
