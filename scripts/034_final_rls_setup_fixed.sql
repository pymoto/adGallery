-- 最終的なRLSセットアップ（修正版）

-- 1. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 2. シンプルで安全なRLSポリシーを作成

-- ユーザーは自分のプロフィールを読み取れる
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを更新できる
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを作成できる
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 管理者はすべてのプロフィールを管理できる
CREATE POLICY "Admins can manage all profiles" ON profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 3. 結果確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 4. RLSポリシーの確認（簡易版）
SELECT 
    polname AS policy_name,
    pg_get_expr(polqual, polrelid) AS policy_using
FROM pg_policy
WHERE polrelid = 'public.profiles'::regclass;
