// 環境別の設定を管理するファイル

export function getSupabaseConfig() {
  const isProduction = process.env.NODE_ENV === 'production'
  const isStaging = process.env.VERCEL_ENV === 'preview' || process.env.VERCEL_ENV === 'development'
  
  // ステージング環境用の設定
  if (isStaging) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING || process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  
  // 本番環境用の設定
  if (isProduction) {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_PROD || process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_PROD || process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  
  // 開発環境用の設定（デフォルト）
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
}

export function getSiteUrl() {
  const isStaging = process.env.VERCEL_ENV === 'preview'
  
  if (isStaging) {
    return process.env.NEXT_PUBLIC_SITE_URL_STAGING || process.env.NEXT_PUBLIC_SITE_URL
  }
  
  return process.env.NEXT_PUBLIC_SITE_URL
}
