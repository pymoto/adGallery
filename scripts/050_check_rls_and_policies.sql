-- RLSとポリシーの確認

-- 1. adsテーブルのRLS状態を確認
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled
FROM pg_class 
WHERE relname = 'ads';

-- 2. adsテーブルのRLSポリシーを確認
SELECT 
    polname AS policy_name,
    polcmd AS policy_command,
    pg_get_expr(polqual, polrelid) AS policy_using
FROM pg_policy
WHERE polrelid = 'public.ads'::regclass;

-- 3. 現在のユーザー情報を確認
SELECT 
    auth.uid() AS current_user_id,
    auth.email() AS current_user_email;

-- 4. adsテーブルの最新データを確認
SELECT 
    id,
    title,
    is_published,
    user_id,
    created_at
FROM ads 
ORDER BY created_at DESC
LIMIT 5;
