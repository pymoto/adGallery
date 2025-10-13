// 環境別の設定を管理するファイル

export function getSupabaseConfig() {
  // デバッグ用の環境情報をログ出力
  console.log('Environment config:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_ENV: process.env.VERCEL_ENV,
    hasStagingUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING,
    hasStagingKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING,
    hasStagingServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING,
  })

  // ステージング環境用の設定（Vercelのpreview環境）
  if (process.env.VERCEL_ENV === 'preview') {
    return {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL_STAGING || process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY_STAGING || process.env.SUPABASE_SERVICE_ROLE_KEY,
    }
  }
  
  // 本番環境用の設定（Vercelのproduction環境）
  if (process.env.VERCEL_ENV === 'production') {
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
  // ステージング環境用の設定（Vercelのpreview環境）
  if (process.env.VERCEL_ENV === 'preview') {
    return process.env.NEXT_PUBLIC_SITE_URL_STAGING || process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // 本番環境用の設定（Vercelのproduction環境）
  if (process.env.VERCEL_ENV === 'production') {
    return process.env.NEXT_PUBLIC_SITE_URL_PROD || process.env.NEXT_PUBLIC_SITE_URL
  }
  
  // 開発環境用の設定（デフォルト）
  return process.env.NEXT_PUBLIC_SITE_URL
}

