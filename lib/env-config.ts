// 環境別の設定を管理するファイル

export function getSupabaseConfig() {
  // デバッグ用の環境情報をログ出力
  console.log('Environment config:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    hasStagingUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING,
    hasStagingKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING,
    hasStagingServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING,
    hasDefaultUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasDefaultKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  })

  // ステージング用環境変数が設定されている場合は優先使用
  if (process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING) {
    console.log('Using staging environment variables')
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING || process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  
  // デフォルトの環境変数を使用
  console.log('Using default environment variables')
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export function getSiteUrl() {
  // ステージング用環境変数が設定されている場合は優先使用
  if (process.env.NEXT_PUBLIC_SITE_URL_STAGING) {
    return process.env.NEXT_PUBLIC_SITE_URL_STAGING
  }
  
  // 本番環境用の設定（Vercelのproduction環境）
  if (process.env.VERCEL_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SITE_URL_PROD || process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // 開発環境用の設定（デフォルト）
  return process.env.NEXT_PUBLIC_SITE_URL
}

