-- 無限再帰エラーを修正する緊急スクリプト

-- 1. 問題のある管理者ポリシーを削除
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- 2. 基本的なユーザーポリシーは保持
-- (これらは無限再帰を起こさない)

-- 3. 管理者用の安全なポリシーを作成（直接ID指定）
CREATE POLICY "Admin full access" ON profiles
    FOR ALL USING (
        auth.uid() = '14e2b7a0-875a-486e-932d-c6846fc34377'::uuid
    );

-- 4. 結果確認
SELECT 
    polname AS policy_name,
    polcmd AS policy_command
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;
