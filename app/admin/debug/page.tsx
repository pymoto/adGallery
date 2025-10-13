"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function AdminDebugPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDebugInfo() {
      const supabase = createClient()
      
      try {
        // ユーザー情報を取得
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        // プロフィール情報を取得
        let profile = null
        let profileError = null
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single()
          profile = data
          profileError = error
        }

        // 全プロフィールを取得（管理者確認用）
        const { data: allProfiles, error: allProfilesError } = await supabase
          .from("profiles")
          .select("*")

        setDebugInfo({
          user,
          userError,
          profile,
          profileError,
          allProfiles,
          allProfilesError,
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : "Unknown error",
          timestamp: new Date().toISOString()
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDebugInfo()
  }, [])

  const handleSetAdmin = async () => {
    if (!debugInfo?.user?.id) return

    const supabase = createClient()
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: true })
        .eq("id", debugInfo.user.id)

      if (error) {
        console.error("Error setting admin:", error)
        alert("管理者権限の設定に失敗しました: " + error.message)
      } else {
        alert("管理者権限を設定しました。ページを再読み込みしてください。")
        window.location.reload()
      }
    } catch (error) {
      console.error("Error setting admin:", error)
      alert("管理者権限の設定に失敗しました")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>デバッグ情報を読み込み中...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>管理者デバッグ情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">ユーザー情報</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo?.user || "No user", null, 2)}
              </pre>
              {debugInfo?.userError && (
                <div className="text-red-600 mt-2">
                  エラー: {JSON.stringify(debugInfo.userError, null, 2)}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">プロフィール情報</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto">
                {JSON.stringify(debugInfo?.profile || "No profile", null, 2)}
              </pre>
              {debugInfo?.profileError && (
                <div className="text-red-600 mt-2">
                  エラー: {JSON.stringify(debugInfo.profileError, null, 2)}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-semibold mb-2">全プロフィール（管理者確認用）</h3>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto max-h-64">
                {JSON.stringify(debugInfo?.allProfiles || "No profiles", null, 2)}
              </pre>
              {debugInfo?.allProfilesError && (
                <div className="text-red-600 mt-2">
                  エラー: {JSON.stringify(debugInfo.allProfilesError, null, 2)}
                </div>
              )}
            </div>

            {debugInfo?.user && (
              <div className="flex gap-4">
                <Button onClick={handleSetAdmin}>
                  このユーザーを管理者に設定
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => window.location.reload()}
                >
                  ページを再読み込み
                </Button>
              </div>
            )}

            <div className="text-sm text-gray-500">
              最終更新: {debugInfo?.timestamp}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}