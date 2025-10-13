-- 最終的なRLS修正（完全リセット）

-- 1. すべてのRLSポリシーを削除
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;

-- 2. RLSを完全に無効化（一時的）
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. データ確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 注意: 現在RLSが無効になっているため、セキュリティが低下しています
-- デバッグが完了したら、正しいRLSポリシーを設定する必要があります
