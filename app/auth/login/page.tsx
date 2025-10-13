"use client"

import type React from "react"

import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting login with:", { email, password: "***" })
      
      // 実際のSupabase認証を使用
      console.log("Using actual Supabase authentication")
      
      
      // 現在のURLに基づいてリダイレクトURLを設定
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/callback`
        : '/auth/callback'
      
      const result = await supabase.auth.signInWithPassword({
        email,
        password,
        options: {
          redirectTo: redirectUrl
        }
      })
      
      console.log("Login response:", result)
      
      // エラーの詳細を確認
      if (result.error) {
        console.error("Login error details:", {
          message: result.error.message,
          status: result.error.status,
          error: result.error
        })
        setError(result.error.message || "ログインに失敗しました")
        return
      }
      
      // データの存在確認
      if (!result.data) {
        console.error("No data in response")
        setError("ログイン応答にデータがありません")
        return
      }
      
      if (!result.data.user) {
        console.error("No user in response data")
        setError("ユーザー情報を取得できませんでした")
        return
      }
      
      console.log("Login successful, redirecting...")
      // ページをリロードして認証状態を更新
      window.location.href = "/"
    } catch (error: unknown) {
      console.error("Login catch error:", error)
      console.error("Error type:", typeof error)
      console.error("Error constructor:", error?.constructor?.name)
      
      let errorMessage = "予期しないエラーが発生しました"
      
      if (error instanceof Error) {
        errorMessage = error.message
      } else if (typeof error === 'object' && error !== null) {
        if ('message' in error) {
          errorMessage = String((error as any).message)
        } else if ('toString' in error) {
          errorMessage = String(error)
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">ログイン</CardTitle>
            <CardDescription>メールアドレスとパスワードを入力してログインしてください</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">メールアドレス</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">パスワード</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "ログイン中..." : "ログイン"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                アカウントをお持ちでない方は{" "}
                <Link href="/auth/sign-up" className="underline underline-offset-4">
                  新規登録
                </Link>
              </div>
              
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
