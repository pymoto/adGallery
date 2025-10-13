"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Users, 
  Search,
  Shield,
  ShieldOff,
  Mail,
  Calendar,
  Image as ImageIcon
} from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  is_admin: boolean
  created_at: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")

  useEffect(() => {
    fetchUsers()
  }, [searchQuery, roleFilter])

  async function fetchUsers() {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // まず現在のユーザー情報を確認
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      console.log("Current user:", user)
      console.log("User error:", userError)

      // プロフィールテーブルの存在確認
      const { data: testData, error: testError } = await supabase
        .from("profiles")
        .select("count")
        .limit(1)
      
      console.log("Profiles table test:", testData, testError)

      let query = supabase
        .from("profiles")
        .select(`
          id,
          email,
          name,
          is_admin,
          created_at
        `)
        .order("created_at", { ascending: false })

      if (searchQuery.trim()) {
        query = query.or(`name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      }

      if (roleFilter !== "all") {
        query = query.eq("is_admin", roleFilter === "admin")
      }
      
      console.log("Query filters:", { searchQuery, roleFilter })

      const { data, error } = await query
      
      console.log("Filtered users before display:", data)

      if (error) {
        console.error("Error fetching users:", error)
        console.error("Error details:", JSON.stringify(error, null, 2))
        return
      }

      console.log("Fetched users:", data)
      console.log("Users count:", data?.length || 0)
      console.log("All users details:", data)
      setUsers(data || [])
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleAdminStatus(userId: string, currentStatus: boolean) {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_admin: !currentStatus })
        .eq("id", userId)

      if (error) {
        console.error("Error updating user:", error)
        return
      }

      fetchUsers()
    } catch (error) {
      console.error("Error updating user:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">ユーザー管理</h1>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">ユーザー管理</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ユーザーを検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="ロール" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">すべて</SelectItem>
              <SelectItem value="admin">管理者</SelectItem>
              <SelectItem value="user">一般ユーザー</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 統計カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">総ユーザー数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">管理者数</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => user.is_admin).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">一般ユーザー</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users.filter(user => !user.is_admin).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ユーザー一覧 */}
      <Card>
        <CardHeader>
          <CardTitle>ユーザー一覧</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 p-2 bg-gray-100 rounded text-sm">
            <strong>Debug Info:</strong> Users length: {users.length}, Loading: {isLoading.toString()}
            <br />
            <strong>Users data:</strong> {JSON.stringify(users, null, 2)}
          </div>
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">ユーザーが見つかりません</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => {
                console.log("Rendering user:", user)
                return (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium">
                        {user.name?.charAt(0)?.toUpperCase() || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{user.name || "名前未設定"}</h3>
                        {user.is_admin && (
                          <Badge variant="destructive" className="text-xs">
                            管理者
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          登録: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                    >
                      {user.is_admin ? (
                        <>
                          <ShieldOff className="h-4 w-4 mr-1" />
                          管理者権限を削除
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-1" />
                          管理者権限を付与
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
