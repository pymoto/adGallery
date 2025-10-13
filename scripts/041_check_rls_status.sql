-- 現在のRLS状態を確認

-- 1. profilesテーブルのRLS状態を確認
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled
FROM pg_class 
WHERE relname = 'profiles';

-- 2. 現在のRLSポリシーを確認
SELECT 
    polname AS policy_name,
    polcmd AS policy_command,
    pg_get_expr(polqual, polrelid) AS policy_using
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;

-- 3. 現在のユーザー情報を確認
SELECT 
    auth.uid() AS current_user_id,
    auth.email() AS current_user_email;

-- 4. profilesテーブルのデータを確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC
LIMIT 5;
