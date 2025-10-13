# 環境設定ガイド

## データベース分離設定

### 1. Supabaseプロジェクト作成

#### ステージング環境
1. Supabaseダッシュボードで新しいプロジェクトを作成
2. プロジェクト名: `adscopia-staging`
3. データベースパスワードを設定
4. リージョンを選択

#### 本番環境
1. 別のSupabaseプロジェクトを作成
2. プロジェクト名: `adscopia-production`
3. データベースパスワードを設定
4. リージョンを選択

### 2. Vercel環境変数設定

#### ステージング環境用
```bash
# ステージング用Supabase設定
NEXT_PUBLIC_SUPABASE_URL_STAGING=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_STAGING=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY_STAGING=your-staging-service-role-key

# ステージング用サイトURL
NEXT_PUBLIC_SITE_URL_STAGING=https://your-staging-domain.vercel.app
```

#### 本番環境用
```bash
# 本番用Supabase設定
NEXT_PUBLIC_SUPABASE_URL_PROD=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY_PROD=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY_PROD=your-production-service-role-key

# 本番用サイトURL
NEXT_PUBLIC_SITE_URL_PROD=https://your-production-domain.com
```

### 3. データベースセットアップ

#### ステージング環境
1. ステージング用SupabaseプロジェクトのSQL Editorを開く
2. `scripts/staging-database-setup.sql`の内容を実行
3. 管理者ユーザーを作成（必要に応じて）

#### 本番環境
1. 本番用SupabaseプロジェクトのSQL Editorを開く
2. 本番用のスキーマを適用
3. 管理者ユーザーを作成

### 4. 認証設定

#### ステージング環境
- **Site URL**: `https://your-staging-domain.vercel.app`
- **Redirect URLs**: 
  - `https://your-staging-domain.vercel.app/auth/callback`
  - `https://your-staging-domain.vercel.app/auth/sign-up-success`

#### 本番環境
- **Site URL**: `https://your-production-domain.com`
- **Redirect URLs**: 
  - `https://your-production-domain.com/auth/callback`
  - `https://your-production-domain.com/auth/sign-up-success`

### 5. 環境判定ロジック

アプリケーションは以下のロジックで環境を判定します：

- **開発環境**: `NODE_ENV === 'development'`
- **ステージング環境**: `VERCEL_ENV === 'preview'`
- **本番環境**: `NODE_ENV === 'production'` かつ `VERCEL_ENV === 'production'`

### 6. デプロイ手順

#### ステージング環境
```bash
# ステージング環境にデプロイ
vercel --prod
```

#### 本番環境
```bash
# 本番環境にデプロイ
vercel --prod --target production
```

### 7. データ移行

既存のデータをステージング環境に移行する場合：

1. 本番データベースからデータをエクスポート
2. ステージングデータベースにインポート
3. 必要に応じてデータをクリーンアップ

### 8. セキュリティ考慮事項

- 各環境で異なるAPIキーを使用
- 本番環境のデータは定期的にバックアップ
- ステージング環境では本番データを使用しない
- 環境変数は適切に暗号化して保存
