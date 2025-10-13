"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { 
  Flag, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  User,
  Calendar,
  Image as ImageIcon,
  Tag,
  ExternalLink
} from "lucide-react"
import Image from "next/image"

interface Report {
  id: string
  reason: string
  description: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
  updated_at?: string
  admin_note?: string | null
  ad_id: string
  reporter_id: string
}

interface AdDetails {
  id: string
  title: string
  company: string
  description: string
  image_url: string
  link_url: string | null
  category: string
  tags: string[]
  views: number
  likes: number
  created_at: string
  user_id: string
  is_published: boolean
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [selectedAdDetails, setSelectedAdDetails] = useState<AdDetails | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [adminNote, setAdminNote] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    fetchReports()
  }, [statusFilter])

  async function fetchReports() {
    const supabase = createClient()
    setIsLoading(true)

    try {
      let query = supabase
        .from("reports")
        .select(`
          id,
          reason,
          description,
          status,
          created_at,
          updated_at,
          admin_note,
          ad_id,
          reporter_id
        `)
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        if (statusFilter === "processed") {
          // 処理済み = 承認済みまたは却下済み
          query = query.in("status", ["approved", "rejected"])
        } else {
          query = query.eq("status", statusFilter)
        }
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching reports:", error)
        return
      }

      console.log("Fetched reports:", data)
      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function fetchAdDetails(adId: string) {
    const supabase = createClient()

    try {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .eq("id", adId)
        .single()

      if (error) {
        console.error("Error fetching ad details:", error)
        return
      }

      setSelectedAdDetails(data)
    } catch (error) {
      console.error("Error fetching ad details:", error)
    }
  }

  const handleReportSelect = (report: Report) => {
    console.log("Selected report:", report)
    setSelectedReport(report)
    fetchAdDetails(report.ad_id)
  }

  async function updateReportStatus(reportId: string, status: "approved" | "rejected") {
    const supabase = createClient()
    setIsUpdating(true)
    setMessage(null)

    try {
      // 認証状態を確認
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      console.log("Auth check:", { user: user?.id, authError })
      
      // 管理者権限を確認
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single()
        
        console.log("Admin check:", { profile, profileError, isAdmin: profile?.is_admin })
        
        // 管理者権限がない場合はエラー
        if (!profile?.is_admin) {
          console.error("User is not admin")
          setMessage({ type: "error", text: "管理者権限がありません" })
          return
        }
      }
      
      console.log(`Updating report ${reportId} to ${status}`)
      console.log("Report ID type:", typeof reportId)
      console.log("Report ID value:", reportId)
      console.log("Update data:", { 
        status, 
        admin_note: adminNote || null, 
        updated_at: new Date().toISOString() 
      })
      
      // まず、該当する通報が存在するかチェック
      const { data: existingReport, error: checkError } = await supabase
        .from("reports")
        .select("id, status")
        .eq("id", reportId)
        .single()
      
      console.log("Existing report check:", { existingReport, checkError })
      console.log("Looking for report ID:", reportId)
      console.log("Found report ID:", existingReport?.id)
      console.log("ID match:", existingReport?.id === reportId)
      console.log("Check error details:", {
        code: checkError?.code,
        message: checkError?.message,
        details: checkError?.details,
        hint: checkError?.hint
      })
      
      if (checkError) {
        console.error("Report not found:", checkError)
        setMessage({ type: "error", text: `通報が見つかりません: ${checkError.message}` })
        return
      }
      
      if (!existingReport) {
        console.error("No report found with ID:", reportId)
        setMessage({ type: "error", text: "通報が見つかりませんでした" })
        return
      }
      
      // 最小限の更新データのみを使用
      const updateData = {
        status
      }
      
      console.log("Update data (minimal):", updateData)
      
      const { data, error } = await supabase
        .from("reports")
        .update(updateData)
        .eq("id", reportId)
        .select()

      console.log("Update result:", { data, error })
      console.log("Update result details:", {
        dataLength: data?.length,
        errorCode: error?.code,
        errorMessage: error?.message,
        errorDetails: error?.details,
        errorHint: error?.hint
      })

      if (error) {
        console.error("Error updating report:", error)
        setMessage({ type: "error", text: `通報の更新に失敗しました: ${error.message}` })
        return
      }

      if (!data || data.length === 0) {
        console.error("No rows updated")
        console.error("Update failed - no data returned")
        console.error("This could be due to:")
        console.error("1. RLS (Row Level Security) blocking the update")
        console.error("2. The report ID doesn't exist")
        console.error("3. Permission issues")
        setMessage({ type: "error", text: "通報の更新に失敗しました。データベースに該当する通報が見つかりません。RLSの設定を確認してください。" })
        return
      }

      console.log("Report updated successfully:", data[0])

      // 通報が承認された場合、広告を非公開にする
      if (status === "approved") {
        const report = reports.find(r => r.id === reportId)
        if (report) {
          console.log(`Hiding ad ${report.ad_id}`)
          const { error: adError } = await supabase
            .from("ads")
            .update({ is_published: false })
            .eq("id", report.ad_id)
          
          if (adError) {
            console.error("Error hiding ad:", adError)
            setMessage({ type: "error", text: `通報は更新されましたが、広告の非公開化に失敗しました: ${adError.message}` })
            return
          }
        }
      }

      setMessage({ 
        type: "success", 
        text: status === "approved" ? "通報を承認し、広告を非公開にしました" : "通報を却下しました" 
      })
      
      console.log("Success message set:", status === "approved" ? "承認" : "却下")
      
      setAdminNote("")
      setSelectedReport(null)
      setSelectedAdDetails(null)
      
      // メッセージを3秒後に消去
      setTimeout(() => {
        setMessage(null)
      }, 3000)
      
      fetchReports()
    } catch (error) {
      console.error("Error updating report:", error)
      setMessage({ type: "error", text: `予期しないエラーが発生しました: ${error instanceof Error ? error.message : "Unknown error"}` })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="secondary">未処理</Badge>
      case "approved":
        return <Badge variant="destructive">承認</Badge>
      case "rejected":
        return <Badge variant="outline">却下</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">通報管理</h1>
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
        <h1 className="text-3xl font-bold">通報管理</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="ステータスでフィルタ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="pending">未処理</SelectItem>
            <SelectItem value="approved">承認済み</SelectItem>
            <SelectItem value="rejected">却下済み</SelectItem>
            <SelectItem value="processed">処理済み</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 通報一覧 */}
        <div className="lg:col-span-2 space-y-4">
          {reports.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">通報はありません</p>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card 
                key={report.id} 
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  report.status === "approved" || report.status === "rejected" 
                    ? "bg-gray-50 border-gray-200" 
                    : ""
                }`}
              >
                <CardContent className="p-6" onClick={() => handleReportSelect(report)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(report.status)}
                        <h3 className="font-semibold">通報 #{report.id.slice(0, 8)}...</h3>
                        {getStatusBadge(report.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        通報理由: {report.reason}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          通報者ID: {report.reporter_id}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* 通報詳細 */}
        <div className="lg:col-span-1 space-y-4">
          {selectedReport ? (
            <>
              {/* 通報情報 */}
              <Card>
                <CardHeader>
                  <CardTitle>通報詳細</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">通報情報</h4>
                    <div className="space-y-2">
                      <p className="text-sm"><strong>理由:</strong> {selectedReport.reason}</p>
                      {selectedReport.description && (
                        <p className="text-sm"><strong>詳細:</strong> {selectedReport.description}</p>
                      )}
                      <p className="text-sm"><strong>通報ID:</strong> {selectedReport.id}</p>
                      <p className="text-sm"><strong>広告ID:</strong> {selectedReport.ad_id}</p>
                      <p className="text-sm"><strong>通報者ID:</strong> {selectedReport.reporter_id}</p>
                      <p className="text-sm"><strong>日時:</strong> {new Date(selectedReport.created_at).toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedReport.status === "pending" && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">管理者メモ</label>
                        <Textarea
                          placeholder="対応内容を記入してください"
                          value={adminNote}
                          onChange={(e) => setAdminNote(e.target.value)}
                          className="mt-1"
                        />
                      </div>
                      
                      {message && (
                        <div
                          className={`p-3 rounded-lg text-sm ${
                            message.type === "success"
                              ? "bg-green-50 text-green-700 border border-green-200"
                              : "bg-red-50 text-red-700 border border-red-200"
                          }`}
                        >
                          {message.text}
                        </div>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => updateReportStatus(selectedReport.id, "approved")}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "処理中..." : "承認（非公開）"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateReportStatus(selectedReport.id, "rejected")}
                          disabled={isUpdating}
                        >
                          {isUpdating ? "処理中..." : "却下"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {(selectedReport.status === "approved" || selectedReport.status === "rejected") && (
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          {selectedReport.status === "approved" ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <h4 className="font-semibold">
                            {selectedReport.status === "approved" ? "承認済み" : "却下済み"}
                          </h4>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {selectedReport.status === "approved" 
                            ? "この通報は承認され、広告は非公開になりました。" 
                            : "この通報は却下されました。"
                          }
                        </p>
                        {selectedReport.admin_note && (
                          <p className="text-sm mt-2 p-2 bg-white rounded border">
                            <strong>管理者メモ:</strong> {selectedReport.admin_note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-2">
                          処理日時: {new Date(selectedReport.updated_at || selectedReport.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 広告詳細情報 */}
              {selectedAdDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5" />
                      通報された広告
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* 広告画像 */}
                    <div className="relative">
                      <Image
                        src={selectedAdDetails.image_url || "/placeholder.svg"}
                        alt={selectedAdDetails.title}
                        width={300}
                        height={200}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant={selectedAdDetails.is_published ? "default" : "destructive"}>
                          {selectedAdDetails.is_published ? "公開中" : "非公開"}
                        </Badge>
                      </div>
                    </div>

                    {/* 広告基本情報 */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{selectedAdDetails.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedAdDetails.company}</p>
                      <p className="text-sm">{selectedAdDetails.description}</p>
                    </div>

                    {/* カテゴリとタグ */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {selectedAdDetails.category === "fashion" && "ファッション"}
                          {selectedAdDetails.category === "tech" && "テクノロジー"}
                          {selectedAdDetails.category === "food" && "飲食"}
                          {selectedAdDetails.category === "travel" && "旅行"}
                          {selectedAdDetails.category === "beauty" && "美容"}
                          {selectedAdDetails.category === "sports" && "スポーツ"}
                        </Badge>
                      </div>
                      
                      {selectedAdDetails.tags && selectedAdDetails.tags.length > 0 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          <Tag className="h-4 w-4 text-muted-foreground" />
                          {selectedAdDetails.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 統計情報 */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span>閲覧数: {selectedAdDetails.views}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>いいね: {selectedAdDetails.likes}</span>
                      </div>
                    </div>

                    {/* 外部リンク */}
                    {selectedAdDetails.link_url && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        <a 
                          href={selectedAdDetails.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline truncate"
                        >
                          {selectedAdDetails.link_url}
                        </a>
                      </div>
                    )}

                    {/* 作成日時 */}
                    <div className="text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 inline mr-1" />
                      作成日: {new Date(selectedAdDetails.created_at).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Flag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">通報を選択してください</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
