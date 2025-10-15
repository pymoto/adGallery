-- ステージング環境で管理者権限を付与するスクリプト
-- 使用方法: ユーザーIDとメールアドレスを置き換えて実行

-- 1. ユーザーのプロファイルを作成（存在しない場合）
INSERT INTO public.profiles (id, email, is_admin, created_at)
VALUES (
  'YOUR_USER_ID_HERE',  -- ここにユーザーIDを入力
  'YOUR_EMAIL_HERE',    -- ここにメールアドレスを入力
  true,  -- 管理者権限を付与
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  is_admin = true,
  updated_at = NOW();

-- 2. 管理者権限の確認
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM public.profiles 
WHERE id = 'YOUR_USER_ID_HERE';

-- 3. 管理者権限の一覧表示
SELECT 
  id,
  email,
  is_admin,
  created_at
FROM public.profiles 
WHERE is_admin = true
ORDER BY created_at DESC;

