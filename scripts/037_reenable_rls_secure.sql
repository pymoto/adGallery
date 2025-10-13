-- RLSを再有効化して、安全なポリシーを設定

-- 1. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. 安全なRLSポリシーを作成

-- ユーザーは自分のプロフィールを読み取れる
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを更新できる
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを作成できる
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 管理者はすべてのプロフィールを読み取れる
CREATE POLICY "Admins can read all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 管理者はすべてのプロフィールを更新できる
CREATE POLICY "Admins can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 3. RLSが有効になったことを確認
SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'profiles';

-- 4. ポリシーが正しく設定されたことを確認
SELECT 
    polname AS policy_name,
    pg_get_expr(polqual, polrelid) AS policy_using
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;

-- 5. データ確認（管理者として）
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;
