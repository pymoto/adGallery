"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, User, Home, Star, Menu, X } from "lucide-react"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        
        if (mounted) {
          setUser(user)
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error getting user:", error)
        if (mounted) {
          setUser(null)
          setIsLoading(false)
        }
      }
    }

    // 初回のみ認証状態を取得
    getUser()

    // 認証状態変更の監視は無効化（モックでは不要）
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      // モック環境では認証状態変更イベントを無視
      console.log("Auth state change ignored in mock mode:", event)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl hidden sm:block">Adscopia</span>
        </Link>

        {/* デスクトップナビゲーション */}
        <nav className="hidden md:flex items-center gap-4">
          <Button variant="ghost" size="sm" className="gap-2" asChild>
            <Link href="/">
              <Home className="w-4 h-4" />
              ホーム
            </Link>
          </Button>
          {user && (
            <Button variant="ghost" size="sm" className="gap-2" asChild>
              <Link href="/favorites">
                <Star className="w-4 h-4" />
                お気に入り
              </Link>
            </Button>
          )}
          <ThemeToggle />
          {isLoading ? (
            <div className="text-sm text-muted-foreground">読み込み中...</div>
          ) : user ? (
            <>
              <div className="text-xs text-muted-foreground hidden lg:block">ログイン中: {user.email}</div>
              <Button variant="ghost" size="sm" className="gap-2" asChild>
                <Link href="/mypage">
                  <User className="w-4 h-4" />
                  マイページ
                </Link>
              </Button>
              <Button size="sm" className="gap-2" asChild>
                <Link href="/upload">
                  <Upload className="w-4 h-4" />
                  広告を投稿
                </Link>
              </Button>
            </>
          ) : (
            <>
              <div className="text-xs text-muted-foreground hidden lg:block">未ログイン</div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/auth/login">ログイン</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/auth/sign-up">新規登録</Link>
              </Button>
              <Button size="sm" className="gap-2" asChild>
                <Link href="/auth/sign-up">
                  <Upload className="w-4 h-4" />
                  広告を投稿
                </Link>
              </Button>
            </>
          )}
        </nav>

        {/* モバイルメニューボタン */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <Home className="w-4 h-4" />
                ホーム
              </Link>
            </Button>
            {user && (
              <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
                <Link href="/favorites" onClick={() => setIsMobileMenuOpen(false)}>
                  <Star className="w-4 h-4" />
                  お気に入り
                </Link>
              </Button>
            )}
            {isLoading ? (
              <div className="text-sm text-muted-foreground px-3 py-2">読み込み中...</div>
            ) : user ? (
              <>
                <div className="text-xs text-muted-foreground px-3 py-2">
                  ログイン中: {user.email}
                </div>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2" asChild>
                  <Link href="/mypage" onClick={() => setIsMobileMenuOpen(false)}>
                    <User className="w-4 h-4" />
                    マイページ
                  </Link>
                </Button>
                <Button size="sm" className="w-full gap-2" asChild>
                  <Link href="/upload" onClick={() => setIsMobileMenuOpen(false)}>
                    <Upload className="w-4 h-4" />
                    広告を投稿
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <div className="text-xs text-muted-foreground px-3 py-2">未ログイン</div>
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>ログイン</Link>
                </Button>
                <Button size="sm" className="w-full" asChild>
                  <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>新規登録</Link>
                </Button>
                <Button size="sm" className="w-full gap-2" asChild>
                  <Link href="/auth/sign-up" onClick={() => setIsMobileMenuOpen(false)}>
                    <Upload className="w-4 h-4" />
                    広告を投稿
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
