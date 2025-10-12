// 環境変数の判定とメッセージ管理

export const isDevelopment = process.env.NODE_ENV === 'development'
export const isProduction = process.env.NODE_ENV === 'production'

// 開発者向けメッセージの表示制御
export const shouldShowDevMessage = isDevelopment

// 環境に応じたメッセージ
export const getEmailConfirmationMessage = () => {
  if (isDevelopment) {
    return {
      title: "開発者向け：",
      message: "開発環境でメール確認を無効にするには、Supabaseダッシュボード → Authentication → Providers → Email → \"Confirm email\"をOFFにしてください。"
    }
  } else {
    return {
      title: "メール確認が必要です",
      message: "登録したメールアドレスを確認してください。"
    }
  }
}
