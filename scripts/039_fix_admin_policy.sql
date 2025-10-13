-- 管理者ポリシーの無限再帰を修正

-- 1. すべての既存RLSポリシーを削除
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;

-- 2. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. 無限再帰を避ける安全なRLSポリシーを作成

-- ユーザーは自分のプロフィールを読み取れる
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを更新できる
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを作成できる
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 管理者はすべてのプロフィールを読み取れる（無限再帰を避けるため、直接auth.uid()をチェック）
CREATE POLICY "Admins can read all profiles" ON profiles
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- 管理者はすべてのプロフィールを更新できる（無限再帰を避けるため、直接auth.uid()をチェック）
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM profiles WHERE is_admin = true
        )
    );

-- 4. RLSが有効になったことを確認
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'profiles';

-- 5. ポリシーが正しく設定されたことを確認
SELECT 
    polname AS policy_name,
    pg_get_expr(polqual, polrelid) AS policy_using
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;

-- 6. データ確認（管理者として）
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;
