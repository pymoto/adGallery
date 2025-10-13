# Adscopia

クリエイティブな広告デザインを発見し、インスピレーションを得るプラットフォーム

## 機能

- 広告の投稿・閲覧
- ユーザー認証（Supabase）
- いいね機能
- タグ検索・カテゴリフィルター
- マイページ（自分の広告管理）
- 広告の編集・削除

## 技術スタック

- Next.js 15
- TypeScript
- Supabase
- Tailwind CSS
- Shadcn UI

## セットアップ

1. リポジトリをクローン
2. 依存関係をインストール
   ```bash
   npm install
   ```
3. 環境変数を設定
   - `.env.local` ファイルを作成
   - Supabaseの認証情報を設定
4. 開発サーバーを起動
   ```bash
   npm run dev
   ```

## 環境変数

`.env.local` ファイルに以下の環境変数を設定してください：

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## ライセンス

MIT