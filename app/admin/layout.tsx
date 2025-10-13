"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  LayoutDashboard, 
  Flag, 
  Users, 
  Image, 
  Settings,
  Shield,
  LogOut,
  Menu,
  X
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient()
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      console.log("Admin auth check - User:", user)
      console.log("Admin auth check - User error:", userError)
      
      if (!user) {
        console.log("No user found, redirecting to login")
        router.push("/auth/login")
        return
      }

      // 管理者権限チェック
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      console.log("Admin auth check - Profile:", profile)
      console.log("Admin auth check - Profile error:", profileError)
      console.log("Admin auth check - User ID:", user?.id)
      console.log("Admin auth check - User email:", user?.email)

      if (profileError) {
        console.error("Profile fetch error:", profileError)
        console.error("Profile error details:", JSON.stringify(profileError, null, 2))
        
        // プロフィールが存在しない場合は作成を試行
        if (profileError.code === 'PGRST116' || profileError.message?.includes('No rows')) {
          console.log("Profile not found, creating new profile")
          
          const { data: newProfile, error: createError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              email: user.email || '',
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              is_admin: false
            })
            .select()
            .single()

          if (createError) {
            console.error("Profile creation error:", createError)
            router.push("/")
            setIsLoading(false)
            return
          }

          console.log("Profile created, but not admin")
          router.push("/")
          setIsLoading(false)
          return
        }
        
        router.push("/")
        setIsLoading(false)
        return
      }

      if (profile?.is_admin) {
        console.log("Admin access granted")
        setIsAdmin(true)
        setIsAuthenticated(true)
      } else {
        console.log("Admin access denied - not admin")
        router.push("/")
      }
      
      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">認証中...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">アクセス拒否</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              管理者権限が必要です。
            </p>
            <Button onClick={() => router.push("/")} className="w-full">
              ホームに戻る
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "ダッシュボード" },
    { href: "/admin/reports", icon: Flag, label: "通報管理" },
    { href: "/admin/users", icon: Users, label: "ユーザー管理" },
    { href: "/admin/ads", icon: Image, label: "広告管理" },
    { href: "/admin/grant-admin", icon: Shield, label: "管理者権限付与" },
    { href: "/admin/settings", icon: Settings, label: "設定" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* モバイル用ヘッダー */}
      <div className="lg:hidden bg-card border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">管理者パネル</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* サイドバー */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-200 ease-in-out`}>
          <div className="flex flex-col h-full">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">管理者パネル</h2>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.href}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      router.push(item.href)
                      setSidebarOpen(false)
                    }}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}
            </nav>

            <div className="p-4 border-t">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-4 w-4" />
                ログアウト
              </Button>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>

      {/* モバイル用オーバーレイ */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
