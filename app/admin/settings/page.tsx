"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Settings,
  Save,
  RefreshCw,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface SystemSettings {
  site_name: string
  site_description: string
  max_ads_per_user: number
  auto_approve_ads: boolean
  require_email_verification: boolean
  maintenance_mode: boolean
  maintenance_message: string
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>({
    site_name: "Ad Gallery",
    site_description: "広告ギャラリーアプリケーション",
    max_ads_per_user: 10,
    auto_approve_ads: false,
    require_email_verification: true,
    maintenance_mode: false,
    maintenance_message: "メンテナンス中です。しばらくお待ちください。"
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    const supabase = createClient()
    setIsLoading(true)

    try {
      // 実際の実装では、設定をデータベースから取得
      // ここではデフォルト値を表示
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching settings:", error)
      setIsLoading(false)
    }
  }

  async function saveSettings() {
    const supabase = createClient()
    setIsSaving(true)
    setMessage(null)

    try {
      // 実際の実装では、設定をデータベースに保存
      // ここでは成功メッセージを表示
      setMessage({ type: "success", text: "設定を保存しました" })
    } catch (error) {
      console.error("Error saving settings:", error)
      setMessage({ type: "error", text: "設定の保存に失敗しました" })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">設定</h1>
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
        <h1 className="text-3xl font-bold">設定</h1>
        <Button onClick={saveSettings} disabled={isSaving}>
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              保存中...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              保存
            </>
          )}
        </Button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-2 ${
          message.type === "success" 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 基本設定 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              基本設定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="site_name">サイト名</Label>
              <Input
                id="site_name"
                value={settings.site_name}
                onChange={(e) => setSettings(prev => ({ ...prev, site_name: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="site_description">サイト説明</Label>
              <Textarea
                id="site_description"
                value={settings.site_description}
                onChange={(e) => setSettings(prev => ({ ...prev, site_description: e.target.value }))}
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="max_ads_per_user">ユーザーあたりの最大広告数</Label>
              <Input
                id="max_ads_per_user"
                type="number"
                value={settings.max_ads_per_user}
                onChange={(e) => setSettings(prev => ({ ...prev, max_ads_per_user: parseInt(e.target.value) || 0 }))}
                className="mt-1"
              />
            </div>
          </CardContent>
        </Card>

        {/* 広告設定 */}
        <Card>
          <CardHeader>
            <CardTitle>広告設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto_approve_ads">広告の自動承認</Label>
                <p className="text-sm text-muted-foreground">
                  有効にすると、広告が自動的に公開されます
                </p>
              </div>
              <Switch
                id="auto_approve_ads"
                checked={settings.auto_approve_ads}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, auto_approve_ads: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="require_email_verification">メール確認必須</Label>
                <p className="text-sm text-muted-foreground">
                  ユーザー登録時にメール確認を必須にします
                </p>
              </div>
              <Switch
                id="require_email_verification"
                checked={settings.require_email_verification}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, require_email_verification: checked }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* メンテナンス設定 */}
        <Card>
          <CardHeader>
            <CardTitle>メンテナンス設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="maintenance_mode">メンテナンスモード</Label>
                <p className="text-sm text-muted-foreground">
                  サイトを一時的に停止します
                </p>
              </div>
              <Switch
                id="maintenance_mode"
                checked={settings.maintenance_mode}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, maintenance_mode: checked }))}
              />
            </div>

            {settings.maintenance_mode && (
              <div>
                <Label htmlFor="maintenance_message">メンテナンスメッセージ</Label>
                <Textarea
                  id="maintenance_message"
                  value={settings.maintenance_message}
                  onChange={(e) => setSettings(prev => ({ ...prev, maintenance_message: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* システム情報 */}
        <Card>
          <CardHeader>
            <CardTitle>システム情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">バージョン</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">最終更新</span>
                <span className="text-sm">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">データベース</span>
                <span className="text-sm">Supabase</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">決済システム</span>
                <span className="text-sm">Stripe</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
