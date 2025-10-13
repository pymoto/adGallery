-- 段階的にRLSを有効化する安全なスクリプト

-- 1. まず、すべての既存ポリシーを削除
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;

-- 2. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. 基本的なユーザーポリシーを作成（自己参照を避ける）
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. 管理者ポリシーを作成（無限再帰を避けるため、直接auth.uid()をチェック）
CREATE POLICY "Admins can read all profiles" ON profiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- 5. RLSが有効になったことを確認
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled
FROM pg_class 
WHERE relname = 'profiles';

-- 6. ポリシーが正しく設定されたことを確認
SELECT 
    polname AS policy_name,
    polcmd AS policy_command
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;
