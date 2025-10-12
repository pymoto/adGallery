"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Upload, User, Home, Star } from "lucide-react"
import { createClient } from "@/lib/client"
import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
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
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">A</span>
          </div>
          <span className="font-bold text-xl">AdGallery</span>
        </Link>

        <nav className="flex items-center gap-4">
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
              <div className="text-xs text-muted-foreground">ログイン中: {user.email}</div>
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
              <div className="text-xs text-muted-foreground">未ログイン</div>
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
      </div>
    </header>
  )
}
