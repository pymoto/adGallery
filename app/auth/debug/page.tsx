'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/client'

export default function AuthDebug() {
  const [authInfo, setAuthInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient()
        
        // 現在のセッション情報を取得
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        // 現在のユーザー情報を取得
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        setAuthInfo({
          session: session ? {
            access_token: session.access_token ? '***exists***' : 'none',
            refresh_token: session.refresh_token ? '***exists***' : 'none',
            expires_at: session.expires_at,
            expires_in: session.expires_in,
            token_type: session.token_type,
            user: session.user ? {
              id: session.user.id,
              email: session.user.email,
              email_confirmed_at: session.user.email_confirmed_at,
              created_at: session.user.created_at
            } : null
          } : null,
          user: user ? {
            id: user.id,
            email: user.email,
            email_confirmed_at: user.email_confirmed_at,
            created_at: user.created_at
          } : null,
          sessionError,
          userError,
          environment: {
            nodeEnv: process.env.NODE_ENV,
            vercelEnv: process.env.VERCEL_ENV,
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
            supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '***configured***' : 'not configured'
          }
        })
      } catch (error) {
        console.error('Auth debug error:', error)
        setAuthInfo({ error: error.message })
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">認証情報を取得中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">認証デバッグ情報</h1>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">環境情報</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(authInfo?.environment, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">セッション情報</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(authInfo?.session, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">ユーザー情報</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(authInfo?.user, null, 2)}
          </pre>
        </div>

        {authInfo?.sessionError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <h3 className="text-red-800 font-semibold">セッションエラー</h3>
            <pre className="text-red-700 text-sm mt-2">
              {JSON.stringify(authInfo.sessionError, null, 2)}
            </pre>
          </div>
        )}

        {authInfo?.userError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <h3 className="text-red-800 font-semibold">ユーザーエラー</h3>
            <pre className="text-red-700 text-sm mt-2">
              {JSON.stringify(authInfo.userError, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            ホームに戻る
          </a>
        </div>
      </div>
    </div>
  )
}
