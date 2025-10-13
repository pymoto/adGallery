-- RLSポリシーの確認
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- 現在のRLS設定
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'profiles';

-- 管理者権限で直接クエリ（RLSをバイパス）
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- RLSポリシーを一時的に無効化してテスト
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 再度クエリを実行
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- RLSを再有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
