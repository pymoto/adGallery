-- 代替アプローチ：管理者権限を別の方法で管理

-- 1. すべての既存ポリシーを削除
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;

-- 2. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. 基本的なユーザーポリシーを作成
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. 管理者用の特別なポリシーを作成（auth.uid()を直接チェック）
-- 注意：この方法は管理者が確実に設定されている場合のみ使用
CREATE POLICY "Admin full access" ON profiles
    FOR ALL USING (
        auth.uid() = '14e2b7a0-875a-486e-932d-c6846fc34377'::uuid
    );

-- 5. 結果確認
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled
FROM pg_class 
WHERE relname = 'profiles';

SELECT 
    polname AS policy_name,
    polcmd AS policy_command
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;
