"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* サービス情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AdGallery</h3>
            <p className="text-sm text-muted-foreground">
              美しい広告を投稿・共有できるプラットフォーム
            </p>
          </div>

          {/* サービス */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">サービス</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-muted-foreground hover:text-foreground transition-colors">
                  広告を投稿
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-muted-foreground hover:text-foreground transition-colors">
                  お気に入り
                </Link>
              </li>
              <li>
                <Link href="/mypage" className="text-muted-foreground hover:text-foreground transition-colors">
                  マイページ
                </Link>
              </li>
            </ul>
          </div>

          {/* サポート */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">サポート</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/auth/login" className="text-muted-foreground hover:text-foreground transition-colors">
                  ログイン
                </Link>
              </li>
              <li>
                <Link href="/auth/sign-up" className="text-muted-foreground hover:text-foreground transition-colors">
                  新規登録
                </Link>
              </li>
              <li>
                <a href="mailto:support@adgallery.com" className="text-muted-foreground hover:text-foreground transition-colors">
                  お問い合わせ
                </a>
              </li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">法的情報</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/legal/terms-of-service" className="text-muted-foreground hover:text-foreground transition-colors">
                  利用規約
                </Link>
              </li>
              <li>
                <Link href="/legal/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">
                  プライバシーポリシー
                </Link>
              </li>
              <li>
                <Link href="/legal/specific-commercial-transactions" className="text-muted-foreground hover:text-foreground transition-colors">
                  特定商取引法に基づく表示
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 AdGallery. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/legal/terms-of-service" className="hover:text-foreground transition-colors">
                利用規約
              </Link>
              <Link href="/legal/privacy-policy" className="hover:text-foreground transition-colors">
                プライバシー
              </Link>
              <Link href="/legal/specific-commercial-transactions" className="hover:text-foreground transition-colors">
                特定商取引法
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
