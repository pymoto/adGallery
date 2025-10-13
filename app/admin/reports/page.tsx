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
  Calendar
} from "lucide-react"

interface Report {
  id: string
  reason: string
  description: string | null
  status: "pending" | "approved" | "rejected"
  created_at: string
  ad_id: string
  reporter_id: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedReport, setSelectedReport] = useState<Report | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [adminNote, setAdminNote] = useState("")

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
          ad_id,
          reporter_id
        `)
        .order("created_at", { ascending: false })

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter)
      }

      const { data, error } = await query

      if (error) {
        console.error("Error fetching reports:", error)
        return
      }

      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function updateReportStatus(reportId: string, status: "approved" | "rejected") {
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("reports")
        .update({ 
          status,
          admin_note: adminNote || null,
          updated_at: new Date().toISOString()
        })
        .eq("id", reportId)

      if (error) {
        console.error("Error updating report:", error)
        return
      }

      // 通報が承認された場合、広告を非公開にする
      if (status === "approved") {
        const report = reports.find(r => r.id === reportId)
        if (report) {
          await supabase
            .from("ads")
            .update({ is_published: false })
            .eq("id", report.ad_id)
        }
      }

      setAdminNote("")
      setSelectedReport(null)
      fetchReports()
    } catch (error) {
      console.error("Error updating report:", error)
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
              <Card key={report.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6" onClick={() => setSelectedReport(report)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(report.status)}
                        <h3 className="font-semibold">通報 #{report.id}</h3>
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
        <div className="lg:col-span-1">
          {selectedReport ? (
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
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => updateReportStatus(selectedReport.id, "approved")}
                      >
                        承認（非公開）
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateReportStatus(selectedReport.id, "rejected")}
                      >
                        却下
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
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
